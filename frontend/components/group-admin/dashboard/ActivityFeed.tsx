"use client";

import { CheckCircle2, AlertTriangle, Plus, UserPlus } from "lucide-react";

const activities = [
  { id: 1, type: "success", text: "New Hospital 'East Wing' added successfully", time: "10 min ago", icon: Plus },
  { id: 2, type: "info", text: "Dr. Sarah Smith registered at City West", time: "45 min ago", icon: UserPlus },
  { id: 3, type: "warning", text: "Subscription expiring for North Clinic", time: "2 hrs ago", icon: AlertTriangle },
  { id: 4, type: "success", text: "System backup completed", time: "5 hrs ago", icon: CheckCircle2 },
  { id: 5, type: "info", text: "New Group Admin invite sent", time: "Yesterday", icon: UserPlus },
];

export default function ActivityFeed() {
  return (
    <div className="bg-card border border-border rounded-xl shadow-sm flex flex-col h-full max-h-[400px]">
      <div className="p-4 border-b border-border">
        <h3 className="text-sm font-semibold text-foreground">Recent Activity</h3>
      </div>
      
      <div className="overflow-y-auto p-4 space-y-4 flex-1">
        {activities.map((item) => (
          <div key={item.id} className="flex gap-3 items-start">
            <div className={`mt-0.5 p-1.5 rounded-full shrink-0 ${
              item.type === 'success' ? 'bg-success/10 text-success' : 
              item.type === 'warning' ? 'bg-warning/10 text-warning' : 
              'bg-blue-50 text-blue-600'
            }`}>
              <item.icon className="w-3.5 h-3.5" />
            </div>
            <div>
              <p className="text-sm text-foreground leading-snug">{item.text}</p>
              <span className="text-[10px] text-muted-foreground">{item.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}