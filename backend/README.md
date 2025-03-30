# Transcription API Server

A Flask-based API server for handling audio transcriptions using OpenAI's Whisper model.

## Features

- Audio file transcription using Whisper-tiny model
- File upload and processing
- Database storage for transcriptions
- Search functionality
- Health check endpoint
- CORS support
- Environment-based configuration

## Prerequisites

- Python 3.12 or higher
- pip (Python package manager)
- Virtual environment (recommended)

## Project Structure

```
backend/
├── app/
│   ├── api/            # API routes and endpoints
│   ├── core/           # Core configurations and database setup
│   ├── models/         # Database models
│   └── services/       # Business logic and services
├── instance/           # SQLite database files
├── tests/              # Test files
├── logs/              # Application logs
├── temp/              # Temporary file storage
├── .env               # Environment variables
├── .env.example       # Example environment variables
├── requirements.txt   # Python dependencies
└── run.py            # Application entry point
```

## Setup

1. Clone the repository and navigate to the backend directory:
```bash
cd backend
```

2. Create and activate a virtual environment:
```bash
# Windows
python -m venv venv
.\venv\Scripts\activate

# Linux/Mac
python3 -m venv venv
source venv/bin/activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

## Running the Server

1. Make sure your virtual environment is activated:
```bash
# Windows
.\venv\Scripts\activate

# Linux/Mac
source venv/bin/activate
```

2. Start the development server:
```bash
python run.py
```

The server will start on `http://localhost:5000` by default. The database and tables will be automatically created on first run.

## API Endpoints

### Health Check
- **GET** `/health`
- Returns the health status of the API

### Transcribe Audio
- **POST** `/transcribe`
- Accepts audio file upload
- Request body: multipart/form-data with field 'file'
- Returns transcription result

### Get Transcriptions
- **GET** `/transcriptions`
- Returns all transcriptions from the database

### Search Transcriptions
- **GET** `/search?q=query`
- Returns transcriptions matching the search query in filename

## Development

### Running Tests

1. Make sure your virtual environment is activated:
```bash
# Windows
.\venv\Scripts\activate

# Linux/Mac
source venv/bin/activate
```

2. Run test
```bash
# Run all tests
pytest

# Run specific test file
pytest tests/api/routes/test_health.py
```
