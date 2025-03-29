import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileAudio } from "lucide-react";
import type { Transcription } from "@/lib/types";

export function TabTranscriptionsList() {
  // TODO: Update with API request
  const transcriptions: Transcription[] = [
    {
      uuid: "123",
      filename: "test.mp3",
      transcribed_text: "This is a test transcription",
      created_at: "2021-01-01",
    },
    {
      uuid: "1234",
      filename: "test.mp3",
      transcribed_text: "This is a test transcription",
      created_at: "2021-01-01",
    },
  ];

  if (transcriptions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center">
        <FileAudio className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium">No transcriptions yet</h3>
        <p className="text-muted-foreground">
          Upload an audio file to get started with transcription
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Transcriptions</h2>

      <ScrollArea className="h-[500px] pr-4">
        <div className="space-y-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">File</TableHead>
                <TableHead>Transcription</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transcriptions.map((transcription) => (
                <TableRow>
                  <TableCell className="font-medium">
                    {transcription.filename}
                  </TableCell>
                  <TableCell>{transcription.transcribed_text}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </ScrollArea>
    </div>
  );
}
