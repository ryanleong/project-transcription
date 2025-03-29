import librosa
import soundfile as sf
import os
import tempfile
import numpy as np
from typing import Tuple

class AudioService:
    @staticmethod
    def resample_audio(input_path: str, target_sr: int = 16000) -> str:
        """
        Resample audio file to target sampling rate and return path to resampled file

        Args:
            input_path (str): Path to the input audio file
            target_sr (int): Target sampling rate (default: 16000)

        Returns:
            str: Path to the resampled audio file
        """
        # Load the audio file
        y, sr = librosa.load(input_path, sr=None)

        # Resample if necessary
        if sr != target_sr:
            y = librosa.resample(y=y, orig_sr=sr, target_sr=target_sr)

        # Create a temporary file for the resampled audio
        temp_dir = tempfile.gettempdir()
        temp_path = os.path.join(temp_dir, f"resampled_{os.path.basename(input_path)}")

        # Save the resampled audio
        sf.write(temp_path, y, target_sr)

        return temp_path

    @staticmethod
    def load_audio(file_path: str, target_sr: int = 16000) -> Tuple[np.ndarray, int]:
        """
        Load audio file with specified sampling rate

        Args:
            file_path (str): Path to the audio file
            target_sr (int): Target sampling rate (default: 16000)

        Returns:
            tuple: (audio_data, sampling_rate)
        """
        return librosa.load(file_path, sr=target_sr)