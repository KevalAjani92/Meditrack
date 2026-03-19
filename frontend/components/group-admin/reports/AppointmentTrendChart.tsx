"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Card } from "@/components/ui/card";
import { ChartDataPoint } from "@/types/reports";

interface Props {
  data: ChartDataPoint[];
  compareMode: boolean;
}

export default function AppointmentTrendChart({ data, compareMode }: Props) {
  return (
    <Card className="p-6 border-border shadow-sm">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h3 className="font-semibold text-foreground">Appointment Trends</h3>
          <p className="text-xs text-muted-foreground">Volume over selected period</p>
        </div>
      </div>
      
      <div className="h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
            <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid hsl(var(--border))' }} />
            <Legend verticalAlign="top" height={36} />
            
            <Line 
              name="Current Period"
              type="monotone" 
              dataKey="value" 
              stroke="hsl(158, 64%, 42%)" 
              strokeWidth={3} 
              dot={false} 
              activeDot={{ r: 6 }} 
            />
            
            {compareMode && (
              <Line 
                name="Previous Period"
                type="monotone" 
                dataKey="compareValue" 
                stroke="#94a3b8" 
                strokeWidth={2} 
                strokeDasharray="5 5" 
                dot={false} 
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}