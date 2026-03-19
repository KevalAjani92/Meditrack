"use client";

import { motion } from "framer-motion";
import { Users, UserCheck, UserX, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { ReceptionistStats as ReceptionistStatsType } from "@/types/receptionist";

interface ReceptionistStatsProps {
  stats: ReceptionistStatsType | null;
  loading: boolean;
}

export default function ReceptionistStats({ stats, loading }: ReceptionistStatsProps) {
  const activePercentage = stats && stats.totalReceptionists > 0 
    ? Math.round((stats.activeReceptionists / stats.totalReceptionists) * 100) 
    : 0;

  const statItems = [
    { label: "Total Receptionists", value: stats?.totalReceptionists ?? 0, icon: Users, color: "text-primary", bg: "bg-primary/10" },
    { label: "Active Staff", value: stats?.activeReceptionists ?? 0, icon: UserCheck, color: "text-success", bg: "bg-success/10", sub: `${activePercentage}% Workforce` },
    { label: "Inactive / On Leave", value: stats?.inactiveReceptionists ?? 0, icon: UserX, color: "text-muted-foreground", bg: "bg-muted" },
    { label: "Recently Added", value: stats?.recentlyAdded ?? 0, icon: Clock, color: "text-blue-600", bg: "bg-blue-50" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {statItems.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
        >
          <Card className="p-5 flex items-center justify-between border-border shadow-sm">
            <div>
              <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
              <h3 className="text-2xl font-bold text-foreground mt-1">
                {loading ? "—" : stat.value}
              </h3>
              {stat.sub && <p className="text-xs text-success mt-1 font-medium">{loading ? "" : stat.sub}</p>}
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