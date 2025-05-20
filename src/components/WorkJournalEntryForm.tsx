
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { WorkJournalEntry, WorkActivity, Workers, Equipment, Supply, Circumstance, ServiceOrder } from "@/types/workJournal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar as CalendarIcon, PlusCircle, FileText, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface WorkJournalEntryFormProps {
  onAddEntry: (entry: WorkJournalEntry) => void;
}

const WorkJournalEntryForm = ({ onAddEntry }: WorkJournalEntryFormProps) => {
  const [date, setDate] = useState<Date | undefined>(new Date());

  // Basic entry fields
  const [activities, setActivities] = useState<WorkActivity[]>([{ order: "", mode: "", activity: "" }]);
  const [workers, setWorkers] = useState<Workers[]>([{ qualification: "", count: 1 }]);
  const [equipment, setEquipment] = useState<Equipment[]>([{ name: "", description: "" }]);
  const [supplies, setSupplies] = useState<Supply[]>([{ name: "", invoice: "", details: "" }]);
  const [circumstances, setCircumstances] = useState<Circumstance[]>([{ description: "", weather: "", terrain: "", notes: "" }]);
  const [serviceOrders, setServiceOrders] = useState<ServiceOrder[]>([{ orderNumber: "", description: "", issuedBy: "" }]);
  
  // Advanced options dialog state
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [reports, setReports] = useState<{ recipient: string; subject: string; date: string }[]>([]);
  const [verifications, setVerifications] = useState<{ type: string; description: string }[]>([]);
  const [disputes, setDisputes] = useState<{ type: "contestazione" | "sospensione" | "ripresa"; description: string; date: string }[]>([]);
  const [variants, setVariants] = useState<{ description: string; priceChanges: string }[]>([]);
  
  // Helper function to update arrays
  const updateArray = <T,>(setter: React.Dispatch<React.SetStateAction<T[]>>, index: number, field: keyof T, value: any) => {
    setter(prev => prev.map((item, i) => i === index ? { ...item, [field]: value } : item));
  };

  // Add new item to arrays
  const addItem = <T,>(setter: React.Dispatch<React.SetStateAction<T[]>>, template: T) => {
    setter(prev => [...prev, { ...template }]);
  };

  // Remove item from arrays
  const removeItem = <T,>(setter: React.Dispatch<React.SetStateAction<T[]>>, index: number) => {
    setter(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newEntry: WorkJournalEntry = {
      id: uuidv4(),
      date: date ? format(date, "yyyy-MM-dd") : "",
      activities,
      workers,
      equipment,
      supplies,
      circumstances,
      serviceOrders,
      reports,
      verifications,
      disputes,
      variants
    };
    
    onAddEntry(newEntry);

    // Reset the form
    setActivities([{ order: "", mode: "", activity: "" }]);
    setWorkers([{ qualification: "", count: 1 }]);
    setEquipment([{ name: "", description: "" }]);
    setSupplies([{ name: "", invoice: "", details: "" }]);
    setCircumstances([{ description: "", weather: "", terrain: "", notes: "" }]);
    setServiceOrders([{ orderNumber: "", description: "", issuedBy: "" }]);
    setReports([]);
    setVerifications([]);
    setDisputes([]);
    setVariants([]);
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Date Selection */}
      <div className="space-y-2">
        <Label htmlFor="date">Entry Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id="date"
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal bg-slate-800 border-slate-700 text-slate-200",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP") : <span>Select a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 bg-slate-800 border-slate-700">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              initialFocus
              className="pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Section 1: Activities */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-blue-400 flex items-center">
          <span className="bg-blue-500/20 rounded-full w-6 h-6 inline-flex items-center justify-center mr-2 text-sm">1</span>
          Work Activities
        </h3>

        {activities.map((activity, index) => (
          <div key={index} className="grid gap-4 p-4 rounded-lg border border-slate-700/50 bg-slate-800/50">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor={`activity-order-${index}`}>Order</Label>
                <Input
                  id={`activity-order-${index}`}
                  value={activity.order}
                  onChange={(e) => updateArray(setActivities, index, "order", e.target.value)}
                  className="bg-slate-900 border-slate-700 text-slate-200"
                />
              </div>
              <div>
                <Label htmlFor={`activity-mode-${index}`}>Mode</Label>
                <Input
                  id={`activity-mode-${index}`}
                  value={activity.mode}
                  onChange={(e) => updateArray(setActivities, index, "mode", e.target.value)}
                  className="bg-slate-900 border-slate-700 text-slate-200"
                />
              </div>
              <div>
                <Label htmlFor={`activity-description-${index}`}>Activity Description</Label>
                <Input
                  id={`activity-description-${index}`}
                  value={activity.activity}
                  onChange={(e) => updateArray(setActivities, index, "activity", e.target.value)}
                  className="bg-slate-900 border-slate-700 text-slate-200"
                />
              </div>
            </div>

            {activities.length > 1 && (
              <Button 
                type="button" 
                variant="destructive" 
                size="sm" 
                onClick={() => removeItem(setActivities, index)}
                className="mt-2 w-full"
              >
                Remove Activity
              </Button>
            )}
          </div>
        ))}
        
        <Button
          type="button"
          variant="outline"
          onClick={() => addItem(setActivities, { order: "", mode: "", activity: "" })}
          className="w-full bg-blue-600/20 hover:bg-blue-600/30 border-blue-600/40 text-blue-400"
        >
          <PlusCircle className="mr-2 h-4 w-4" /> Add Activity
        </Button>
      </div>

      {/* Section 2: Workers */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-blue-400 flex items-center">
          <span className="bg-blue-500/20 rounded-full w-6 h-6 inline-flex items-center justify-center mr-2 text-sm">2</span>
          Workers
        </h3>

        {workers.map((worker, index) => (
          <div key={index} className="grid gap-4 p-4 rounded-lg border border-slate-700/50 bg-slate-800/50">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor={`worker-qualification-${index}`}>Qualification</Label>
                <Input
                  id={`worker-qualification-${index}`}
                  value={worker.qualification}
                  onChange={(e) => updateArray(setWorkers, index, "qualification", e.target.value)}
                  className="bg-slate-900 border-slate-700 text-slate-200"
                />
              </div>
              <div>
                <Label htmlFor={`worker-count-${index}`}>Number of Workers: {worker.count}</Label>
                <Slider 
                  id={`worker-count-${index}`}
                  value={[worker.count]} 
                  min={1} 
                  max={50} 
                  step={1} 
                  onValueChange={(value) => updateArray(setWorkers, index, "count", value[0])}
                  className="mt-2"
                />
              </div>
            </div>

            {workers.length > 1 && (
              <Button 
                type="button" 
                variant="destructive" 
                size="sm" 
                onClick={() => removeItem(setWorkers, index)}
                className="mt-2 w-full"
              >
                Remove Worker Category
              </Button>
            )}
          </div>
        ))}
        
        <Button
          type="button"
          variant="outline"
          onClick={() => addItem(setWorkers, { qualification: "", count: 1 })}
          className="w-full bg-blue-600/20 hover:bg-blue-600/30 border-blue-600/40 text-blue-400"
        >
          <PlusCircle className="mr-2 h-4 w-4" /> Add Worker Category
        </Button>
      </div>

      {/* Section 3: Equipment */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-blue-400 flex items-center">
          <span className="bg-blue-500/20 rounded-full w-6 h-6 inline-flex items-center justify-center mr-2 text-sm">3</span>
          Technical Equipment
        </h3>

        {equipment.map((item, index) => (
          <div key={index} className="grid gap-4 p-4 rounded-lg border border-slate-700/50 bg-slate-800/50">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor={`equipment-name-${index}`}>Equipment Name</Label>
                <Input
                  id={`equipment-name-${index}`}
                  value={item.name}
                  onChange={(e) => updateArray(setEquipment, index, "name", e.target.value)}
                  className="bg-slate-900 border-slate-700 text-slate-200"
                />
              </div>
              <div>
                <Label htmlFor={`equipment-description-${index}`}>Description</Label>
                <Input
                  id={`equipment-description-${index}`}
                  value={item.description}
                  onChange={(e) => updateArray(setEquipment, index, "description", e.target.value)}
                  className="bg-slate-900 border-slate-700 text-slate-200"
                />
              </div>
            </div>

            {equipment.length > 1 && (
              <Button 
                type="button" 
                variant="destructive" 
                size="sm" 
                onClick={() => removeItem(setEquipment, index)}
                className="mt-2 w-full"
              >
                Remove Equipment
              </Button>
            )}
          </div>
        ))}
        
        <Button
          type="button"
          variant="outline"
          onClick={() => addItem(setEquipment, { name: "", description: "" })}
          className="w-full bg-blue-600/20 hover:bg-blue-600/30 border-blue-600/40 text-blue-400"
        >
          <PlusCircle className="mr-2 h-4 w-4" /> Add Equipment
        </Button>
      </div>

      {/* Additional Required Sections */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-blue-400 flex items-center">
          <span className="bg-blue-500/20 rounded-full w-6 h-6 inline-flex items-center justify-center mr-2 text-sm">4</span>
          Supplies
        </h3>
        
        {supplies.map((supply, index) => (
          <div key={index} className="grid gap-4 p-4 rounded-lg border border-slate-700/50 bg-slate-800/50">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor={`supply-name-${index}`}>Name</Label>
                <Input
                  id={`supply-name-${index}`}
                  value={supply.name}
                  onChange={(e) => updateArray(setSupplies, index, "name", e.target.value)}
                  className="bg-slate-900 border-slate-700 text-slate-200"
                />
              </div>
              <div>
                <Label htmlFor={`supply-invoice-${index}`}>Invoice Reference</Label>
                <Input
                  id={`supply-invoice-${index}`}
                  value={supply.invoice}
                  onChange={(e) => updateArray(setSupplies, index, "invoice", e.target.value)}
                  className="bg-slate-900 border-slate-700 text-slate-200"
                />
              </div>
              <div>
                <Label htmlFor={`supply-details-${index}`}>Details</Label>
                <Input
                  id={`supply-details-${index}`}
                  value={supply.details}
                  onChange={(e) => updateArray(setSupplies, index, "details", e.target.value)}
                  className="bg-slate-900 border-slate-700 text-slate-200"
                />
              </div>
            </div>

            {supplies.length > 1 && (
              <Button 
                type="button" 
                variant="destructive" 
                size="sm" 
                onClick={() => removeItem(setSupplies, index)}
                className="mt-2 w-full"
              >
                Remove Supply
              </Button>
            )}
          </div>
        ))}
        
        <Button
          type="button"
          variant="outline"
          onClick={() => addItem(setSupplies, { name: "", invoice: "", details: "" })}
          className="w-full bg-blue-600/20 hover:bg-blue-600/30 border-blue-600/40 text-blue-400"
        >
          <PlusCircle className="mr-2 h-4 w-4" /> Add Supply
        </Button>
      </div>

      {/* Circumstances */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-blue-400 flex items-center">
          <span className="bg-blue-500/20 rounded-full w-6 h-6 inline-flex items-center justify-center mr-2 text-sm">5</span>
          Circumstances
        </h3>
        
        {circumstances.map((circumstance, index) => (
          <div key={index} className="grid gap-4 p-4 rounded-lg border border-slate-700/50 bg-slate-800/50">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor={`circumstance-description-${index}`}>Description</Label>
                <Input
                  id={`circumstance-description-${index}`}
                  value={circumstance.description}
                  onChange={(e) => updateArray(setCircumstances, index, "description", e.target.value)}
                  className="bg-slate-900 border-slate-700 text-slate-200"
                />
              </div>
              <div>
                <Label htmlFor={`circumstance-weather-${index}`}>Weather Conditions</Label>
                <Input
                  id={`circumstance-weather-${index}`}
                  value={circumstance.weather}
                  onChange={(e) => updateArray(setCircumstances, index, "weather", e.target.value)}
                  className="bg-slate-900 border-slate-700 text-slate-200"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor={`circumstance-terrain-${index}`}>Terrain Type</Label>
                <Input
                  id={`circumstance-terrain-${index}`}
                  value={circumstance.terrain}
                  onChange={(e) => updateArray(setCircumstances, index, "terrain", e.target.value)}
                  className="bg-slate-900 border-slate-700 text-slate-200"
                />
              </div>
              <div>
                <Label htmlFor={`circumstance-notes-${index}`}>Additional Notes</Label>
                <Input
                  id={`circumstance-notes-${index}`}
                  value={circumstance.notes}
                  onChange={(e) => updateArray(setCircumstances, index, "notes", e.target.value)}
                  className="bg-slate-900 border-slate-700 text-slate-200"
                />
              </div>
            </div>

            {circumstances.length > 1 && (
              <Button 
                type="button" 
                variant="destructive" 
                size="sm" 
                onClick={() => removeItem(setCircumstances, index)}
                className="mt-2 w-full"
              >
                Remove Circumstance
              </Button>
            )}
          </div>
        ))}
        
        <Button
          type="button"
          variant="outline"
          onClick={() => addItem(setCircumstances, { description: "", weather: "", terrain: "", notes: "" })}
          className="w-full bg-blue-600/20 hover:bg-blue-600/30 border-blue-600/40 text-blue-400"
        >
          <PlusCircle className="mr-2 h-4 w-4" /> Add Circumstance
        </Button>
      </div>

      {/* Service Orders */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-blue-400 flex items-center">
          <span className="bg-blue-500/20 rounded-full w-6 h-6 inline-flex items-center justify-center mr-2 text-sm">6</span>
          Service Orders
        </h3>
        
        {serviceOrders.map((order, index) => (
          <div key={index} className="grid gap-4 p-4 rounded-lg border border-slate-700/50 bg-slate-800/50">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor={`order-number-${index}`}>Order Number</Label>
                <Input
                  id={`order-number-${index}`}
                  value={order.orderNumber}
                  onChange={(e) => updateArray(setServiceOrders, index, "orderNumber", e.target.value)}
                  className="bg-slate-900 border-slate-700 text-slate-200"
                />
              </div>
              <div>
                <Label htmlFor={`order-description-${index}`}>Description</Label>
                <Input
                  id={`order-description-${index}`}
                  value={order.description}
                  onChange={(e) => updateArray(setServiceOrders, index, "description", e.target.value)}
                  className="bg-slate-900 border-slate-700 text-slate-200"
                />
              </div>
              <div>
                <Label htmlFor={`order-issued-by-${index}`}>Issued By</Label>
                <Input
                  id={`order-issued-by-${index}`}
                  value={order.issuedBy}
                  onChange={(e) => updateArray(setServiceOrders, index, "issuedBy", e.target.value)}
                  className="bg-slate-900 border-slate-700 text-slate-200"
                />
              </div>
            </div>

            {serviceOrders.length > 1 && (
              <Button 
                type="button" 
                variant="destructive" 
                size="sm" 
                onClick={() => removeItem(setServiceOrders, index)}
                className="mt-2 w-full"
              >
                Remove Service Order
              </Button>
            )}
          </div>
        ))}
        
        <Button
          type="button"
          variant="outline"
          onClick={() => addItem(setServiceOrders, { orderNumber: "", description: "", issuedBy: "" })}
          className="w-full bg-blue-600/20 hover:bg-blue-600/30 border-blue-600/40 text-blue-400"
        >
          <PlusCircle className="mr-2 h-4 w-4" /> Add Service Order
        </Button>
      </div>

      {/* Advanced Options Dialog */}
      <Dialog open={showAdvancedOptions} onOpenChange={setShowAdvancedOptions}>
        <DialogTrigger asChild>
          <Button type="button" variant="secondary" className="w-full font-medium">
            <FileText className="mr-2 h-4 w-4" /> Configure Advanced Options (Items 7-10)
          </Button>
        </DialogTrigger>
        <DialogContent className="bg-slate-800 border-slate-700 text-slate-200 max-w-4xl">
          <DialogHeader>
            <DialogTitle className="text-blue-400">Advanced Work Journal Options</DialogTitle>
            <DialogDescription>
              Configure additional options for the work journal entry as specified in DM n. 49 del 07/03/2018 - Art. 14.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-6 py-4">
            {/* Reports (Item 7) */}
            <div className="space-y-4">
              <h3 className="text-md font-medium flex items-center">
                <span className="bg-blue-500/20 rounded-full w-5 h-5 inline-flex items-center justify-center mr-2 text-xs">7</span>
                Reports to RUP
              </h3>
              
              {reports.length === 0 ? (
                <div className="text-center p-4 border border-dashed border-slate-700 rounded-md">
                  <p className="text-slate-400">No reports added</p>
                </div>
              ) : (
                reports.map((report, index) => (
                  <div key={index} className="grid gap-4 p-4 rounded-lg border border-slate-700/50 bg-slate-900/50">
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label>Recipient</Label>
                        <Input
                          value={report.recipient}
                          onChange={(e) => updateArray(setReports, index, "recipient", e.target.value)}
                          className="bg-slate-900 border-slate-700 text-slate-200"
                        />
                      </div>
                      <div>
                        <Label>Subject</Label>
                        <Input
                          value={report.subject}
                          onChange={(e) => updateArray(setReports, index, "subject", e.target.value)}
                          className="bg-slate-900 border-slate-700 text-slate-200"
                        />
                      </div>
                      <div>
                        <Label>Date</Label>
                        <Input
                          value={report.date}
                          onChange={(e) => updateArray(setReports, index, "date", e.target.value)}
                          className="bg-slate-900 border-slate-700 text-slate-200"
                        />
                      </div>
                    </div>
                    
                    <Button 
                      type="button" 
                      variant="destructive" 
                      size="sm" 
                      onClick={() => removeItem(setReports, index)}
                    >
                      Remove
                    </Button>
                  </div>
                ))
              )}
              
              <Button
                type="button"
                variant="outline"
                onClick={() => addItem(setReports, { recipient: "", subject: "", date: "" })}
                className="w-full"
              >
                <PlusCircle className="mr-2 h-4 w-4" /> Add Report
              </Button>
            </div>
          
            {/* Additional Advanced Options */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Verifications (Item 8) */}
              <div className="space-y-4">
                <h3 className="text-md font-medium flex items-center">
                  <span className="bg-blue-500/20 rounded-full w-5 h-5 inline-flex items-center justify-center mr-2 text-xs">8</span>
                  Verification Processes
                </h3>
                
                {verifications.length === 0 ? (
                  <div className="text-center p-4 border border-dashed border-slate-700 rounded-md">
                    <p className="text-slate-400">No verifications added</p>
                  </div>
                ) : (
                  verifications.map((verification, index) => (
                    <div key={index} className="p-4 rounded-lg border border-slate-700/50 bg-slate-900/50">
                      <div className="space-y-2">
                        <Label>Type</Label>
                        <Input
                          value={verification.type}
                          onChange={(e) => updateArray(setVerifications, index, "type", e.target.value)}
                          className="bg-slate-900 border-slate-700 text-slate-200 mb-2"
                        />
                        <Label>Description</Label>
                        <Textarea
                          value={verification.description}
                          onChange={(e) => updateArray(setVerifications, index, "description", e.target.value)}
                          className="bg-slate-900 border-slate-700 text-slate-200"
                        />
                      </div>
                      <Button 
                        type="button" 
                        variant="destructive" 
                        size="sm" 
                        onClick={() => removeItem(setVerifications, index)}
                        className="mt-2 w-full"
                      >
                        Remove
                      </Button>
                    </div>
                  ))
                )}
                
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => addItem(setVerifications, { type: "", description: "" })}
                  className="w-full"
                >
                  <PlusCircle className="mr-2 h-4 w-4" /> Add Verification
                </Button>
              </div>
            
              {/* Disputes (Item 9) */}
              <div className="space-y-4">
                <h3 className="text-md font-medium flex items-center">
                  <span className="bg-blue-500/20 rounded-full w-5 h-5 inline-flex items-center justify-center mr-2 text-xs">9</span>
                  Disputes/Suspensions/Resumptions
                </h3>
                
                {disputes.length === 0 ? (
                  <div className="text-center p-4 border border-dashed border-slate-700 rounded-md">
                    <p className="text-slate-400">No items added</p>
                  </div>
                ) : (
                  disputes.map((dispute, index) => (
                    <div key={index} className="p-4 rounded-lg border border-slate-700/50 bg-slate-900/50">
                      <div className="space-y-2">
                        <Label>Type</Label>
                        <select
                          value={dispute.type}
                          onChange={(e) => updateArray(setDisputes, index, "type", e.target.value as "contestazione" | "sospensione" | "ripresa")}
                          className="w-full bg-slate-900 border border-slate-700 text-slate-200 rounded-md p-2 mb-2"
                        >
                          <option value="contestazione">Contestazione</option>
                          <option value="sospensione">Sospensione</option>
                          <option value="ripresa">Ripresa</option>
                        </select>
                        <Label>Description</Label>
                        <Textarea
                          value={dispute.description}
                          onChange={(e) => updateArray(setDisputes, index, "description", e.target.value)}
                          className="bg-slate-900 border-slate-700 text-slate-200 mb-2"
                        />
                        <Label>Date</Label>
                        <Input
                          value={dispute.date}
                          onChange={(e) => updateArray(setDisputes, index, "date", e.target.value)}
                          className="bg-slate-900 border-slate-700 text-slate-200"
                        />
                      </div>
                      <Button 
                        type="button" 
                        variant="destructive" 
                        size="sm" 
                        onClick={() => removeItem(setDisputes, index)}
                        className="mt-2 w-full"
                      >
                        Remove
                      </Button>
                    </div>
                  ))
                )}
                
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => addItem(setDisputes, { type: "contestazione", description: "", date: "" })}
                  className="w-full"
                >
                  <PlusCircle className="mr-2 h-4 w-4" /> Add Item
                </Button>
              </div>
            
              {/* Variants (Item 10) */}
              <div className="space-y-4">
                <h3 className="text-md font-medium flex items-center">
                  <span className="bg-blue-500/20 rounded-full w-5 h-5 inline-flex items-center justify-center mr-2 text-xs">10</span>
                  Variants
                </h3>
                
                {variants.length === 0 ? (
                  <div className="text-center p-4 border border-dashed border-slate-700 rounded-md">
                    <p className="text-slate-400">No variants added</p>
                  </div>
                ) : (
                  variants.map((variant, index) => (
                    <div key={index} className="p-4 rounded-lg border border-slate-700/50 bg-slate-900/50">
                      <div className="space-y-2">
                        <Label>Description</Label>
                        <Textarea
                          value={variant.description}
                          onChange={(e) => updateArray(setVariants, index, "description", e.target.value)}
                          className="bg-slate-900 border-slate-700 text-slate-200 mb-2"
                        />
                        <Label>Price Changes</Label>
                        <Input
                          value={variant.priceChanges}
                          onChange={(e) => updateArray(setVariants, index, "priceChanges", e.target.value)}
                          className="bg-slate-900 border-slate-700 text-slate-200"
                        />
                      </div>
                      <Button 
                        type="button" 
                        variant="destructive" 
                        size="sm" 
                        onClick={() => removeItem(setVariants, index)}
                        className="mt-2 w-full"
                      >
                        Remove
                      </Button>
                    </div>
                  ))
                )}
                
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => addItem(setVariants, { description: "", priceChanges: "" })}
                  className="w-full"
                >
                  <PlusCircle className="mr-2 h-4 w-4" /> Add Variant
                </Button>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" onClick={() => setShowAdvancedOptions(false)} className="bg-blue-600 hover:bg-blue-700">
              Save and Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Submit Button */}
      <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
        Save Work Journal Entry
      </Button>
    </form>
  );
};

export default WorkJournalEntryForm;
