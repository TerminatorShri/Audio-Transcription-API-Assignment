from pydantic import BaseModel
from typing import Optional, List


class TranscriptionResponse(BaseModel):
    text: str
    segments: Optional[List[dict]] = None
