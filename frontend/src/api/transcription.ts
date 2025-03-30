import { Transcription } from "@/lib/types";

const getTranscriptions = async () => {
  const response = await fetch("http://localhost:5000/transcriptions");
  if (!response.ok) {
    throw new Error("Error while getting transcriptions");
  }
  return response.json();
};

const postTranscription = async (file: File): Promise<Transcription> => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch('http://localhost:5000/transcribe', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Error while uploading file for transcription');
  }

  return response.json();
};

const searchTranscription = async ({ query }: { query?: string }) => {
  if (!query || query?.length === 0) return [];

  const response = await fetch(`http://localhost:5000/search?q=${query}`);
  if (!response.ok) {
    throw new Error("Error while getting transcriptions");
  }
  return response.json();
};

export { getTranscriptions, postTranscription, searchTranscription };
