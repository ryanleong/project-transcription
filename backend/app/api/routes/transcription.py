from flask import Blueprint, request, jsonify
import os
from app.core.database import db
from app.models.transcription import Transcription
from app.services.audio_service import AudioService
from app.services.transcription_service import TranscriptionService
from app.core.config import Config

transcription_bp = Blueprint('transcription', __name__)
audio_service = AudioService()
transcription_service = TranscriptionService()

@transcription_bp.route('/transcribe', methods=['POST'])
def transcribe():
    if not request.files:
        return jsonify({'error': 'No file provided'}), 400

    try:
        file = request.files['file']
        if not file:
            return jsonify({'error': 'No file provided'}), 400

        # Check if filename already exists in database
        existing_transcription = Transcription.query.filter_by(filename=file.filename).first()
        if existing_transcription:
            return jsonify({
                'error': 'File already transcribed',
                'message': f'A transcription for "{file.filename}" already exists'
            }), 409

        # Save the uploaded file temporarily
        os.makedirs(Config.UPLOAD_FOLDER, exist_ok=True)
        temp_path = os.path.join(Config.UPLOAD_FOLDER, file.filename)
        file.save(temp_path)

        # Resample the audio if necessary
        resampled_path = audio_service.resample_audio(temp_path)

        # Load the resampled audio
        audio, sr = audio_service.load_audio(resampled_path)

        # Transcribe the audio
        transcription_text = transcription_service.transcribe(audio, sr)

        # Create new transcription record
        new_transcription = Transcription(
            filename=file.filename,
            transcribed_text=transcription_text
        )

        # Save to database
        db.session.add(new_transcription)
        db.session.commit()

        # Clean up temporary files
        os.remove(temp_path)
        os.remove(resampled_path)

        return jsonify(new_transcription.to_dict()), 201

    except Exception as e:
        return jsonify({
            'error': 'Failed to transcribe audio',
            'message': str(e)
        }), 500

@transcription_bp.route('/transcriptions', methods=['GET'])
def get_transcriptions():
    try:
        # Query all transcriptions from the database
        transcriptions = Transcription.query.all()

        # Convert each transcription to a dictionary using the to_dict method
        result = [transcription.to_dict() for transcription in transcriptions]

        return jsonify(result), 200
    except Exception as e:
        return jsonify({
            'error': 'Failed to fetch transcriptions',
            'message': str(e)
        }), 500