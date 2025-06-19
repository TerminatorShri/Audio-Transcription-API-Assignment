import os
import uuid
from fastapi import UploadFile
from app.config import TEMP_DIR

os.makedirs(TEMP_DIR, exist_ok=True)


def save_temp_file(file: UploadFile) -> str:
    filename = f"{uuid.uuid4()}_{file.filename}"
    path = os.path.join(TEMP_DIR, filename)
    with open(path, "wb") as buffer:
        buffer.write(file.file.read())
    return path


def delete_file(path: str):
    if os.path.exists(path):
        os.remove(path)
