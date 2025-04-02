from flask import Flask
from flask_cors import CORS
from app.core.config import Config
from app.core.database import db
from app.api.routes.health import health_bp
from app.api.routes.transcription import transcription_bp
from app.api.routes.search import search_bp
import os

def create_app(config_class=Config):
    # Create config instance
    config = config_class()

    app = Flask(__name__)
    app.config.from_object(config)

    # Create necessary directories
    for directory in [app.config['DATABASE_FOLDER'], app.config['UPLOAD_FOLDER'], os.path.dirname(app.config['LOG_FILE'])]:
        os.makedirs(directory, exist_ok=True)

    # Initialize extensions
    CORS(app)
    db.init_app(app)

    # Register blueprints
    app.register_blueprint(health_bp)
    app.register_blueprint(transcription_bp)
    app.register_blueprint(search_bp)

    # Create database tables
    with app.app_context():
        db.create_all()

    return app