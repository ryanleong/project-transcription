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

interface TranscribeAudioProps {
  onTranscriptionComplete: (transcription: Transcription) => void;
}

export function TabTranscribe({
  onTranscriptionComplete,
}: TranscribeAudioProps) {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);

      // Set default title from filename
      const fileName = e.target.files[0].name.replace(/\.[^/.]+$/, "");
      setTitle(fileName);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !title) return;

    setIsTranscribing(true);

    // Simulate progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) {
          clearInterval(interval);
          return 95;
        }
        return prev + 5;
      });
    }, 300);

    try {
      // const result = await transcribeAudio(file, title)
      const result = {
        uuid: "123",
        filename: "test.mp3",
        transcribed_text: "This is a test transcription",
        created_at: "2021-01-01",
      };
      onTranscriptionComplete(result);

      // Reset form
      setFile(null);
      setTitle("");
      if (fileInputRef.current) fileInputRef.current.value = "";

      // Complete progress
      setProgress(100);
      setTimeout(() => {
        setProgress(0);
        setIsTranscribing(false);
      }, 500);
    } catch (error) {
      console.error("Transcription failed:", error);
      setIsTranscribing(false);
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
    if (!isTranscribing) return null;

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
                disabled={isTranscribing}
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

          <Button
            type="submit"
            className="w-full"
            disabled={!file || !title || isTranscribing}
          >
            {isTranscribing ? "Transcribing..." : "Start Transcription"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
