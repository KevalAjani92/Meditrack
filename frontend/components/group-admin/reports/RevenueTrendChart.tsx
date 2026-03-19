"use client";

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card } from "@/components/ui/card";
import { ChartDataPoint } from "@/types/reports";

interface Props {
  data: ChartDataPoint[];
}

export default function RevenueTrendChart({ data }: Props) {
  return (
    <Card className="p-6 border-border shadow-sm">
      <div className="mb-6">
        <h3 className="font-semibold text-foreground">Revenue Growth</h3>
        <p className="text-xs text-muted-foreground">Consolidated earnings</p>
      </div>
      
      <div className="h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(158, 64%, 42%)" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="hsl(158, 64%, 42%)" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} tickFormatter={(val) => `$${val}`} />
            <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid hsl(var(--border))' }} />
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke="hsl(158, 64%, 42%)" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorRev)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}