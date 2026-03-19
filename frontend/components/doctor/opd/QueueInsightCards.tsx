"use client";

import { motion } from "framer-motion";
import { Users, UserCheck, Activity, CheckCircle2, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { OpdToken } from "@/types/opd-queue";

export default function QueueInsightCards({ queue }: { queue: any }) {
  const total = queue.total;
  const waiting = queue.waiting;
  const inProgress = queue.inProgress;
  const completed = queue.completed;
  
  const waitTimes = queue.waitTimes;
  const avgWait = queue.avgWait;

  const stats = [
    { label: "Total Tokens", value: total, icon: Users, color: "text-primary", bg: "bg-primary/10" },
    { label: "Waiting", value: waiting, icon: Clock, color: "text-warning-foreground", bg: "bg-warning/10" },
    { label: "In Progress", value: inProgress, icon: Activity, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Completed", value: completed, icon: CheckCircle2, color: "text-success", bg: "bg-success/10" },
    { label: "Avg Wait Time", value: `${avgWait} min`, icon: UserCheck, color: "text-emerald-600", bg: "bg-emerald-50" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {stats.map((stat, i) => (
        <motion.div key={stat.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
          <Card className="p-4 border-border shadow-sm flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-foreground">{stat.value}</h3>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground mt-0.5">{stat.label}</p>
            </div>
            <div className={`p-2.5 rounded-lg ${stat.bg}`}><stat.icon className={`w-5 h-5 ${stat.color}`} /></div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}