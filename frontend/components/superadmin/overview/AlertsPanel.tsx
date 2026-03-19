"use client";

import { AlertOctagon, Clock, ArrowRight } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area"; // Assuming standard UI component

const alerts = [
  {
    id: 1,
    title: "License Expired: City Care Hospital",
    type: "destructive",
    date: "2 hours ago",
  },
  {
    id: 2,
    title: "Payment Failed: Green Valley Group",
    type: "destructive",
    date: "5 hours ago",
  },
  {
    id: 3,
    title: "Subscription Ending: Metro OPD",
    type: "warning",
    date: "1 day ago",
  },
  {
    id: 4,
    title: "High Error Rate: API Node 4",
    type: "warning",
    date: "2 days ago",
  },
];

export default function AlertsPanel() {
  return (
    <div className="h-full bg-card text-card-foreground border border-border rounded-xl shadow-sm flex flex-col">
      <div className="p-6 pb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertOctagon className="w-5 h-5 text-destructive" />
          <h3 className="font-semibold text-foreground">Critical Alerts</h3>
        </div>
        <button className="text-xs font-medium text-primary hover:text-primary/80 flex items-center gap-1 transition-colors">
          View all <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      <div className="p-6 pt-2 flex-1">
        <div className="space-y-3">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={`flex items-start gap-4 p-3 rounded-lg border transition-colors cursor-pointer ${
                alert.type === "destructive"
                  ? "bg-destructive/5 border-destructive/20 hover:bg-destructive/10"
                  : "bg-warning/5 border-warning/20 hover:bg-warning/10"
              }`}
            >
              <div
                className={`mt-0.5 p-1.5 rounded-full ${
                  alert.type === "destructive"
                    ? "bg-destructive/10 text-destructive"
                    : "bg-warning/10 text-warning"
                }`}
              >
                {alert.type === "destructive" ? (
                  <AlertOctagon className="w-4 h-4" />
                ) : (
                  <Clock className="w-4 h-4" />
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">
                  {alert.title}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {alert.date}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}