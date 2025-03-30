import pytest
from datetime import datetime, UTC

def test_health_check_endpoint(client):
    """Test the health check endpoint returns correct response."""
    response = client.get('/health')

    # Check status code
    assert response.status_code == 200

    # Check response structure
    data = response.get_json()
    assert 'status' in data
    assert 'timestamp' in data
    assert 'environment' in data

    # Check specific values
    assert data['status'] == 'healthy'
    assert isinstance(data['timestamp'], str)
    assert data['environment'] in ['development', 'testing', 'production']

def test_health_check_timestamp_format(client):
    """Test that the timestamp is in valid ISO format."""
    response = client.get('/health')
    data = response.get_json()

    # Verify timestamp is valid ISO format
    try:
        datetime.fromisoformat(data['timestamp'])
    except ValueError:
        pytest.fail("Timestamp is not in valid ISO format")
