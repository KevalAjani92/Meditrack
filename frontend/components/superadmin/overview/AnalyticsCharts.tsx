"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

// --- Mock Data ---
const growthData = [
  { month: "Jan", groups: 2 },
  { month: "Feb", groups: 4 },
  { month: "Mar", groups: 5 },
  { month: "Apr", groups: 8 },
  { month: "May", groups: 10 },
  { month: "Jun", groups: 12 },
];


const licenseData = [
  { name: "Active", value: 35, fill: "hsl(158, 64%, 42%)" },
  { name: "Expiring Soon", value: 8, fill: "hsl(38, 92%, 50%)" }, // Warning
  { name: "Expired", value: 5, fill: "hsl(0, 75%, 55%)" },        // Destructive
];

export default function AnalyticsCharts() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      
      {/* 1. Growth Trend (Area Chart) */}
      <div className="bg-card border border-border rounded-xl p-6 shadow-sm lg:col-span-2">
        <h3 className="text-lg font-semibold text-foreground mb-1">Group Growth Trend</h3>
        <p className="text-sm text-muted-foreground mb-6">New Hospital Groups onboarded (Last 6 Months)</p>
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={growthData}>
              <defs>
                <linearGradient id="colorGroups" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(158, 64%, 42%)" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="hsl(158, 64%, 42%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="month" 
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
                contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
                itemStyle={{ color: "hsl(var(--primary))", fontWeight: "bold" }}
              />
              <Area 
                type="monotone" 
                dataKey="groups" 
                stroke="hsl(158, 64%, 42%)" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorGroups)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 2. License Status (Stacked Bar - Simplified to regular bar for clarity) */}
      <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-foreground mb-1">License Health</h3>
        <p className="text-sm text-muted-foreground mb-6">Current subscription status</p>
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={licenseData} layout="vertical" margin={{ left: 0 }}>
              <XAxis type="number" hide />
              <YAxis 
                dataKey="name" 
                type="category" 
                width={100}
                axisLine={false} 
                tickLine={false}
                tick={{ fill: "hsl(var(--foreground))", fontSize: 12, fontWeight: 500 }} 
              />
              <Tooltip cursor={{fill: 'transparent'}} />
              <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={32} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}