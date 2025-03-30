import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class Config:
    # Flask settings
    SECRET_KEY = os.getenv('SECRET_KEY', 'dev-secret-key')
    DEBUG = os.getenv('DEBUG', 'False').lower() == 'true'

    # Database settings
    DATABASE_FOLDER = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 'instance')
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL', f'sqlite:///{os.path.join(DATABASE_FOLDER, "transcriptions.db")}')
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # File upload settings
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16MB max file size
    UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 'temp')
    ALLOWED_EXTENSIONS = {'mp3', 'wav'}

    # Whisper model settings
    WHISPER_MODEL = os.getenv('WHISPER_MODEL', 'openai/whisper-tiny')

    # Logging settings
    LOG_LEVEL = os.getenv('LOG_LEVEL', 'INFO')
    LOG_FILE = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 'logs', 'app.log')

class TestConfig(Config):
    """Test configuration."""
    TESTING = True
    # Use in-memory SQLite database for testing
    SQLALCHEMY_DATABASE_URI = 'sqlite:///:memory:'
