from flask import Flask
from flask_cors import CORS
from app.core.config import Config
from app.api.routes.health import health_bp
import os

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    app.register_blueprint(health_bp)

    return app