import { useQuery } from "@tanstack/react-query";
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
import { getTranscriptions } from "@/api/transcription";

export function TabTranscriptionsList() {
  const { isPending, isError, data: transcriptions } = useQuery({
    queryKey: ["transcriptions"],
    queryFn: getTranscriptions,
  });

  if (isPending) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error loading transcriptions</div>;
  }

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
              {transcriptions.map((transcription: Transcription) => (
                <TableRow key={transcription.uuid}>
                  <TableCell className="font-medium whitespace-normal break-words max-w-[500px]">
                    {transcription.filename}
                  </TableCell>
                  <TableCell className="whitespace-normal break-words max-w-[500px]">
                    {transcription.transcribed_text}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </ScrollArea>
    </div>
  );
}
