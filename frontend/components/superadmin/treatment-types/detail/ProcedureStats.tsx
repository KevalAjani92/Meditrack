"use client";

import { motion } from "framer-motion";
import { List, CheckCircle2, Archive, Scissors } from "lucide-react";
import { Card } from "@/components/ui/card";
interface ProcedureStatsProps {
  stats?:{
    totalProcedures: number;
    activeProcedures: number;
    surgicalProcedures: number;
    inactiveProcedures: number;
  }
}

export default function ProcedureStats({ stats }: ProcedureStatsProps) {
  const total = stats?.totalProcedures || 0;
  const active = stats?.activeProcedures || 0;
  const inactive = stats?.inactiveProcedures || 0;
  const surgical = stats?.surgicalProcedures || 0;

  const statsList = [
    { label: "Total Procedures", value: total, icon: List, color: "text-primary", bg: "bg-primary/10" },
    { label: "Active Steps", value: active, icon: CheckCircle2, color: "text-success", bg: "bg-success/10" },
    { label: "Surgical", value: surgical, icon: Scissors, color: "text-destructive", bg: "bg-destructive/10" }, // Red for surgery/critical
    { label: "Inactive", value: inactive, icon: Archive, color: "text-muted-foreground", bg: "bg-muted" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {statsList.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 + (i * 0.1) }}
        >
          <Card className="p-4 flex items-center justify-between border-border shadow-sm">
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{stat.label}</p>
              <h3 className="text-2xl font-bold text-foreground mt-1">{stat.value}</h3>
            </div>
            <div className={`p-2.5 rounded-xl ${stat.bg}`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}