import { render, screen, fireEvent } from '@testing-library/react';
import { TabSearch } from '../TabSearch';
import { useQuery } from '@tanstack/react-query';
import { useDebounce } from '@uidotdev/usehooks';

// Mock the useQuery hook
jest.mock('@tanstack/react-query', () => ({
  useQuery: jest.fn()
}));

// Mock the searchTranscription API
jest.mock('@/api/transcription', () => ({
  searchTranscription: jest.fn()
}));

// Mock the useDebounce hook
jest.mock('@uidotdev/usehooks', () => ({
  useDebounce: jest.fn()
}));

describe('TabSearch', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Default mock for useDebounce to return the input value immediately
    (useDebounce as jest.Mock).mockImplementation((value) => value);
  });

  it('should render search input', () => {
    (useQuery as jest.Mock).mockReturnValue({
      isLoading: false,
      isError: false,
      data: []
    });

    render(<TabSearch />);

    expect(screen.getByPlaceholderText('Search transcriptions...')).toBeInTheDocument();
  });

  it('should show loading state', () => {
    (useQuery as jest.Mock).mockReturnValue({
      isLoading: true,
      isError: false,
      data: []
    });

    render(<TabSearch />);

    expect(screen.getByText('Searching...')).toBeInTheDocument();
  });

  it('should show error state', () => {
    (useQuery as jest.Mock).mockReturnValue({
      isLoading: false,
      isError: true,
      data: []
    });

    render(<TabSearch />);

    expect(screen.getByText('Error searching transcriptions')).toBeInTheDocument();
  });

  it('should show empty state when no results', () => {
    (useQuery as jest.Mock).mockReturnValue({
      isLoading: false,
      isError: false,
      data: []
    });

    render(<TabSearch />);

    expect(screen.getByText('No transcriptions found')).toBeInTheDocument();
    expect(screen.getByText('Enter a search query to find transcriptions')).toBeInTheDocument();
  });

  it('should display search results', () => {
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
      isLoading: false,
      isError: false,
      data: mockTranscriptions
    });

    render(<TabSearch />);

    // Check if table headers are present
    expect(screen.getByText('File')).toBeInTheDocument();
    expect(screen.getByText('Transcription')).toBeInTheDocument();

    // Check if transcription data is displayed
    mockTranscriptions.forEach(transcription => {
      expect(screen.getByText(transcription.filename)).toBeInTheDocument();
      expect(screen.getByText(transcription.transcribed_text)).toBeInTheDocument();
    });
  });

  it('should trigger search when input changes', async () => {
    const mockTranscriptions = [
      {
        uuid: '1',
        filename: 'test1.mp3',
        transcribed_text: 'Test transcription 1'
      }
    ];

    (useQuery as jest.Mock).mockReturnValue({
      isLoading: false,
      isError: false,
      data: mockTranscriptions
    });

    render(<TabSearch />);

    const searchInput = screen.getByPlaceholderText('Search transcriptions...');
    fireEvent.change(searchInput, { target: { value: 'test' } });

    // Since we're mocking useDebounce to return the value immediately,
    // we don't need to wait for debounce
    expect(useQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        queryKey: ['transcriptionsSearch', 'test'],
        enabled: true
      })
    );
  });

  it('should not trigger search when input is empty', async () => {
    (useQuery as jest.Mock).mockReturnValue({
      isLoading: false,
      isError: false,
      data: []
    });

    render(<TabSearch />);

    const searchInput = screen.getByPlaceholderText('Search transcriptions...');
    fireEvent.change(searchInput, { target: { value: '' } });

    // Since we're mocking useDebounce to return the value immediately,
    // we don't need to wait for debounce
    expect(useQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        queryKey: ['transcriptionsSearch', ''],
        enabled: false
      })
    );
  });
});