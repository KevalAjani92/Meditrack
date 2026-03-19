"use client";

import { Card } from "@/components/ui/card";
import { AlertCircle, CheckCircle2, Clock } from "lucide-react";

export default function OverviewTab() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      
      {/* Activity Summary */}
      <Card className="md:col-span-2 p-6 border-border shadow-sm">
        <h3 className="text-lg font-semibold text-foreground mb-4">Operational Status</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg bg-muted/30 border border-border">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Patient Inflow</p>
            <p className="text-2xl font-bold text-foreground mt-1">+12%</p>
            <p className="text-xs text-success mt-1">vs last month</p>
          </div>
          <div className="p-4 rounded-lg bg-muted/30 border border-border">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Doc Availability</p>
            <p className="text-2xl font-bold text-foreground mt-1">92%</p>
            <p className="text-xs text-muted-foreground mt-1">Avg daily</p>
          </div>
          <div className="p-4 rounded-lg bg-muted/30 border border-border">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Pending Reports</p>
            <p className="text-2xl font-bold text-foreground mt-1">14</p>
            <p className="text-xs text-primary mt-1">Needs attention</p>
          </div>
        </div>
        
        <div className="mt-6 pt-6 border-t border-border">
          <h4 className="text-sm font-medium text-foreground mb-3">Recent System Events</h4>
          <ul className="space-y-3">
            <li className="flex items-center gap-3 text-sm text-muted-foreground">
              <div className="w-2 h-2 rounded-full bg-success" />
              <span>Dr. Sarah Smith completed onboarding</span>
              <span className="ml-auto text-xs opacity-70">2 hours ago</span>
            </li>
            <li className="flex items-center gap-3 text-sm text-muted-foreground">
              <div className="w-2 h-2 rounded-full bg-primary" />
              <span>New Cardiology package activated</span>
              <span className="ml-auto text-xs opacity-70">5 hours ago</span>
            </li>
          </ul>
        </div>
      </Card>

      {/* Alerts Panel */}
      <Card className="p-6 border-border shadow-sm h-fit">
        <div className="flex items-center gap-2 mb-4 text-destructive">
          <AlertCircle className="w-5 h-5" />
          <h3 className="font-semibold">Priority Alerts</h3>
        </div>
        
        <div className="space-y-3">
          <div className="p-3 rounded-lg bg-warning/10 border border-warning/20 text-warning-foreground text-sm flex gap-3">
            <Clock className="w-4 h-4 shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">License Expiring</p>
              <p className="text-xs opacity-90 mt-0.5">Renewal due in 14 days.</p>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-muted border border-border text-muted-foreground text-sm flex gap-3">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Low Staffing</p>
              <p className="text-xs opacity-90 mt-0.5">Night shift reception short.</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}