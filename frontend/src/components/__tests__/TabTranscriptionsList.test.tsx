import { render, screen } from '@testing-library/react';
import { TabTranscriptionsList } from '../TabTranscriptionsList';
import { useQuery } from '@tanstack/react-query';
import { getTranscriptions } from '@/api/transcription';

// Mock the useQuery hook
jest.mock('@tanstack/react-query', () => ({
  useQuery: jest.fn()
}));

// Mock the getTranscriptions API
jest.mock('@/api/transcription', () => ({
  getTranscriptions: jest.fn()
}));

describe('TabTranscriptionsList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should show loading state', () => {
    (useQuery as jest.Mock).mockReturnValue({
      isPending: true,
      isError: false,
      data: []
    });

    render(<TabTranscriptionsList />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('should show error state', () => {
    (useQuery as jest.Mock).mockReturnValue({
      isPending: false,
      isError: true,
      data: []
    });

    render(<TabTranscriptionsList />);
    expect(screen.getByText('Error loading transcriptions')).toBeInTheDocument();
  });

  it('should show empty state when no transcriptions', () => {
    (useQuery as jest.Mock).mockReturnValue({
      isPending: false,
      isError: false,
      data: []
    });

    render(<TabTranscriptionsList />);

    expect(screen.getByText('No transcriptions yet')).toBeInTheDocument();
    expect(screen.getByText('Upload an audio file to get started with transcription')).toBeInTheDocument();
  });

  it('should display transcriptions list', () => {
    const mockTranscriptions = [
      {
        uuid: '1',
        filename: 'test1.mp3',
        transcribed_text: 'Test transcription 1'
      },
      {
        uuid: '2',
        filename: 'test2.mp3',
        transcribed_text: 'Test transcription 2'
      }
    ];

    (useQuery as jest.Mock).mockReturnValue({
      isPending: false,
      isError: false,
      data: mockTranscriptions
    });

    render(<TabTranscriptionsList />);

    // Check if title is present
    expect(screen.getByText('Transcriptions')).toBeInTheDocument();

    // Check if table headers are present
    expect(screen.getByText('File')).toBeInTheDocument();
    expect(screen.getByText('Transcription')).toBeInTheDocument();

    // Check if transcription data is displayed
    mockTranscriptions.forEach(transcription => {
      expect(screen.getByText(transcription.filename)).toBeInTheDocument();
      expect(screen.getByText(transcription.transcribed_text)).toBeInTheDocument();
    });
  });

  it('should call getTranscriptions with correct query key', () => {
    (useQuery as jest.Mock).mockReturnValue({
      isPending: false,
      isError: false,
      data: []
    });

    render(<TabTranscriptionsList />);

    expect(useQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        queryKey: ['transcriptions'],
        queryFn: getTranscriptions
      })
    );
  });
});
