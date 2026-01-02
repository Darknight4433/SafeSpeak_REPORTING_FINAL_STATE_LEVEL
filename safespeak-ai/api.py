from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import logging

# Modules
from preprocess import clean_text
from intent_model import ai_brain
from sentiment import sentiment_analyzer

# We removed rules, risk_engine, and prank_filter. 
# The "Real AI" (ai_brain) now handles all of this elegantly.

app = FastAPI(title="SafeSpeak AI Core")

# Add CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Enable logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("safespeak-ai")

class ReportInput(BaseModel):
    text: str

class ReportOutput(BaseModel):
    category: str
    sentiment: str
    risk_score: int
    risk_level: str
    route_to: str
    human_review_required: bool = True
    details: dict

@app.post("/analyze", response_model=ReportOutput)
def analyze_report(report: ReportInput):
    raw_text = report.text
    if not raw_text:
        raise HTTPException(status_code=400, detail="Text is required")

    # 1. Text Preprocessing (Still useful for noise reduction)
    cleaned_text = clean_text(raw_text)

    # 2. REAL AI ANALYSIS (Zero-Shot)
    # The brain works on the concept, not rules.
    try:
        ai_result = ai_brain.analyze(cleaned_text) or {}
    except Exception as e:
        logger.exception("ai_brain.analyze failed")
        raise HTTPException(status_code=500, detail=f"AI analysis failed: {e}")

    # 3. Sentiment Analysis (Supporting Data)
    try:
        emotion_data = sentiment_analyzer.analyze(cleaned_text) or {}
    except Exception as e:
        logger.exception("sentiment_analyzer.analyze failed")
        emotion_data = {}
    primary_emotion = emotion_data.get("primary_emotion", "neutral")

    # 4. Construct Final Decision
    # Provide defaults if ai_result is missing expected keys.
    risk_level = ai_result.get("risk_level", "L1")
    route_to = ai_result.get("route_to", "staff")
    category = ai_result.get("category", "other")
    try:
        confidence = float(ai_result.get("confidence", 0.5))
    except Exception:
        confidence = 0.5

    # Map confidence to a "score" 0-100 for the UI visualization
    base_score_map = {"L0": 10, "L1": 40, "L2": 70, "L3": 95}
    base_score = base_score_map.get(risk_level, 50)

    # Adjust score slightly based on confidence (confidence expected 0.0-1.0)
    confidence_modifier = int(max(0.0, min(1.0, confidence)) * 10) # 0 to 10
    final_score = min(100, base_score + confidence_modifier)

    response = {
        "category": category,
        "sentiment": primary_emotion,
        "risk_score": final_score,
        "risk_level": risk_level,
        "route_to": route_to,
        "human_review_required": True,
        "details": {
            "ai_confidence": confidence,
            "ai_logic": "Zero-Shot Transformer Reasoning",
            "full_emotion_data": emotion_data,
            "original_text": raw_text
        }
    }

    # Include override information (readable, sanitized) for auditing if present
    if isinstance(ai_result, dict) and ai_result.get("override"):
        response["details"]["override"] = ai_result["override"]

    return response

@app.post('/transcribe')
async def transcribe_audio(file: UploadFile = File(...)):
    """Accepts an audio file (multipart/form-data) and returns a transcript.
    If local Whisper is not available, returns 501 with instructions.
    """
    if not file:
        raise HTTPException(status_code=400, detail="No audio file provided")

    content = await file.read()
    if not content:
        raise HTTPException(status_code=400, detail="Empty audio file")

    # Try to import whisper (openai-whisper). If missing, return 501.
    try:
        import whisper
    except Exception:
        raise HTTPException(
            status_code=501,
            detail="STT not configured on server. Install 'openai-whisper' or configure an external STT provider."
        )

    try:
        model = whisper.load_model('small')
        import tempfile
        with tempfile.NamedTemporaryFile(suffix='.wav', delete=True) as tmp:
            tmp.write(content)
            tmp.flush()
            result = model.transcribe(tmp.name)
            transcript = result.get('text', '').strip()
            return {"transcript": transcript}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Transcription failed: {e}")

@app.get("/")
def health_check():
    return {"status": "ok", "service": "SafeSpeak Real AI", "mode": "Deep Learning (BART-Large)"}
