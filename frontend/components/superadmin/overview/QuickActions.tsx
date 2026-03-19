"use client";

import { 
  PlusCircle, 
  UserPlus, 
  Ban, 
  FileText, 
  RefreshCw 
} from "lucide-react";
import { motion } from "framer-motion";

const actions = [
  {
    label: "Create Group",
    icon: PlusCircle,
    color: "text-primary",
    bgColor: "bg-primary/10",
    onClick: () => console.log("Create Group"),
  },
  {
    label: "Assign Admin",
    icon: UserPlus,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    onClick: () => console.log("Assign Admin"),
  },
  {
    label: "Suspend Group",
    icon: Ban,
    color: "text-destructive",
    bgColor: "bg-destructive/10",
    onClick: () => console.log("Suspend Group"),
  },
  {
    label: "View Licenses",
    icon: FileText,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    onClick: () => console.log("View Licenses"),
  },
  {
    label: "Force Sync",
    icon: RefreshCw,
    color: "text-orange-600",
    bgColor: "bg-orange-50",
    onClick: () => console.log("Force Sync"),
  },
];

export default function QuickActions() {
  return (
    <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {actions.map((action) => (
          <motion.button
            key={action.label}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={action.onClick}
            className="flex flex-col items-center justify-center p-4 rounded-lg border border-border hover:border-primary/50 hover:shadow-sm transition-all bg-background"
          >
            <div className={`p-3 rounded-full mb-3 ${action.bgColor}`}>
              <action.icon className={`w-6 h-6 ${action.color}`} />
            </div>
            <span className="text-sm font-medium text-foreground">{action.label}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}