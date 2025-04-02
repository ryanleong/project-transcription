import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { TabTranscribe } from '../TabTranscribe';
import { useMutation } from '@tanstack/react-query';

// Mock the useMutation hook
jest.mock('@tanstack/react-query', () => ({
  useMutation: jest.fn()
}));

// Mock the postTranscription API
jest.mock('@/api/transcription', () => ({
  postTranscription: jest.fn()
}));

describe('TabTranscribe', () => {
  const mockFile = new File(['test audio content'], 'test.mp3', { type: 'audio/mp3' });

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should show loading state during transcription', async () => {
    const mockMutation = {
      isPending: false,
      isError: false,
      isSuccess: false,
      error: null,
      mutateAsync: jest.fn()
    };

    (useMutation as jest.Mock)
      .mockReturnValueOnce(mockMutation)
      .mockReturnValueOnce(mockMutation)
      .mockReturnValue({
        ...mockMutation,
        isPending: true,
      });

    const { rerender } = render(<TabTranscribe />);

    // Upload a file
    const fileInput = screen.getByLabelText('Audio File');
    fireEvent.change(fileInput, { target: { files: [mockFile] } });

    // Wait for the file to be displayed
    await waitFor(() => {
      expect(screen.getByText('test.mp3')).toBeInTheDocument();
    });

    // Wait for the button to appear and be enabled
    const submitButton = await screen.findByRole('button', { name: 'Start Transcription' });
    expect(submitButton).not.toBeDisabled();
    await fireEvent.click(submitButton);
    rerender(<TabTranscribe />);

    // Check loading state
    await waitFor(() => {
      expect(submitButton).toHaveTextContent('Transcribing...');
      expect(screen.getByText('0%')).toBeInTheDocument();
    });
  });

  it('should handle successful transcription', async () => {
    const mockTranscription = {
      uuid: '1',
      filename: 'test.mp3',
      transcribed_text: 'Test transcription'
    };

    const mockMutation = {
      isPending: false,
      isError: false,
      isSuccess: true,
      error: null,
      mutateAsync: jest.fn().mockResolvedValue(mockTranscription),
    };

    (useMutation as jest.Mock)
      .mockReturnValue(mockMutation)

    render(<TabTranscribe />);

    // Upload a file
    const fileInput = screen.getByLabelText('Audio File');
    fireEvent.change(fileInput, { target: { files: [mockFile] } });

    // Wait for the button to be enabled and click it
    await waitFor(() => {
      const submitButton = screen.getByRole('button', { name: 'Start Transcription' });
      expect(submitButton).not.toBeDisabled();
      fireEvent.click(submitButton);
    });

    await waitFor(() => {
      expect(screen.getByText('Transcription complete!')).toBeInTheDocument();
    });
  });

  it('should handle transcription error', async () => {
    const errorMessage = 'Transcription failed';
    const mockMutation = {
      isPending: false,
      isError: true,
      isSuccess: true,
      error: new Error(errorMessage),
      mutateAsync: jest.fn().mockRejectedValue(new Error(errorMessage)),
    };

    (useMutation as jest.Mock)
      .mockReturnValue(mockMutation)

    render(<TabTranscribe />);

    // Upload a file
    const fileInput = screen.getByLabelText('Audio File');
    fireEvent.change(fileInput, { target: { files: [mockFile] } });

    // Wait for the button to be enabled and click it
    await waitFor(() => {
      const submitButton = screen.getByRole('button', { name: 'Start Transcription' });
      expect(submitButton).not.toBeDisabled();
      fireEvent.click(submitButton);
    });

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  it('should disable form during transcription', async () => {
    const mockMutation = {
      isPending: true,
      isError: false,
      isSuccess: false,
      error: null,
      mutateAsync: jest.fn(),
    };

    (useMutation as jest.Mock)
      .mockReturnValue(mockMutation);

    render(<TabTranscribe />);

    // Upload a file
    const fileInput = screen.getByLabelText('Audio File');
    fireEvent.change(fileInput, { target: { files: [mockFile] } });

    expect(fileInput).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Transcribing...' })).toBeDisabled();
  });
});
