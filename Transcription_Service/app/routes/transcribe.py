from fastapi import APIRouter
from app.utils.file_handler import download_temp_file, delete_file
from app.services.transcriber import transcribe_audio
from app.models.schema import TranscriptionRequest, TranscriptionResponse

router = APIRouter(tags=["Transcription"])


@router.post("/transcribe", response_model=TranscriptionResponse)
async def transcribe_endpoint(
    request: TranscriptionRequest
):
    path = download_temp_file(request.fileUrl)
    try:
        result = transcribe_audio(
            path, language=request.language, task=request.task)
        return {"text": result["text"], "segments": result.get("segments")}
    finally:
        delete_file(path)
