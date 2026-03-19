"use client";

import { Trophy, TrendingUp } from "lucide-react";

const topHospitals = [
  { rank: 2, name: "City West Branch", revenue: "$12,450", growth: "+4%" },
  { rank: 3, name: "North Side Clinic", revenue: "$9,800", growth: "+1.2%" },
];

export default function TopHospitalsPanel() {
  return (
    <div className="space-y-4">
      
      {/* #1 Performer - Highlight Card */}
      <div className="bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/20 rounded-xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Trophy className="w-24 h-24 text-primary" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <Trophy className="w-5 h-5 text-yellow-600" />
            <span className="text-xs font-bold text-yellow-700 uppercase tracking-wider">Top Performer</span>
          </div>
          <h3 className="text-xl font-bold text-foreground">Apex General Hospital</h3>
          <p className="text-sm text-muted-foreground mb-4">New York, NY</p>
          
          <div className="flex justify-between items-end">
            <div>
              <p className="text-xs text-muted-foreground">Monthly Revenue</p>
              <p className="text-lg font-bold text-primary">$45,200</p>
            </div>
            <div className="text-right">
              <span className="inline-flex items-center px-2 py-1 rounded-full bg-success/20 text-success text-xs font-bold">
                <TrendingUp className="w-3 h-3 mr-1" /> +12%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Runner ups */}
      <div className="bg-card border border-border rounded-xl p-4 shadow-sm space-y-4">
        <h4 className="text-sm font-semibold text-foreground">Top Performing Locations</h4>
        {topHospitals.map((hospital) => (
          <div key={hospital.name} className="flex items-center justify-between border-b border-border last:border-0 pb-3 last:pb-0">
            <div className="flex items-center gap-3">
              <span className="w-6 h-6 flex items-center justify-center rounded-full bg-muted text-xs font-bold text-muted-foreground">
                #{hospital.rank}
              </span>
              <div>
                <p className="text-sm font-medium text-foreground">{hospital.name}</p>
                <p className="text-xs text-muted-foreground">{hospital.revenue}</p>
              </div>
            </div>
            <span className="text-xs font-medium text-success">{hospital.growth}</span>
          </div>
        ))}
      </div>
    </div>
  );
}