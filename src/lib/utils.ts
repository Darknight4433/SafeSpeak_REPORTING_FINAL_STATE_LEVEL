import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Lightweight client-side detector for high-severity keywords
export function detectHighSeverityKeywords(text: string): { matched: boolean; reason?: string; patternId?: string } {
  if (!text) return { matched: false };
  const lowered = text.toLowerCase();

  // PRIORITY 1: Teacher/staff detection (must run FIRST before other patterns)
  // Context-aware teacher/staff detection: check surrounding words for harmful vs protective verbs
  // Enhanced pattern to catch common abbreviations like "tr" (teacher)
  const teacherRegex = /\b(teacher|t\s*\.?\s*r|tr|mr\.?|ms\.?|sir|madam|staff|faculty|prof)\b/gi;
  let match: RegExpExecArray | null;

  // Define small verb lists; keep these conservative to avoid false positives
  const harmfulVerbs = ['kill', 'stab', 'beat', 'hit', 'punch', 'abuse', 'molest', 'harass', 'harassed', 'threaten', 'threatened', 'assault', 'hurt', 'raped', 'touched', 'force', 'slap', 'slapped', 'kick', 'kicked'];
  const protectiveVerbs = ['help', 'helped', 'saved', 'protect', 'protected', 'stop', 'stopped', 'prevent', 'rescued', 'defend', 'defended', 'comfort', 'support', 'supported'];

  while ((match = teacherRegex.exec(lowered)) !== null) {
    const idx = match.index;
    // examine a larger window around the match (approx 80 chars either side to catch more context)
    const start = Math.max(0, idx - 80);
    const end = Math.min(lowered.length, idx + 80);
    const window = lowered.slice(start, end);

    // If any harmful verb appears nearby -> teacher involved in harm
    for (const v of harmfulVerbs) {
      const r = new RegExp('\\b' + v + '\\w*\\b'); // Match word variations like "harassed", "harassing"
      if (r.test(window)) return { matched: true, reason: 'Teacher/staff implicated', patternId: 'teacher_involved' };
    }

    // If protective verb appears nearby, mark as protector (non-escalating)
    for (const v of protectiveVerbs) {
      const r = new RegExp('\\b' + v + '\\w*\\b');
      if (r.test(window)) return { matched: true, reason: 'Teacher mentioned as protector', patternId: 'teacher_protector' };
    }

    // If neither appear nearby, still return a neutral mention (do NOT escalate)
    return { matched: true, reason: 'Teacher mentioned', patternId: 'teacher_mentioned' };
  }

  // PRIORITY 2: Other high-severity patterns (only if teacher not detected)
  const patterns: { reason: string; regex: RegExp; patternId: string }[] = [
    { reason: 'Physical threat', regex: /\b(kill|stab|shoot|threat|threaten|assault|hit|punch|beat|weapon|kidnap|force|intimidate|blackmail|choke|strangle)\b/, patternId: 'physical_threat' },
    { reason: 'Sexual abuse', regex: /\b(rape|sexual|molest|touch me|sexually|sexual assault|abuse)\b/, patternId: 'sexual_abuse' },
    { reason: 'Self harm', regex: /\b(suicide|kill myself|end my life|cut myself)\b/, patternId: 'self_harm' },
  ];

  for (const p of patterns) {
    if (p.regex.test(lowered)) return { matched: true, reason: p.reason, patternId: p.patternId };
  }

  return { matched: false };
}

// Create a short sanitized snippet for non-technical reviewers
export function makeSanitizedSnippet(text: string, length = 80) {
  if (!text) return '';
  // redact emails and long digit sequences
  let s = text.replace(/[\w.+-]+@[\w-]+\.[\w.-]+/g, '[redacted]');
  s = s.replace(/\b\d{6,}\b/g, '[redacted]');
  s = s.replace(/\s+/g, ' ').trim();
  if (s.length <= length) return s;
  // try to cut at a sentence boundary if possible
  const idx = s.indexOf('.', 60);
  if (idx !== -1 && idx < length) return s.slice(0, idx + 1);
  return s.slice(0, length).trim() + '…';
}
