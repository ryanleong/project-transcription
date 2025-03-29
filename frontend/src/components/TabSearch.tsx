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
import { useState } from "react";
import { Transcription } from "@/lib/types";

export function TabSearch() {
  const [searchQuery, setSearchQuery] = useState<string>("");

  // TODO: Update with API request
  const transcriptions: Transcription[] = [];

  const renderResults = () => {
    if (transcriptions.length === 0) {
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
    );
  };

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search transcriptions..."
          className="pl-10"
        />
      </div>

      {renderResults()}
    </div>
  );
}
