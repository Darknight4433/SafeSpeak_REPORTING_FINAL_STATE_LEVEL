import os
import shutil
import subprocess
import tempfile
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
import wave
from vosk import Model, KaldiRecognizer

app = FastAPI()

MODEL_PATH = os.environ.get("VOSK_MODEL_PATH") or os.path.expanduser("~/.local/share/vosk-model-small-en-us-0.15")

if not os.path.exists(MODEL_PATH):
    print(f"Warning: Vosk model not found at {MODEL_PATH}. Please download a small model and set VOSK_MODEL_PATH or place model at default location.")
else:
    model = Model(MODEL_PATH)


@app.post("/transcribe")
async def transcribe(file: UploadFile = File(...)):
    # Save uploaded file to a temp file
    try:
        tmp_dir = tempfile.mkdtemp()
        input_path = os.path.join(tmp_dir, file.filename)
        with open(input_path, "wb") as out_f:
            content = await file.read()
            out_f.write(content)

        # Convert input to 16k mono WAV using ffmpeg
        wav_path = os.path.join(tmp_dir, "audio.wav")
        cmd = [
            "ffmpeg",
            "-y",
            "-i",
            input_path,
            "-ar",
            "16000",
            "-ac",
            "1",
            wav_path,
        ]
        subprocess.check_call(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

        # Read WAV and feed into Vosk recognizer
        wf = wave.open(wav_path, "rb")
        rec = KaldiRecognizer(model, wf.getframerate())
        rec.SetWords(True)

        results = []
        while True:
            data = wf.readframes(4000)
            if len(data) == 0:
                break
            if rec.AcceptWaveform(data):
                results.append(rec.Result())
        final = rec.FinalResult()

        # Cleanup
        shutil.rmtree(tmp_dir)

        # The recognizer returns JSON strings; return transcript by concatenating partial results
        import json
        transcripts = []
        try:
            for r in results:
                j = json.loads(r)
                if j.get("text"):
                    transcripts.append(j.get("text"))
            fj = json.loads(final)
            if fj.get("text"):
                transcripts.append(fj.get("text"))
        except Exception:
            pass

        transcript = " ".join(t for t in transcripts if t)
        return JSONResponse({"transcript": transcript})

    except subprocess.CalledProcessError:
        raise HTTPException(status_code=500, detail="Audio conversion failed (ffmpeg required)")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
