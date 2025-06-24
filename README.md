# Audio Transcription API — Installation & Setup Guide

This project consists of:

* A **Transcription Service** (Python/FastAPI) for audio processing.
* A **Backend Service** (Node.js/Express) that queues jobs, handles authentication, and provides an API.

> The transcription service is designed to be private and only accessible via the backend.
> The backend implements basic rate limiting (switchable to Leaky Bucket / Token Bucket as needed).

---

## Prerequisites

* **Python 3.10** installed
* **Node.js 18** (or later) and npm
* **ffmpeg** installed and added to your system PATH

---

## 1) Clone the Repository

```bash
git clone <your-repo-url>
cd <project-directory>
```

---

## 2) Transcription Service Setup

```bash
cd Transcription_Service
```

#### Create and Activate Virtual Environment

```bash
# Create a virtual environment
python3.10 -m venv transcription_env

# Activate the virtual environment
source transcription_env/Scripts/activate   # Windows
# OR
source transcription_env/bin/activate       # Linux / Mac
```

#### Install Dependencies

```bash
pip install -r requirements.txt
```

#### Install ffmpeg

* **Windows**:
  [Download ffmpeg](https://ffmpeg.org/download.html), add its `bin` directory to your `PATH`.
* **Linux**:

  ```bash
  sudo apt-get update
  sudo apt-get install ffmpeg
  ```

---

## 3) Backend Service Setup

```bash
cd ../Backend
npm install
```

#### Create `.env` File

Copy `.env.example` to `.env` and fill in required values:

```bash
cp .env.example .env
```

Edit `.env` to match your environment.

---

## 4) Run Services

#### Transcription Service

```bash
source transcription_env/Scripts/activate           # Windows
# OR
source transcription_env/bin/activate               # Linux / Mac

uvicorn app.main:app --reload
```

#### Backend Service

```bash
npm run dev
```

---

## 5) Usage

* The **Backend** exposes REST APIs.
* The **Transcription Service** is private and only invoked by the backend.
* All requests are made through the backend.

---

## Notes

✅ This architecture allows the transcription service to remain isolated, making it more secure and maintainable.
✅ Rate limiting is implemented within the backend to prevent abuse and can be upgraded (to Leaky Bucket or Token Bucket) as needed.

---
