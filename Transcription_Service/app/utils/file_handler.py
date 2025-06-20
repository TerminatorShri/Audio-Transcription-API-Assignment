import os
import uuid
import httpx
from fastapi import UploadFile
from app.config import TEMP_DIR

# Ensure temp directory exists
os.makedirs(TEMP_DIR, exist_ok=True)


def save_temp_file(file: UploadFile) -> str:
    """
    Save uploaded file to temp directory.
    """
    filename = f"{uuid.uuid4()}_{file.filename}"
    path = os.path.join(TEMP_DIR, filename)
    with open(path, "wb") as buffer:
        buffer.write(file.file.read())
    return path


def delete_file(path: str) -> None:
    """
    Delete file at path if it exists.
    """
    if os.path.exists(path):
        os.remove(path)


def download_temp_file(file_url: str) -> str:
    """
    Download file from a URL to temp directory.
    """
    filename = f"{uuid.uuid4()}.wav"  # or you can parse file extension
    path = os.path.join(TEMP_DIR, filename)

    resp = httpx.get(file_url)
    resp.raise_for_status()

    with open(path, "wb") as buffer:
        buffer.write(resp.content)

    return path
