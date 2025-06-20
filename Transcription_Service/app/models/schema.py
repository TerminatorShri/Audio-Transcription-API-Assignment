from pydantic import BaseModel
from typing import Optional, List


class TranscriptionRequest(BaseModel):
    fileUrl: str
    language: str | None = None
    task: str = "transcribe"


class TranscriptionResponse(BaseModel):
    text: str
    segments: Optional[List[dict]] = None
