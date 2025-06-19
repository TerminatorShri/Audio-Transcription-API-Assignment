from fastapi import FastAPI
from app.routes import transcribe

app = FastAPI(title="Transcription Service",
              description="API for audio transcription", version="1.0.0")
app.include_router(transcribe.router, prefix="/api/v1", tags=["Transcription"])
