"use client";

import { useState } from "react";
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

const mockData = [
  { name: 'City', value: 85 },
  { name: 'West', value: 65 },
  { name: 'North', value: 45 },
  { name: 'East', value: 30 },
];

const waitData = [
  { name: 'City', value: 12 }, // mins
  { name: 'West', value: 25 },
  { name: 'North', value: 18 },
  { name: 'East', value: 45 },
];

const noShowData = [
  { name: 'City', value: 5 }, // %
  { name: 'West', value: 8 },
  { name: 'North', value: 12 },
  { name: 'East', value: 2 },
];

export default function HospitalPerformanceCharts() {
  const [timeRange, setTimeRange] = useState<"Today" | "Month">("Today");

  return (
    <div className="space-y-4">
       {/* Section Header with Toggle */}
      <div className="flex justify-between items-center px-1">
        <h3 className="text-lg font-bold text-foreground">Hospital Performance Metrics</h3>
        <div className="flex bg-muted p-1 rounded-lg">
          <button 
            onClick={() => setTimeRange("Today")}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${timeRange === 'Today' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground'}`}
          >
            Today
          </button>
          <button 
            onClick={() => setTimeRange("Month")}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${timeRange === 'Month' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground'}`}
          >
            Month
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <PerformanceCard title="New Patient Rate" data={mockData} color="hsl(158, 64%, 42%)" unit="%" />
        <PerformanceCard title="Avg Waiting Time" data={waitData} color="hsl(38, 92%, 50%)" unit="min" />
        <PerformanceCard title="No-Show Rate" data={noShowData} color="hsl(0, 75%, 55%)" unit="%" />
      </div>
    </div>
  );
}

function PerformanceCard({ title, data, color, unit }: { title: string, data: any[], color: string, unit: string }) {
  return (
    <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
      <p className="text-sm font-medium text-muted-foreground mb-4">{title}</p>
      <div className="h-[120px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis dataKey="name" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
            <Tooltip 
              cursor={{ fill: 'transparent' }}
              contentStyle={{ backgroundColor: "hsl(var(--popover))", borderRadius: "8px", border: "1px solid hsl(var(--border))" }}
            />
            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={color} fillOpacity={0.8} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}