from transformers import pipeline
import logging
from typing import Dict

logger = logging.getLogger(__name__)

class RealAI:
    def __init__(self):
        logger.info("Loading Real AI (Zero-Shot Transformer)...")
        # Using a highly capable Zero-Shot model
        # This model understands the MEANING of categories without training.
        try:
            self.classifier = pipeline("zero-shot-classification", 
                                     model="facebook/bart-large-mnli")
            logger.info("Real AI loaded successfully.")
            self.is_ready = True
        except Exception as e:
            logger.error(f"Failed to load Real AI: {e}")
            self.is_ready = False

    def analyze(self, text: str):
        if not self.is_ready:
            return {"category": "error", "risk_level": "L0", "confidence": 0}

        # Quick keyword-based override for high severity terms (safety-critical)
        # This ensures critical cases are escalated even if the model misses them.
        keywords_map = {
            "physical violence or threat": [
                r"\bkill\b", r"\bstab\b", r"\bshoot\b", r"\bthreaten\b", r"\bthreat\b", r"\bassault\b",
                r"\bhit\b", r"\bpunch\b", r"\bbeat\b", r"\bweapon\b", r"\bkidnap\b", r"\bforce\b",
                r"\bintimidat(e|ion)\b", r"\bblackmail\b", r"\bchoke\b", r"\bstrangl(e|ed)\b"
            ],
            "sexual abuse or harassment": [
                r"\br*pe\b", r"\bsexual\b", r"\btouch me\b", r"\bmolest\b", r"\bsexually\b", r"\babuse\b", r"\bsexual assault\b"
            ],
            "self harm or suicide": [
                r"\bsuicide\b", r"\bkill myself\b", r"\bend my life\b", r"\bcut myself\b"
            ]
        }

        lower_text = text.lower()

        # Helper to build sanitized snippet
        import re
        def _make_snippet(full_text: str, max_len: int = 80):
            # redact emails
            s = re.sub(r"[\w.+-]+@[\w-]+\.[\w.-]+", "[redacted]", full_text)
            # redact phone-ish sequences
            s = re.sub(r"\b\d{6,}\b", "[redacted]", s)
            s = re.sub(r"\s+", " ", s).strip()
            if len(s) <= max_len:
                return s
            # try to cut at sentence boundary
            idx = s.find('.', 60)
            if idx != -1 and idx < max_len:
                return s[:idx+1]
            return s[:max_len].rstrip() + '…'

        # Teacher / staff involvement patterns - enhanced to catch abbreviations like 'tr'
        # Check for teacher mentions with harmful context nearby
        teacher_pattern = r'\b(teacher|t\s*\.?\s*r|tr|mr\.?|ms\.?|sir|madam|staff|faculty|prof)\b'
        harmful_context = r'\b(harass|harassed|beat|hit|punch|abuse|molest|threaten|threatened|assault|hurt|rape|raped|touched|force|slap|slapped|kick|kicked)\b'
        
        # If we find a teacher mention, check for harmful verbs in a wider context window
        teacher_matches = list(re.finditer(teacher_pattern, lower_text, re.IGNORECASE))
        for tmatch in teacher_matches:
            idx = tmatch.start()
            # Check 80 chars before and after for context
            start = max(0, idx - 80)
            end = min(len(lower_text), idx + 80)
            window = lower_text[start:end]
            
            if re.search(harmful_context, window, re.IGNORECASE):
                logger.info("Keyword override: teacher/staff with harmful context detected; escalating to L3.")
                snippet = _make_snippet(text)
                override = {
                    "type": "keyword",
                    "patternId": "teacher_involved",
                    "reason": "Teacher/staff implicated",
                    "pattern": "teacher_involved",
                    "snippet": snippet
                }
                # escalate immediately if a teacher/staff is implicated
                return self._map_to_risk("physical violence or threat", 0.99, override)

        for cat, patterns in keywords_map.items():
            for p in patterns:
                if re.search(p, lower_text):
                    # high confidence override
                    logger.info(f"Keyword override matched pattern {p!r} in text; escalating to {cat}")
                    snippet = _make_snippet(text)
                    override = {
                        "type": "keyword",
                        "patternId": cat.replace(' ', '_'),
                        "reason": cat,
                        "pattern": p,
                        "snippet": snippet
                    }
                    return self._map_to_risk(cat, 0.99, override)

        # Fallback: if the word 'threat' exists anywhere, escalate as a precaution
        if re.search(r"\bthreat\b", lower_text):
            logger.info("Fallback 'threat' word found; escalating to L3.")
            snippet = _make_snippet(text)
            override = {
                "type": "keyword",
                "patternId": "threat_word",
                "reason": "Contains word 'threat'",
                "pattern": "threat",
                "snippet": snippet
            }
            return self._map_to_risk("physical violence or threat", 0.99, override)

        # We define the concepts we want the AI to look for.
        # The AI compares the text to these concepts conceptually.
        candidate_labels = [
            "bullying and harassment",
            "physical violence or threat",
            "sexual abuse or harassment",
            "self harm or suicide",
            "emotional distress or anxiety",
            "academic pressure",
            "harmless joke or prank",
            "neutral statement"
        ]

        # precise multi-label=False because we want the ONE best fit
        result = self.classifier(text, candidate_labels, multi_label=False)
        
        # Result structure: {'labels': [...], 'scores': [...]}
        top_category = result['labels'][0]
        confidence = result['scores'][0]
        
        return self._map_to_risk(top_category, confidence)
    def _map_to_risk(self, category: str, confidence: float, override: dict = None):
        """
        Maps the AI's understanding to SafeSpeak Risk Levels.
        Optionally attach an `override` dict for safety-critical heuristics so it can be audited.
        """
        # Default
        risk_level = "L1"
        target = "Counselor"
        
        if category == "self harm or suicide":
            risk_level = "L3"
            target = "Immediate Emergency Services"
        elif category == "physical violence or threat":
            risk_level = "L3" # Immediate danger
            target = "Principal & Security"
        elif category == "sexual abuse or harassment":
            risk_level = "L3"
            target = "Child Protection Officer"
        elif category == "bullying and harassment":
            risk_level = "L2"
            target = "School Authority"
        elif category == "emotional distress or anxiety":
            risk_level = "L1"
            target = "School Counselor"
        elif category == "academic pressure":
            risk_level = "L1"
            target = "Academic Advisor"
        elif category == "harmless joke or prank":
            risk_level = "L0"
            target = "System Logs (Filtered)"
        elif category == "neutral statement":
            risk_level = "L0"
            target = "System Logs"

        out = {
            "category": category,
            "risk_level": risk_level,
            "route_to": target,
            "confidence": round(confidence, 4)
        }

        if override:
            out["override"] = override

        return out

# Singleton
ai_brain = RealAI()

class _AIBrain:
    def analyze(self, text: str) -> Dict:
        """Simple rule-based fallback to mimic expected AI output structure."""
        t = (text or "").lower()
        result = {
            "category": "general",
            "risk_level": "L0",
            "route_to": "none",
            "confidence": 0.5
        }

        # High urgency: self-harm or explicit intent
        if any(k in t for k in ["suicide", "kill myself", "end my life"]):
            result.update({"category": "self-harm", "risk_level": "L3", "route_to": "immediate_safety", "confidence": 0.95})
            return result

        # Threat to others or violent intent
        if any(k in t for k in ["i will kill", "i'll kill", "i will hurt", "i will harm"]):
            result.update({"category": "threat", "risk_level": "L3", "route_to": "law_enforcement", "confidence": 0.9})
            return result

        # Harassment / bullying
        if any(k in t for k in ["stupid", "idiot", "shut up", "die"]):
            result.update({"category": "harassment", "risk_level": "L2", "route_to": "moderation", "confidence": 0.75})
            return result

        # sexual / explicit but non-violent
        if any(k in t for k in ["porn", "sexual", "nsfw"]):
            result.update({"category": "sexual_content", "risk_level": "L2", "route_to": "moderation", "confidence": 0.8})
            return result

        # Default low risk
        return result

# Expose a singleton-like object matching original usage
ai_brain = _AIBrain()
