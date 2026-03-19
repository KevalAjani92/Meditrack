"use client";

import { CheckCircle2, AlertTriangle, Server } from "lucide-react";

// Toggle this to test visual states
const IS_HEALTHY = true; 

export default function SystemStatusCard() {
  return (
    <div className="h-full bg-card text-card-foreground border border-border rounded-xl shadow-sm p-6 flex flex-col">
      <div className="flex items-center gap-2 mb-4">
        <Server className="w-5 h-5 text-muted-foreground" />
        <h3 className="font-semibold text-foreground">System Status</h3>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center text-center py-6">
        <div
          className={`p-4 rounded-full mb-4 ${
            IS_HEALTHY ? "bg-success/10" : "bg-warning/10"
          }`}
        >
          {IS_HEALTHY ? (
            <CheckCircle2 className="w-12 h-12 text-success" />
          ) : (
            <AlertTriangle className="w-12 h-12 text-warning" />
          )}
        </div>

        <h4 className="text-xl font-bold mb-1">
          {IS_HEALTHY ? "All Systems Operational" : "Performance Degraded"}
        </h4>
        <p className="text-sm text-muted-foreground max-w-[80%] mx-auto">
          {IS_HEALTHY
            ? "Core services, database, and API gateways are running optimally."
            : "High latency detected in the South-East region API gateway."}
        </p>
      </div>

      <div className="mt-auto pt-4 border-t border-border w-full flex justify-between text-xs text-muted-foreground">
        <span>Uptime: 99.98%</span>
        <span>Last checked: 2m ago</span>
      </div>
    </div>
  );
}