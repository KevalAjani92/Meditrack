"use client";

import { motion } from "framer-motion";
import { Calendar, UserPlus, AlertTriangle, RefreshCw } from "lucide-react";
import { VisitType } from "@/types/opd";

interface Props {
  selected: VisitType;
  onChange: (type: VisitType) => void;
}

export default function VisitTypeSelector({ selected, onChange }: Props) {
  const options: { type: VisitType; icon: any; colorClass: string }[] = [
    { type: "Scheduled", icon: Calendar, colorClass: "data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:border-primary" },
    { type: "Walk-In", icon: UserPlus, colorClass: "data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:border-blue-600" },
    { type: "Emergency", icon: AlertTriangle, colorClass: "data-[state=active]:bg-destructive data-[state=active]:text-destructive-foreground data-[state=active]:border-destructive" },
    { type: "Follow-Up", icon: RefreshCw, colorClass: "data-[state=active]:bg-orange-500 data-[state=active]:text-white data-[state=active]:border-orange-500" },
  ];

  return (
    <div className="flex flex-wrap items-center gap-3 bg-card p-3 rounded-xl border border-border shadow-sm">
      {options.map((opt) => {
        const isActive = selected === opt.type;
        return (
          <button
            key={opt.type}
            data-state={isActive ? "active" : "inactive"}
            onClick={() => onChange(opt.type)}
            className={`relative flex items-center gap-2 px-5 py-2.5 rounded-lg border text-sm font-medium transition-all duration-300 ${opt.colorClass} ${!isActive ? 'border-border bg-background text-muted-foreground hover:bg-muted/50 hover:text-foreground' : 'shadow-md'}`}
          >
            <opt.icon className={`w-4 h-4 ${isActive && opt.type === 'Emergency' ? 'animate-pulse' : ''}`} />
            {opt.type}
          </button>
        );
      })}
    </div>
  );
}