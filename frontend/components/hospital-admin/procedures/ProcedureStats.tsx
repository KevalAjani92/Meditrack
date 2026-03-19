"use client";

import { motion } from "framer-motion";
import { LayoutList, Scissors, CheckCircle2, XCircle } from "lucide-react";
import { Card } from "@/components/ui/card";

interface Props {
  totalMaster: number;
  totalEnabled: number;
  activeCount: number;
  inactiveCount: number;
}

export default function ProcedureStats({ totalMaster, totalEnabled, activeCount, inactiveCount }: Props) {
  const stats = [
    { label: "Master Procedures", value: totalMaster, icon: LayoutList, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Enabled in Hospital", value: totalEnabled, icon: Scissors, color: "text-primary", bg: "bg-primary/10" },
    { label: "Active Procedures", value: activeCount, icon: CheckCircle2, color: "text-success", bg: "bg-success/10" },
    { label: "Inactive Procedures", value: inactiveCount, icon: XCircle, color: "text-muted-foreground", bg: "bg-muted/20" },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, i) => (
        <motion.div key={stat.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
          <Card className="p-5 flex items-center justify-between border-border shadow-sm hover:shadow-md transition-shadow">
            <div>
              <h3 className="text-2xl font-bold text-foreground">{stat.value}</h3>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mt-1">{stat.label}</p>
            </div>
            <div className={`p-3 rounded-xl ${stat.bg}`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}