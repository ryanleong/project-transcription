import pytest
from unittest.mock import Mock, patch
from app.models.transcription import Transcription
from app.core.database import db

@pytest.fixture
def existing_transcription(app):
    """Create an existing transcription in the database."""
    with app.app_context():
        transcription = Transcription(
            filename="existing_audio.wav",
            transcribed_text="Existing transcription"
        )
        db.session.add(transcription)
        db.session.commit()
        yield transcription
        db.session.delete(transcription)
        db.session.commit()

def test_get_transcriptions(client, existing_transcription):
    """Test getting all transcriptions."""
    response = client.get('/transcriptions')

    assert response.status_code == 200
    data = response.get_json()
    assert isinstance(data, list)
    assert len(data) > 0

    # Check structure of first transcription
    first_transcription = data[0]
    assert 'uuid' in first_transcription
    assert 'filename' in first_transcription
    assert 'transcribed_text' in first_transcription
    assert 'created_at' in first_transcription

def test_get_transcriptions_error(client):
    """Test getting transcriptions when database fails."""
    with patch('app.api.routes.transcription.Transcription') as mock:
        mock.query.all.side_effect = Exception("Database error")
        response = client.get('/transcriptions')

    assert response.status_code == 500
    data = response.get_json()
    assert data['error'] == 'Failed to fetch transcriptions'
    assert data['message'] == 'Database error'
