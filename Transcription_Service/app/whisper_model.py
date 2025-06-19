import whisper
from app.config import MODEL_NAME

model = whisper.load_model(MODEL_NAME)