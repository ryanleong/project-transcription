import pytest
from app.models.transcription import Transcription
from app.core.database import db
from datetime import datetime, UTC

@pytest.fixture
def sample_transcriptions(app):
    """Create sample transcriptions for testing."""
    with app.app_context():
        # Create test transcriptions
        transcriptions = [
            Transcription(
                filename="test_meeting_1.mp3",
                transcribed_text="This is a test meeting transcription",
                created_at=datetime.now(UTC)
            ),
            Transcription(
                filename="important_document.mp3",
                transcribed_text="This is an important document",
                created_at=datetime.now(UTC)
            ),
            Transcription(
                filename="another_meeting.wav",
                transcribed_text="Another meeting transcription",
                created_at=datetime.now(UTC)
            )
        ]

        for transcription in transcriptions:
            db.session.add(transcription)
        db.session.commit()

        yield transcriptions

        # Cleanup after tests
        for transcription in transcriptions:
            db.session.delete(transcription)
        db.session.commit()

def test_search_with_valid_query(client, sample_transcriptions):
    """Test search with a valid query that should return results."""
    response = client.get('/search?q=meeting')

    assert response.status_code == 200
    data = response.get_json()

    # Should find 2 transcriptions with 'meeting' in filename
    assert len(data) == 2
    assert all('meeting' in item['filename'].lower() for item in data)

def test_search_with_empty_query(client):
    """Test search with an empty query."""
    response = client.get('/search?q=')

    assert response.status_code == 400
    data = response.get_json()
    assert data['error'] == 'Search query is required'

def test_search_with_no_query_param(client):
    """Test search without query parameter."""
    response = client.get('/search')

    assert response.status_code == 400
    data = response.get_json()
    assert data['error'] == 'Search query is required'

def test_search_with_no_results(client):
    """Test search with a query that should return no results."""
    response = client.get('/search?q=nonexistent')

    assert response.status_code == 200
    data = response.get_json()
    assert len(data) == 0

def test_search_case_insensitive(client, sample_transcriptions):
    """Test that search is case insensitive."""
    response = client.get('/search?q=MEETING')

    assert response.status_code == 200
    data = response.get_json()
    assert len(data) == 2
    assert all('meeting' in item['filename'].lower() for item in data)

def test_search_partial_match(client, sample_transcriptions):
    """Test search with partial matches."""
    response = client.get('/search?q=doc')

    assert response.status_code == 200
    data = response.get_json()
    assert len(data) == 1
    assert 'document' in data[0]['filename'].lower()

def test_search_response_structure(client, sample_transcriptions):
    """Test that the response structure is correct."""
    response = client.get('/search?q=meeting')

    assert response.status_code == 200
    data = response.get_json()

    # Check that each result has the expected structure
    for item in data:
        assert 'uuid' in item
        assert 'filename' in item
        assert 'transcribed_text' in item
        assert 'created_at' in item
