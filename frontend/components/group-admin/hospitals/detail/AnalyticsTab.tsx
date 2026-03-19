"use client";

import { useState } from "react";
import { AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card } from "@/components/ui/card";

const mockTrendData = [
  { day: '1', patients: 20, revenue: 4000, noshow: 2 },
  { day: '5', patients: 35, revenue: 6500, noshow: 4 },
  { day: '10', patients: 25, revenue: 5000, noshow: 1 },
  { day: '15', patients: 45, revenue: 8200, noshow: 5 },
  { day: '20', patients: 30, revenue: 5800, noshow: 3 },
  { day: '25', patients: 50, revenue: 9500, noshow: 2 },
  { day: '30', patients: 40, revenue: 7800, noshow: 6 },
];

export default function AnalyticsTab() {
  const [dateRange, setDateRange] = useState("30d");

  return (
    <div className="space-y-6">
      {/* Filter Row */}
      <div className="flex justify-end">
        <div className="flex bg-muted p-1 rounded-lg border border-border">
          <button 
            onClick={() => setDateRange("30d")}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${dateRange === '30d' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
          >
            Last 30 Days
          </button>
          <button 
            onClick={() => setDateRange("month")}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${dateRange === 'month' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
          >
            This Month
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Revenue Trend */}
        <Card className="p-6 border-border shadow-sm">
          <h3 className="text-sm font-semibold text-foreground mb-6">Revenue Trend</h3>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockTrendData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(158, 64%, 42%)" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="hsl(158, 64%, 42%)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fontSize: 10}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10}} tickFormatter={(val) => `$${val}`} />
                <Tooltip contentStyle={{borderRadius: '8px', border: 'none'}} />
                <Area type="monotone" dataKey="revenue" stroke="hsl(158, 64%, 42%)" fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Patient Volume */}
        <Card className="p-6 border-border shadow-sm">
          <h3 className="text-sm font-semibold text-foreground mb-6">Patient Volume</h3>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockTrendData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fontSize: 10}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10}} />
                <Tooltip contentStyle={{borderRadius: '8px', border: 'none'}} />
                <Line type="monotone" dataKey="patients" stroke="hsl(217, 91%, 60%)" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* No-Show Rate */}
        <Card className="p-6 border-border shadow-sm lg:col-span-2">
          <h3 className="text-sm font-semibold text-foreground mb-6">No-Show Incidents</h3>
          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockTrendData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fontSize: 10}} />
                <Tooltip cursor={{fill: 'transparent'}} contentStyle={{borderRadius: '8px', border: 'none'}} />
                <Bar dataKey="noshow" fill="hsl(0, 75%, 55%)" radius={[4, 4, 0, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

      </div>
    </div>
  );
}