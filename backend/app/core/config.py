import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Get the absolute path to the backend directory
BACKEND_DIR = os.path.abspath(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))

class Config:
    # Flask settings
    SECRET_KEY = os.getenv('SECRET_KEY', 'dev-secret-key')
    DEBUG = os.getenv('DEBUG', 'False').lower() == 'true'

    # Database settings
    DATABASE_FOLDER = os.path.join(BACKEND_DIR, 'instance')
    DB_FILE = os.path.join(DATABASE_FOLDER, "transcriptions.db")
    # Use file:/// protocol for absolute path
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL', f'sqlite:///{DB_FILE.replace(os.sep, "/")}')
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # File upload settings
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16MB max file size
    UPLOAD_FOLDER = os.path.join(BACKEND_DIR, 'temp')
    ALLOWED_EXTENSIONS = {'mp3', 'wav'}

    # Whisper model settings
    WHISPER_MODEL = os.getenv('WHISPER_MODEL', 'openai/whisper-tiny')

    # Logging settings
    LOG_LEVEL = os.getenv('LOG_LEVEL', 'INFO')
    LOG_FILE = os.path.join(BACKEND_DIR, 'logs', 'app.log')

    def __init__(self):
        # Ensure the database URI is set with the full path
        self.SQLALCHEMY_DATABASE_URI = f'sqlite:///{self.DB_FILE.replace(os.sep, "/")}'

class TestConfig(Config):
    """Test configuration."""
    TESTING = True
    # Use in-memory SQLite database for testing
    SQLALCHEMY_DATABASE_URI = 'sqlite:///:memory:'
