from fastapi import APIRouter, UploadFile, File, Query, HTTPException
from app.utils.file_handler import save_temp_file, delete_file
from app.services.transcriber import transcribe_audio
from app.models.schema import TranscriptionResponse

router = APIRouter(tags=["Transcription"])


@router.post("/transcribe", response_model=TranscriptionResponse)
async def transcribe_endpoint(
    file: UploadFile = File(...),
    language: str = Query(None),
    task: str = Query("transcribe")
):
    if file.content_type not in ["audio/wav", "audio/mpeg", "audio/mp3", "audio/x-wav"]:
        raise HTTPException(
            status_code=400, detail="Unsupported audio format.")

    path = save_temp_file(file)

    try:
        result = transcribe_audio(path, language=language, task=task)
        return {"text": result["text"], "segments": result.get("segments")}
    finally:
        delete_file(path)
