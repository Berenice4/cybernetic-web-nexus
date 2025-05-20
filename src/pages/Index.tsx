
import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, HardHat, FileText } from "lucide-react";
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
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 text-slate-800">
      <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-10">
        <div className="container mx-auto py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
              Giornale dei Lavori
            </h1>
            <div className="flex items-center gap-2">
              <div className="hidden md:block text-right">
                <p className="text-xs text-slate-600">DM n. 49 del 07/03/2018</p>
                <p className="text-sm text-slate-700">Art. 14: I documenti contabili</p>
              </div>
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto py-8 px-4">
        <Tabs defaultValue="entry" className="w-full">
          <TabsList className="grid grid-cols-3 mb-8 bg-white border border-slate-200">
            <TabsTrigger value="entry" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
              <FileText className="h-4 w-4 mr-2" />
              New Entry
            </TabsTrigger>
            <TabsTrigger value="journal" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
              <Calendar className="h-4 w-4 mr-2" />
              Journal Entries
            </TabsTrigger>
            <TabsTrigger value="stats" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
              <HardHat className="h-4 w-4 mr-2" />
              Statistics
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="entry">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <Card className="border-slate-200 bg-white shadow-sm">
                  <CardHeader className="bg-slate-50 border-b border-slate-100">
                    <CardTitle className="text-slate-800">Create New Work Journal Entry</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <WorkJournalEntryForm onAddEntry={addEntry} />
                  </CardContent>
                </Card>
              </div>
              <div className="md:col-span-1">
                <div className="sticky top-24">
                  <Card className="border-slate-200 bg-white shadow-sm">
                    <CardHeader className="bg-slate-50 border-b border-slate-100">
                      <CardTitle className="text-slate-800">Entry Guidelines</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-6">
                      <div className="text-center mb-6">
                        <img 
                          src="https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&q=80&w=500" 
                          alt="Construction site" 
                          className="w-full h-48 object-cover rounded-lg mb-4"
                        />
                        <p className="text-sm text-slate-600 italic">Accurate documentation ensures project success</p>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-medium text-slate-800">Required Information:</h4>
                        <ul className="list-disc pl-5 text-slate-700 text-sm space-y-1">
                          <li>Date and site conditions</li>
                          <li>Activities performed with reference to orders</li>
                          <li>Workers present and their qualifications</li>
                          <li>Equipment and materials used</li>
                          <li>Special circumstances and weather conditions</li>
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="journal">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="md:col-span-3">
                <Card className="border-slate-200 bg-white shadow-sm">
                  <CardHeader className="bg-slate-50 border-b border-slate-100">
                    <CardTitle className="text-slate-800">Journal Entries</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <WorkJournalList entries={entries} />
                  </CardContent>
                </Card>
              </div>
              <div className="md:col-span-1">
                <div className="sticky top-24">
                  <Card className="border-slate-200 bg-white shadow-sm">
                    <CardHeader className="bg-slate-50 border-b border-slate-100">
                      <CardTitle className="text-slate-800">Reference</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-6">
                      <div className="text-center mb-6">
                        <img 
                          src="https://images.unsplash.com/photo-1593733925160-6f79567b9829?auto=format&fit=crop&q=80&w=500" 
                          alt="Construction document" 
                          className="w-full h-48 object-cover rounded-lg mb-4"
                        />
                        <p className="text-sm text-slate-600 italic">Organized documentation improves project management</p>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-medium text-slate-800">DM 49/2018 Requirements:</h4>
                        <p className="text-sm text-slate-700">
                          Article 14 of Decree 49/2018 requires accurate and consistent documentation 
                          of all work activities for public infrastructure projects.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="stats">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="md:col-span-3">
                <Card className="border-slate-200 bg-white shadow-sm">
                  <CardHeader className="bg-slate-50 border-b border-slate-100">
                    <CardTitle className="text-slate-800">Work Journal Statistics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <WorkJournalStats entries={entries} />
                  </CardContent>
                </Card>
              </div>
              <div className="md:col-span-1">
                <div className="sticky top-24">
                  <Card className="border-slate-200 bg-white shadow-sm">
                    <CardHeader className="bg-slate-50 border-b border-slate-100">
                      <CardTitle className="text-slate-800">Analytics Tips</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-6">
                      <div className="text-center mb-6">
                        <img 
                          src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=500" 
                          alt="Data analysis" 
                          className="w-full h-48 object-cover rounded-lg mb-4"
                        />
                        <p className="text-sm text-slate-600 italic">Data insights help optimize construction projects</p>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-medium text-slate-800">Using Statistics:</h4>
                        <ul className="list-disc pl-5 text-slate-700 text-sm space-y-1">
                          <li>Track worker allocation efficiency</li>
                          <li>Monitor equipment utilization</li>
                          <li>Analyze activity trends over time</li>
                          <li>Identify correlations between conditions and productivity</li>
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <footer className="bg-white border-t border-slate-200 py-4 mt-8">
        <div className="container mx-auto text-center text-sm text-slate-500">
          Digital Work Journal System &copy; {new Date().getFullYear()}
        </div>
      </footer>
    </div>
  );
};

export default Index;
