from flask import Flask
from flask_cors import CORS
from app.core.config import Config
from app.core.database import db
from app.api.routes.health import health_bp
from app.api.routes.transcription import transcription_bp
from app.api.routes.search import search_bp
import os

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Create necessary directories
    instance_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'instance')
    temp_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'temp')
    logs_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'logs')

    # Create directories if they don't exist
    for directory in [instance_dir, temp_dir, logs_dir]:
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