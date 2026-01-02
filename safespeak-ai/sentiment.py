from transformers import pipeline
import logging
from typing import Dict

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class SentimentEngine:
    def __init__(self):
        self.classifier = None
        try:
            # Using a distilled emotion model for efficiency
            # Options: 'j-hartmann/emotion-english-distilroberta-base' or similar
            # If this is too heavy, one could fallback to nltk or rules.
            logger.info("Loading sentiment model...")
            self.classifier = pipeline("text-classification", model="j-hartmann/emotion-english-distilroberta-base", top_k=None)
            logger.info("Sentiment model loaded.")
        except Exception as e:
            logger.error(f"Failed to load transformer model: {e}")
            self.classifier = None

    def analyze(self, text: str) -> dict:
        """
        Returns: { "primary_emotion": str, "scores": dict }
        Emotions: fear, sadness, anger, neutral, etc.
        """
        if not self.classifier:
            return {"primary_emotion": "neutral", "scores": {}}

        # classifier returns a list of lists of dicts (top_k=None returns all scores)
        results = self.classifier(text)[0]
        # results looks like [{'label': 'joy', 'score': 0.9}, ...]
        
        scores = {res['label']: res['score'] for res in results}
        
        # Get highest score
        primary = max(scores, key=scores.get)
        
        return {
            "primary_emotion": primary,
            "scores": scores
        }

def heuristic_analyze(text: str) -> Dict:
    """Very small heuristic sentiment analyzer for support/debugging."""
    t = (text or "").lower()
    if any(k in t for k in ["suicide", "kill myself", "end my life", "help me"]):
        primary = "sadness"
    elif any(k in t for k in ["angry", "rage", "hate", "kill you", "kill him", "kill her"]):
        primary = "anger"
    elif any(k in t for k in ["happy", "joy", "yay", "awesome"]):
        primary = "joy"
    elif "!" in t:
        primary = "surprise"
    else:
        primary = "neutral"

    # simple score stub
    scores = {"sadness": 0.0, "anger": 0.0, "joy": 0.0, "neutral": 0.0}
    scores[primary] = 1.0

    return {"primary_emotion": primary, "scores": scores}

sentiment_analyzer = SentimentEngine()
