"use client";

import { Building, Users, FileBarChart, PlusCircle } from "lucide-react";

const actions = [
  { label: "Manage Hospitals", icon: Building },
  { label: "Admin Users", icon: Users },
  { label: "View Reports", icon: FileBarChart },
  { label: "Add Hospital", icon: PlusCircle, highlight: true },
];

export default function QuickActionsPanel() {
  return (
    <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
      <h3 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wider">Quick Actions</h3>
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action) => (
          <button
            key={action.label}
            className={`flex flex-col items-center justify-center p-4 rounded-lg border transition-all hover:shadow-md ${
              action.highlight
                ? "bg-primary/5 border-primary/20 hover:bg-primary/10 text-primary"
                : "bg-background border-border hover:border-primary/50 text-muted-foreground hover:text-foreground"
            }`}
          >
            <action.icon className="w-6 h-6 mb-2" />
            <span className="text-xs font-medium text-center">{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}