from datetime import datetime
from app.core.database import db
import uuid

class Transcription(db.Model):
    __tablename__ = 'transcriptions'

    uuid = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    filename = db.Column(db.String(255), nullable=False)
    transcribed_text = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

    def to_dict(self):
        """Convert model to dictionary"""
        return {
            'uuid': self.uuid,
            'filename': self.filename,
            'transcribed_text': self.transcribed_text,
            'created_at': self.created_at.isoformat()
        }