import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TabTranscribe } from "./components/TabTranscribe";
import { Transcription } from "./lib/types";
import { TabTranscriptionsList } from "./components/TabTranscriptionsList";
import { TabSearch } from "./components/TabSearch";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Create a query client
const queryClient = new QueryClient();

export default function App() {
  const [transcriptions, setTranscriptions] = useState<Transcription[]>([]);

  const addTranscription = (transcription: Transcription) => {
    setTranscriptions((prev) => [transcription, ...prev]);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <main className="container mx-auto py-10 space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Audio Transcription App</h1>
          <p className="text-muted-foreground">
            Upload, transcribe, and search your audio files
          </p>
        </div>

        <Tabs defaultValue="transcribe" className="w-full max-w-4xl mx-auto">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="transcribe">Transcribe Audio</TabsTrigger>
            <TabsTrigger value="list">All Transcriptions</TabsTrigger>
            <TabsTrigger value="search">Search</TabsTrigger>
          </TabsList>
          <TabsContent value="transcribe" className="p-4">
            <TabTranscribe onTranscriptionComplete={addTranscription} />
          </TabsContent>
          <TabsContent value="list" className="p-4">
            <TabTranscriptionsList />
          </TabsContent>
          <TabsContent value="search" className="p-4">
            <TabSearch />
          </TabsContent>
        </Tabs>
      </main>
    </QueryClientProvider>
  );
}
