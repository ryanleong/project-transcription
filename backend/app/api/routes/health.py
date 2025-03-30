from flask import Blueprint, jsonify
from datetime import datetime, UTC
import os

health_bp = Blueprint('health', __name__)

@health_bp.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now(UTC).isoformat(),
        'environment': os.getenv('FLASK_ENV', 'development')
    }), 200
