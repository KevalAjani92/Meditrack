"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const data = [
  { day: '1', current: 400, previous: 240 },
  { day: '5', current: 300, previous: 139 },
  { day: '10', current: 500, previous: 980 },
  { day: '15', current: 200, previous: 390 },
  { day: '20', current: 278, previous: 480 },
  { day: '25', current: 189, previous: 380 },
  { day: '30', current: 239, previous: 430 },
];

export default function GrowthComparisonChart() {
  return (
    <div className="bg-card border border-border rounded-xl p-6 shadow-sm h-full flex flex-col">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h3 className="text-lg font-bold text-foreground">Monthly Growth</h3>
          <p className="text-sm text-muted-foreground">Appointments: This Month vs Last</p>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-primary"></span> Current
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-gray-400"></span> Previous
          </div>
        </div>
      </div>
      
      <div className="flex-1 min-h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="day" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} 
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} 
            />
            <Tooltip 
              contentStyle={{ backgroundColor: "hsl(var(--popover))", borderRadius: "8px", border: "1px solid hsl(var(--border))" }}
            />
            <Line type="monotone" dataKey="current" stroke="hsl(158, 64%, 42%)" strokeWidth={3} dot={false} />
            <Line type="monotone" dataKey="previous" stroke="#94a3b8" strokeWidth={2} strokeDasharray="5 5" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}