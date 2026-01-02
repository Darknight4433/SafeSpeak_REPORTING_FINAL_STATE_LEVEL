from intent_model import ai_brain


def test_override_snippet_teacher():
    text = "I am threatened by my teacher and she says she'll give me to the police and kill me"
    res = ai_brain.analyze(text)
    assert res['risk_level'] == 'L3'
    assert 'override' in res
    assert res['override']['patternId'] == 'teacher_involved' or 'teacher' in res['override']['reason'].lower()
    assert 'snippet' in res['override'] and len(res['override']['snippet']) > 0


def test_override_snippet_kill():
    text = "they told me they would kill me"
    res = ai_brain.analyze(text)
    assert res['risk_level'] == 'L3'
    assert 'override' in res
    assert res['override']['patternId'] == 'physical_violence_or_threat' or 'kill' in res['override']['reason'].lower()
    assert 'snippet' in res['override'] and len(res['override']['snippet']) > 0
