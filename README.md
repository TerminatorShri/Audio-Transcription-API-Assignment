# Audio Transcription API — Installation & Setup Guide

This project consists of:

* A Transcription Service (Python/FastAPI) for audio processing.
* A Backend Service (Node.js/Express) that queues jobs, handles authentication, and provides the REST APIs.

> The transcription service is designed to be private and only accessible via the backend.
> The backend implements basic rate limiting (switchable to Leaky Bucket or Token Bucket) as needed.

---

## Prerequisites

* Python 3.10 installed
* Node.js 18 (or later) and npm
* ffmpeg installed and added to your system PATH

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

# Activate
source transcription_env/Scripts/activate    # Windows
source transcription_env/bin/activate        # Linux / Mac
```

#### Install Dependencies

```bash
pip install -r requirements.txt
```

#### Install FFmpeg

* Windows: [Download FFmpeg](https://ffmpeg.org/download.html), add its `bin` directory to your `PATH`.
* Linux:

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

```bash
cp .env.example .env
```

Edit `.env` as required.

---

## 4) Run Services

#### Transcription Service

```bash
source transcription_env/Scripts/activate    # Windows
source transcription_env/bin/activate        # Linux / Mac
uvicorn app.main:app --reload
```

#### Backend Service

```bash
npm run dev
```

---

## 5) Usage

* The Backend exposes REST APIs.
* The Transcription Service is private and only invoked via the backend.
* All requests must be made through the backend.

---

## 6) Viewing the API Documentation

### A) Swagger Editor

* Copy your `openapi.yml` or `openapi.json`.
* Open [https://editor.swagger.io/](https://editor.swagger.io/)
* Paste your spec to browse the API interactively.

### B) Viewing Locally

* Install `swagger-ui-watcher`:

  ```bash
  npm install -g swagger-ui-watcher
  ```
* Run:

  ```bash
  swagger-ui-watcher openapi.yml
  ```
* Open the URL (usually [http://127.0.0.1:3000](http://127.0.0.1:3000)) in your browser.

### C) Viewing in Visual Studio Code

* Install the **OpenAPI (Swagger) Editor** extension.
* Open `openapi.yml`.
* Click the **“Open Preview”** icon to view it right inside the editor.

---

## Notes

* This architecture allows the transcription service to remain isolated and secure.
* The backend implements basic rate limiting, making it extensible for future needs.
* The backend’s OpenAPI spec can be viewed via **Swagger Editor**, **Swagger-UI**, or the **OpenAPI Editor** extension in VSCode.

---

