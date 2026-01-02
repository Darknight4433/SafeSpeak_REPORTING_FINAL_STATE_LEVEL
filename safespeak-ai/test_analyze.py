from intent_model import ai_brain

samples = [
    (
        "I am in threattered by my teacher my whole School hello hello can you hear hello and my teacher is very bad she makes me work 24 hour she told help this better than health is better than our own work we should do homework rather than go out I hate her",
        "no58"
    ),
    (
        "my name is Vaishnavi and I win threaten by my friends for a long time they have been making me work for hours never even giving me a break and by my teacher for not writing my notes and telling me that she would give me to the police and kill me",
        "no57"
    ),
]

for text, rid in samples:
    print(f"\n--- Report {rid} ---")
    print("Text:", text)
    result = ai_brain.analyze(text)
    print("Analyze result:", result)
    # Also run a small local keyword check similar to client
    from re import search
    lower = text.lower()
    keyword_patterns = {
        'physical threat': [r"\bkill\b", r"\bthreat\b", r"\bthreaten\b", r"\bpolice\b", r"teacher\b", r"tr\b"],
    }
    matched = False
    for k, patterns in keyword_patterns.items():
        for p in patterns:
            if search(p, lower):
                print(f"Keyword fallback matched: {k} (pattern {p})")
                matched = True
    if not matched:
        print("Keyword fallback: none matched")

print('\nFinished')
