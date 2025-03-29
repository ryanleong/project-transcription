import { useState } from "react";
import { useDebounce } from "@uidotdev/usehooks";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileAudio, Search } from "lucide-react";
import { Transcription } from "@/lib/types";
import { searchTranscription } from "@/api/transcription";
import { useQuery } from "@tanstack/react-query";

export function TabSearch() {
  const [query, setQuery] = useState<string>("");
  const debouncedQuery = useDebounce(query, 300);

  const { isPending, isError, data: transcriptions } = useQuery({
    queryKey: ["transcriptionsSearch", debouncedQuery],
    queryFn: () => searchTranscription({ query: debouncedQuery }),
    enabled: debouncedQuery.length > 0,
  });

  const renderResults = () => {
    if (isPending) {
      return (
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4" />
          <p className="text-muted-foreground">Searching...</p>
        </div>
      );
    }

    if (isError) {
      return (
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <p className="text-destructive">Error searching transcriptions</p>
        </div>
      );
    }

    if (!transcriptions || transcriptions.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <FileAudio className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">No transcriptions found</h3>
          <p className="text-muted-foreground">
            Enter a search query to find transcriptions
          </p>
        </div>
      );
    }

    return (
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
    );
  };

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search transcriptions..."
          className="pl-10"
        />
      </div>

      {renderResults()}
    </div>
  );
}
