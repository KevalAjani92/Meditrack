"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Card } from "@/components/ui/card";

const comparisonData = [
  { name: 'Apex Heart', value: 4500 },
  { name: 'City West', value: 3200 },
  { name: 'North Gen', value: 2800 },
  { name: 'Southside', value: 1950 },
];

export default function HospitalComparisonChart() {
  return (
    <Card className="p-6 border-border shadow-sm">
      <div className="mb-6 flex justify-between">
        <h3 className="font-semibold text-foreground">Performance by Hospital</h3>
        <select className="text-xs border rounded px-2 py-1 bg-background text-muted-foreground">
          <option>By Appointments</option>
          <option>By Revenue</option>
        </select>
      </div>
      
      <div className="h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart layout="vertical" data={comparisonData} margin={{ left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="hsl(var(--border))" />
            <XAxis type="number" hide />
            <YAxis 
              dataKey="name" 
              type="category" 
              axisLine={false} 
              tickLine={false} 
              width={100} 
              tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
            />
            <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '8px', border: '1px solid hsl(var(--border))' }} />
            <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={24}>
              {comparisonData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={index === 0 ? "hsl(158, 64%, 42%)" : "hsl(var(--muted-foreground))"} fillOpacity={index === 0 ? 1 : 0.5} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}