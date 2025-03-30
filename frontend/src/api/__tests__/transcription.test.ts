import { getTranscriptions, postTranscription, searchTranscription } from '../transcription';

// Mock the API_BASE_URL import
jest.mock('@/config/env', () => ({
  API_BASE_URL: 'http://mock-api-url'
}));

// Re-import after mocking to get the mocked value
import { API_BASE_URL } from '@/config/env';

// Mock the global fetch function
global.fetch = jest.fn();

describe('Transcription API', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe('getTranscriptions', () => {
    it('should successfully fetch transcriptions', async () => {
      const mockTranscriptions = [
        { id: 1, title: 'Test 1' },
        { id: 2, title: 'Test 2' }
      ];

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockTranscriptions)
      });

      const result = await getTranscriptions();

      expect(global.fetch).toHaveBeenCalledWith(`${API_BASE_URL}/transcriptions`);
      expect(result).toEqual(mockTranscriptions);
    });

    it('should throw error when fetch fails', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false
      });

      await expect(getTranscriptions()).rejects.toThrow('Error while getting transcriptions');
    });
  });

  describe('postTranscription', () => {
    it('should successfully post a file for transcription', async () => {
      const mockFile = new File(['test content'], 'test.txt', { type: 'text/plain' });
      const mockResponse = { id: 1, title: 'Transcribed File' };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      });

      const result = await postTranscription(mockFile);

      expect(global.fetch).toHaveBeenCalledWith(
        `${API_BASE_URL}/transcribe`,
        expect.objectContaining({
          method: 'POST',
          body: expect.any(FormData)
        })
      );
      expect(result).toEqual(mockResponse);
    });

    it('should throw error when upload fails', async () => {
      const mockFile = new File(['test content'], 'test.txt', { type: 'text/plain' });
      const errorMessage = 'Upload failed';

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: () => Promise.resolve({ message: errorMessage })
      });

      await expect(postTranscription(mockFile)).rejects.toThrow(errorMessage);
    });
  });

  describe('searchTranscription', () => {
    it('should successfully search transcriptions', async () => {
      const mockSearchResults = [
        { id: 1, title: 'Search Result 1' },
        { id: 2, title: 'Search Result 2' }
      ];

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockSearchResults)
      });

      const result = await searchTranscription({ query: 'test' });

      expect(global.fetch).toHaveBeenCalledWith(`${API_BASE_URL}/search?q=test`);
      expect(result).toEqual(mockSearchResults);
    });

    it('should return empty array when query is empty', async () => {
      const result = await searchTranscription({ query: '' });
      expect(result).toEqual([]);
      expect(global.fetch).not.toHaveBeenCalled();
    });

    it('should throw error when search fails', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false
      });

      await expect(searchTranscription({ query: 'test' })).rejects.toThrow('Error while getting transcriptions');
    });
  });
});
