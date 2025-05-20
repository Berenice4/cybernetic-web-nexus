
import { useState } from "react";
import { WorkJournalEntry } from "@/types/workJournal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Users, Wrench, LineChart } from "lucide-react";
import { ChartContainer } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell } from "recharts";

interface WorkJournalStatsProps {
  entries: WorkJournalEntry[];
}

const WorkJournalStats = ({ entries }: WorkJournalStatsProps) => {
  const [timeRange, setTimeRange] = useState<"all" | "week" | "month">("all");
  
  // Calculate stats
  const totalEntries = entries.length;
  const totalWorkers = entries.reduce((acc, entry) => 
    acc + entry.workers.reduce((sum, worker) => sum + worker.count, 0), 0);
  const totalEquipment = entries.reduce((acc, entry) => acc + entry.equipment.length, 0);
  const totalActivities = entries.reduce((acc, entry) => acc + entry.activities.length, 0);
  
  // Generate dummy data for charts
  const workersByQualification = entries.reduce((acc: Record<string, number>, entry) => {
    entry.workers.forEach(worker => {
      const qualification = worker.qualification || "Unspecified";
      acc[qualification] = (acc[qualification] || 0) + worker.count;
    });
    return acc;
  }, {});
  
  const workersChartData = Object.keys(workersByQualification).map(qualification => ({
    name: qualification,
    workers: workersByQualification[qualification]
  }));
  
  // Equipment usage data
  const equipmentUsage = entries.reduce((acc: Record<string, number>, entry) => {
    entry.equipment.forEach(eq => {
      const name = eq.name || "Unspecified";
      acc[name] = (acc[name] || 0) + 1;
    });
    return acc;
  }, {});
  
  const equipmentChartData = Object.keys(equipmentUsage)
    .map(name => ({
      name,
      value: equipmentUsage[name]
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5); // Just take top 5
  
  // Activity trends
  const activityTrends = entries.map(entry => ({
    date: entry.date,
    workers: entry.workers.reduce((sum, worker) => sum + worker.count, 0),
    activities: entry.activities.length,
    equipment: entry.equipment.length
  })).sort((a, b) => a.date.localeCompare(b.date));
  
  // Colors for the pie chart
  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];

  return (
    <div className="space-y-6">
      {entries.length === 0 ? (
        <div className="text-center py-12">
          <LineChart className="mx-auto h-12 w-12 text-slate-400 mb-4" />
          <h3 className="text-lg font-medium mb-2 text-slate-700">No Statistics Available</h3>
          <p className="text-slate-500">Create work journal entries to view statistics</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Summary Cards */}
            <Card className="border-slate-200 bg-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-500">Total Entries</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-blue-500 mr-2" />
                  <span className="text-2xl font-bold text-slate-700">{totalEntries}</span>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-slate-200 bg-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-500">Total Workers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <Users className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-2xl font-bold text-slate-700">{totalWorkers}</span>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-slate-200 bg-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-500">Equipment Used</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <Wrench className="h-5 w-5 text-yellow-500 mr-2" />
                  <span className="text-2xl font-bold text-slate-700">{totalEquipment}</span>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-slate-200 bg-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-500">Activities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <LineChart className="h-5 w-5 text-purple-500 mr-2" />
                  <span className="text-2xl font-bold text-slate-700">{totalActivities}</span>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Tabs defaultValue="workers">
            <TabsList className="w-full md:w-auto bg-white border border-slate-200">
              <TabsTrigger value="workers" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">Workers</TabsTrigger>
              <TabsTrigger value="equipment" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">Equipment</TabsTrigger>
              <TabsTrigger value="trends" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">Activity Trends</TabsTrigger>
            </TabsList>
            
            <TabsContent value="workers" className="mt-4">
              <Card className="border-slate-200 bg-white">
                <CardHeader>
                  <CardTitle className="text-slate-700">Workers by Qualification</CardTitle>
                  <CardDescription>Distribution of workers based on their qualifications</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={{}} className="h-80">
                    <BarChart
                      data={workersChartData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis 
                        dataKey="name" 
                        angle={-45} 
                        textAnchor="end" 
                        height={70} 
                        tick={{ fill: '#4b5563', fontSize: 12 }}
                      />
                      <YAxis tick={{ fill: '#4b5563' }} />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '0.375rem' }}
                        itemStyle={{ color: '#1f2937' }}
                        labelStyle={{ color: '#4b5563' }}
                      />
                      <Legend wrapperStyle={{ paddingTop: '20px' }} />
                      <Bar dataKey="workers" fill="#3b82f6" name="Workers" />
                    </BarChart>
                  </ChartContainer>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="equipment" className="mt-4">
              <Card className="border-slate-200 bg-white">
                <CardHeader>
                  <CardTitle className="text-slate-700">Equipment Usage</CardTitle>
                  <CardDescription>Most frequently used equipment across all entries</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={{}} className="h-80">
                    <PieChart margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                      <Pie
                        data={equipmentChartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {equipmentChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '0.375rem' }}
                        itemStyle={{ color: '#1f2937' }}
                        labelStyle={{ color: '#4b5563' }}
                      />
                      <Legend wrapperStyle={{ paddingTop: '20px' }} />
                    </PieChart>
                  </ChartContainer>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="trends" className="mt-4">
              <Card className="border-slate-200 bg-white">
                <CardHeader>
                  <CardTitle className="text-slate-700">Activity Trends</CardTitle>
                  <CardDescription>Work activity trends over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={{}} className="h-80">
                    <BarChart
                      data={activityTrends}
                      margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis 
                        dataKey="date" 
                        angle={-45} 
                        textAnchor="end" 
                        height={70}
                        tick={{ fill: '#4b5563', fontSize: 12 }}
                      />
                      <YAxis tick={{ fill: '#4b5563' }} />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '0.375rem' }}
                        itemStyle={{ color: '#1f2937' }}
                        labelStyle={{ color: '#4b5563' }}
                      />
                      <Legend wrapperStyle={{ paddingTop: '20px' }} />
                      <Bar dataKey="workers" stackId="a" fill="#10b981" name="Workers" />
                      <Bar dataKey="activities" stackId="a" fill="#8b5cf6" name="Activities" />
                      <Bar dataKey="equipment" stackId="a" fill="#f59e0b" name="Equipment" />
                    </BarChart>
                  </ChartContainer>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
};

export default WorkJournalStats;
