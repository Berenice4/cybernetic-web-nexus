
import { useState } from "react";
import { WorkJournalEntry } from "@/types/workJournal";
import { format } from "date-fns";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar, Search, FileText, List, Users, Wrench, Box, CloudLightning, FileInput } from "lucide-react";

interface WorkJournalListProps {
  entries: WorkJournalEntry[];
}

const WorkJournalList = ({ entries }: WorkJournalListProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredEntries = entries.filter((entry) => {
    const searchLower = searchTerm.toLowerCase();
    
    // Search through various fields in the entry
    return (
      entry.date.toLowerCase().includes(searchLower) ||
      entry.activities.some(a => 
        a.order.toLowerCase().includes(searchLower) || 
        a.mode.toLowerCase().includes(searchLower) || 
        a.activity.toLowerCase().includes(searchLower)
      ) ||
      entry.workers.some(w => 
        w.qualification.toLowerCase().includes(searchLower)
      ) ||
      entry.equipment.some(e => 
        e.name.toLowerCase().includes(searchLower) || 
        e.description.toLowerCase().includes(searchLower)
      )
    );
  });

  const getTypeIcon = (section: string) => {
    switch (section) {
      case "activities": return <List className="h-4 w-4 text-blue-400" />;
      case "workers": return <Users className="h-4 w-4 text-green-400" />;
      case "equipment": return <Wrench className="h-4 w-4 text-yellow-400" />;
      case "supplies": return <Box className="h-4 w-4 text-purple-400" />;
      case "circumstances": return <CloudLightning className="h-4 w-4 text-orange-400" />;
      case "serviceOrders": return <FileInput className="h-4 w-4 text-pink-400" />;
      default: return <FileText className="h-4 w-4 text-slate-400" />;
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input 
          placeholder="Search journal entries..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-9 bg-slate-900 border-slate-700 text-slate-200"
        />
      </div>
      
      {filteredEntries.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-slate-700 rounded-md">
          <FileText className="mx-auto h-12 w-12 text-slate-500 mb-4" />
          <h3 className="text-lg font-medium mb-2">No Entries Found</h3>
          <p className="text-slate-400">
            {entries.length === 0 
              ? "Start by creating your first work journal entry"
              : "Try adjusting your search term"}
          </p>
          {entries.length > 0 && (
            <Button 
              variant="outline" 
              onClick={() => setSearchTerm("")}
              className="mt-4 bg-slate-800 border-slate-700 text-slate-200"
            >
              Clear Search
            </Button>
          )}
        </div>
      ) : (
        <Accordion type="single" collapsible className="space-y-4">
          {filteredEntries.map((entry) => (
            <AccordionItem 
              key={entry.id} 
              value={entry.id}
              className="border border-slate-700/50 rounded-lg overflow-hidden bg-slate-900/30 backdrop-blur-sm"
            >
              <AccordionTrigger className="px-4 py-3 hover:bg-slate-800/50 data-[state=open]:bg-slate-800/50">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-blue-400" />
                  <div className="text-left">
                    <div className="font-medium">
                      Entry: {entry.date}
                    </div>
                    <div className="text-xs text-slate-400 mt-1">
                      {entry.activities.length > 0 ? entry.activities[0].activity : "No activity specified"} • 
                      {entry.workers.reduce((total, worker) => total + worker.count, 0)} workers
                    </div>
                  </div>
                </div>
              </AccordionTrigger>
              
              <AccordionContent className="px-4 py-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left Column - Essential Information */}
                  <div className="space-y-6">
                    {/* Activities Section */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 mb-2">
                        {getTypeIcon("activities")}
                        <h4 className="text-sm font-medium text-blue-400">Activities</h4>
                      </div>
                      
                      {entry.activities.map((activity, idx) => (
                        <div key={idx} className="p-3 bg-slate-800/70 rounded-md space-y-1">
                          <div className="flex justify-between">
                            <span className="text-xs text-slate-400">Order:</span>
                            <span className="text-xs font-medium">{activity.order}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-xs text-slate-400">Mode:</span>
                            <span className="text-xs font-medium">{activity.mode}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-xs text-slate-400">Activity:</span>
                            <span className="text-xs font-medium">{activity.activity}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Workers Section */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 mb-2">
                        {getTypeIcon("workers")}
                        <h4 className="text-sm font-medium text-green-400">Workers</h4>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2">
                        {entry.workers.map((worker, idx) => (
                          <div key={idx} className="p-3 bg-slate-800/70 rounded-md">
                            <div className="flex flex-col">
                              <span className="text-sm font-medium mb-1">{worker.qualification}</span>
                              <Badge variant="outline" className="w-fit">
                                {worker.count} {worker.count === 1 ? 'worker' : 'workers'}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Equipment Section */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 mb-2">
                        {getTypeIcon("equipment")}
                        <h4 className="text-sm font-medium text-yellow-400">Equipment</h4>
                      </div>
                      
                      {entry.equipment.map((item, idx) => (
                        <div key={idx} className="p-3 bg-slate-800/70 rounded-md">
                          <div className="flex justify-between items-start">
                            <span className="text-sm font-medium">{item.name}</span>
                            <Badge variant="outline" className="bg-yellow-500/10 text-yellow-400 border-yellow-400/30">
                              Equipment
                            </Badge>
                          </div>
                          <p className="text-xs text-slate-400 mt-1">
                            {item.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Right Column - Additional Information */}
                  <div className="space-y-6">
                    {/* Supplies Section */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 mb-2">
                        {getTypeIcon("supplies")}
                        <h4 className="text-sm font-medium text-purple-400">Supplies</h4>
                      </div>
                      
                      {entry.supplies.map((supply, idx) => (
                        <div key={idx} className="p-3 bg-slate-800/70 rounded-md">
                          <div className="flex justify-between items-start">
                            <span className="text-sm font-medium">{supply.name}</span>
                            <span className="text-xs text-slate-400">Inv: {supply.invoice}</span>
                          </div>
                          <p className="text-xs text-slate-400 mt-1">
                            {supply.details}
                          </p>
                        </div>
                      ))}
                    </div>
                    
                    {/* Circumstances Section */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 mb-2">
                        {getTypeIcon("circumstances")}
                        <h4 className="text-sm font-medium text-orange-400">Circumstances</h4>
                      </div>
                      
                      {entry.circumstances.map((circumstance, idx) => (
                        <div key={idx} className="p-3 bg-slate-800/70 rounded-md">
                          <div className="grid gap-2">
                            <div>
                              <span className="text-xs text-slate-400 block">Description:</span>
                              <span className="text-sm">{circumstance.description}</span>
                            </div>
                            <div>
                              <span className="text-xs text-slate-400 block">Weather:</span>
                              <span className="text-sm">{circumstance.weather}</span>
                            </div>
                            <div>
                              <span className="text-xs text-slate-400 block">Terrain:</span>
                              <span className="text-sm">{circumstance.terrain}</span>
                            </div>
                            {circumstance.notes && (
                              <div>
                                <span className="text-xs text-slate-400 block">Notes:</span>
                                <span className="text-sm">{circumstance.notes}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Service Orders Section */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 mb-2">
                        {getTypeIcon("serviceOrders")}
                        <h4 className="text-sm font-medium text-pink-400">Service Orders</h4>
                      </div>
                      
                      {entry.serviceOrders.map((order, idx) => (
                        <div key={idx} className="p-3 bg-slate-800/70 rounded-md">
                          <div className="flex justify-between items-start">
                            <span className="text-sm font-medium">{order.orderNumber}</span>
                            <Badge variant="outline" className="bg-pink-500/10 text-pink-400 border-pink-400/30">
                              Order
                            </Badge>
                          </div>
                          <p className="text-xs text-slate-400 mt-1">
                            {order.description}
                          </p>
                          <p className="text-xs mt-2">
                            <span className="text-slate-400">Issued by:</span> {order.issuedBy}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Additional Options */}
                <div className="mt-6 pt-6 border-t border-slate-700/50 grid grid-cols-3 gap-4">
                  <Button variant="outline" size="sm" className="bg-slate-800 border-slate-700 text-slate-200">
                    Export as PDF
                  </Button>
                  <Button variant="outline" size="sm" className="bg-slate-800 border-slate-700 text-slate-200">
                    Print Entry
                  </Button>
                  <Button variant="outline" size="sm" className="bg-slate-800 border-slate-700 text-slate-200">
                    Share Entry
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </div>
  );
};

export default WorkJournalList;
