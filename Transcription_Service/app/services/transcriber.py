from app.whisper_model import model


def transcribe_audio(path: str, language: str = None, task: str = "transcribe") -> dict:
    result = model.transcribe(
        path,
        language=language,
        task=task
    )
    return result
