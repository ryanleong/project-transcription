const getTranscriptions = async () => {
  const response = await fetch("http://localhost:5000/transcriptions");
  if (!response.ok) {
    throw new Error("Error while getting transcriptions");
  }
  return response.json();
};

const postTranscription = async (file: File) => {};

const searchTranscription = async (query: string) => {};

export { getTranscriptions, postTranscription, searchTranscription };
