import type React from "react";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Upload, FileAudio } from "lucide-react";
import type { Transcription } from "@/lib/types";
import { useMutation } from "@tanstack/react-query";
import { postTranscription } from "@/api/transcription";

interface TranscribeAudioProps {
  onTranscriptionComplete: (transcription: Transcription) => void;
}

export function TabTranscribe({
  onTranscriptionComplete,
}: TranscribeAudioProps) {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const mutation = useMutation({
    mutationFn: (file: File): Promise<Transcription> => postTranscription(file),
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);

      // Set default title from filename
      const fileName = e.target.files[0].name.replace(/\.[^/.]+$/, "");
      setTitle(fileName);
    }
  };

  const simulateProgressStart = () => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev < 95) return prev + 5;
        clearInterval(interval);
        return 95;
      });
    }, 300);
  };

  const simulateProgressEnd = () => {
    setProgress(100);
    setTimeout(() => setProgress(0), 500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !title) return;

    simulateProgressStart();

    try {
      const result = await mutation.mutateAsync(file);
      onTranscriptionComplete(result);

      // Reset form
      setFile(null);
      setTitle("");
      if (fileInputRef.current) fileInputRef.current.value = "";

      // Complete progress
      simulateProgressEnd();
    } catch (error) {
      console.error("Transcription failed:", error);
      setProgress(0);
    }
  };

  const renderFileInput = () => {
    if (file) {
      return (
        <>
          <FileAudio className="h-10 w-10 text-primary" />
          <div className="text-center">
            <p className="font-medium">{file.name}</p>
            <p className="text-sm text-muted-foreground">
              {(file.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
        </>
      );
    }

    return (
      <>
        <Upload className="h-10 w-10 text-muted-foreground" />
        <div className="text-center">
          <p className="font-medium">Click to upload an audio file</p>
          <p className="text-sm text-muted-foreground">
            MP3, WAV, M4A, FLAC up to 25MB
          </p>
        </div>
      </>
    );
  };

  const renderProgress = () => {
    if (!mutation.isPending) return null;

    return (
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Transcribing...</span>
          <span>{progress}%</span>
        </div>
        <Progress value={progress} />
      </div>
    );
  };

  const renderError = () => {
    if (!mutation.isError) return null;
    return (
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-destructive">
          <span>{mutation.error.message}</span>
        </div>
      </div>
    );
  };

  const renderSuccess = () => {
    if (!mutation.isSuccess) return null;
    return (
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-green-500">
          <span>Transcription complete!</span>
        </div>
      </div>
    );
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Transcribe Audio</CardTitle>
        <CardDescription>
          Upload an audio file to transcribe it to text
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="audio-file">Audio File</Label>
            <div className="flex items-center gap-4">
              <Input
                ref={fileInputRef}
                id="audio-file"
                type="file"
                accept="audio/*"
                onChange={handleFileChange}
                className="hidden"
                disabled={mutation.isPending}
                required
              />
              <div
                className={`border-2 border-dashed rounded-lg p-8 w-full flex flex-col items-center justify-center gap-4 cursor-pointer hover:bg-muted/50 transition-colors ${
                  file ? "border-primary" : "border-muted"
                }`}
                onClick={() => fileInputRef.current?.click()}
              >
                {renderFileInput()}
              </div>
            </div>
          </div>

          {renderProgress()}
          {renderSuccess()}
          {renderError()}

          <Button
            type="submit"
            className="w-full"
            disabled={!file || !title || mutation.isPending}
          >
            {mutation.isPending ? "Transcribing..." : "Start Transcription"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
