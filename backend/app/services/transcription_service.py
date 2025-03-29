from transformers import WhisperProcessor, WhisperForConditionalGeneration
import torch
import numpy as np
from app.core.config import Config

class TranscriptionService:
    def __init__(self, model_name: str = Config.WHISPER_MODEL):
        """
        Initialize the Whisper transcriber

        Args:
            model_name (str): Name of the Whisper model to use
        """
        self.processor = WhisperProcessor.from_pretrained(model_name)
        self.model = WhisperForConditionalGeneration.from_pretrained(model_name)
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        self.model = self.model.to(self.device)

    def transcribe(self, audio: np.ndarray, sampling_rate: int = 16000) -> str:
        """
        Transcribe audio using Whisper model

        Args:
            audio (np.ndarray): Audio data as numpy array
            sampling_rate (int): Sampling rate of the audio (default: 16000)

        Returns:
            str: Transcribed text
        """
        # Process the audio input
        input_features = self.processor(
            audio,
            sampling_rate=sampling_rate,
            return_tensors="pt"
        ).input_features.to(self.device)

        # Generate token ids
        predicted_ids = self.model.generate(input_features)

        # Decode token ids to text
        transcription = self.processor.batch_decode(
            predicted_ids,
            skip_special_tokens=True
        )[0]

        return transcription