
import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "lucide-react";
import WorkJournalEntryForm from "@/components/WorkJournalEntryForm";
import WorkJournalList from "@/components/WorkJournalList";
import WorkJournalStats from "@/components/WorkJournalStats";
import { WorkJournalEntry } from "@/types/workJournal";
import { toast } from "@/hooks/use-toast";

const Index = () => {
  const [entries, setEntries] = useState<WorkJournalEntry[]>([]);

  const addEntry = (entry: WorkJournalEntry) => {
    setEntries(prev => [entry, ...prev]);
    toast({
      title: "Entry Added",
      description: `Entry for ${entry.date} has been successfully added.`
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white">
      <header className="bg-slate-800/40 backdrop-blur-sm border-b border-slate-700/50 sticky top-0 z-10">
        <div className="container mx-auto py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
              Giornale dei Lavori
            </h1>
            <div className="flex items-center gap-2">
              <div className="hidden md:block text-right">
                <p className="text-xs text-slate-400">DM n. 49 del 07/03/2018</p>
                <p className="text-sm text-slate-300">Art. 14: I documenti contabili</p>
              </div>
              <Calendar className="h-6 w-6 text-blue-400" />
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto py-8 px-4">
        <Tabs defaultValue="entry" className="w-full">
          <TabsList className="grid grid-cols-3 mb-8">
            <TabsTrigger value="entry">New Entry</TabsTrigger>
            <TabsTrigger value="journal">Journal Entries</TabsTrigger>
            <TabsTrigger value="stats">Statistics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="entry">
            <Card className="border-slate-700/50 bg-slate-800/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Create New Work Journal Entry</CardTitle>
              </CardHeader>
              <CardContent>
                <WorkJournalEntryForm onAddEntry={addEntry} />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="journal">
            <Card className="border-slate-700/50 bg-slate-800/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Journal Entries</CardTitle>
              </CardHeader>
              <CardContent>
                <WorkJournalList entries={entries} />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="stats">
            <Card className="border-slate-700/50 bg-slate-800/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Work Journal Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <WorkJournalStats entries={entries} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <footer className="bg-slate-900 border-t border-slate-700/50 py-4">
        <div className="container mx-auto text-center text-sm text-slate-500">
          Digital Work Journal System &copy; {new Date().getFullYear()}
        </div>
      </footer>
    </div>
  );
};

export default Index;
