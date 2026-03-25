"use client";

import { motion } from "framer-motion";
import { Users, UserCheck, Activity, CheckCircle2, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";

interface StatsData {
  total: number;
  waiting: number;
  inProgress: number;
  completed: number;
  skipped: number;
  avgWaitMins: number;
}

export default function QueueInsightCards({ stats, loading }: { stats: StatsData | null; loading: boolean }) {
  const statItems = [
    { label: "Total Tokens", value: stats?.total ?? 0, icon: Users, color: "text-primary", bg: "bg-primary/10" },
    { label: "Waiting", value: stats?.waiting ?? 0, icon: Clock, color: "text-warning-foreground", bg: "bg-warning/10" },
    { label: "In Progress", value: stats?.inProgress ?? 0, icon: Activity, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Completed", value: stats?.completed ?? 0, icon: CheckCircle2, color: "text-success", bg: "bg-success/10" },
    { label: "Avg Wait Time", value: `${stats?.avgWaitMins ?? 0} min`, icon: UserCheck, color: "text-emerald-600", bg: "bg-emerald-50" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {statItems.map((stat, i) => (
        <motion.div key={stat.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
          <Card className="p-4 border-border shadow-sm flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-foreground">{loading ? "—" : stat.value}</h3>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground mt-0.5">{stat.label}</p>
            </div>
            <div className={`p-2.5 rounded-lg ${stat.bg}`}><stat.icon className={`w-5 h-5 ${stat.color}`} /></div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}