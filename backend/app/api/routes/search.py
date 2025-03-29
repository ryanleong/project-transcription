from flask import Blueprint, request, jsonify
from app.models.transcription import Transcription

search_bp = Blueprint('search', __name__)

@search_bp.route('/search', methods=['GET'])
def search_transcriptions():
    query = request.args.get('q', '')

    if not query:
        return jsonify({'error': 'Search query is required'}), 400

    try:
        # Search in the database using filename column
        results = Transcription.query.filter(
            Transcription.filename.ilike(f'%{query}%')
        ).all()

        # Return empty array if no results found
        if not results:
            return jsonify([]), 200

        return jsonify([result.to_dict() for result in results]), 200
    except Exception as e:
        return jsonify({
            'error': 'Failed to search transcriptions',
            'message': str(e)
        }), 500