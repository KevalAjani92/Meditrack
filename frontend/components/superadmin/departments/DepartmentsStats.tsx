"use client";

import { motion } from "framer-motion";
import { Building, CalendarPlus } from "lucide-react";
import { Card } from "@/components/ui/card";

interface DepartmentsStatsProps {
  stats?: {
    totalDepartments: number;
    recentlyAdded: number;
  };
  isLoading?: boolean;
}

export default function DepartmentsStats({
  stats,
  isLoading,
}: DepartmentsStatsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[1, 2].map((_, i) => (
          <div
            key={i}
            className="h-24 rounded-lg bg-muted animate-pulse"
          />
        ))}
      </div>
    );
  }

  const statsConfig = [
    {
      label: "Total Departments",
      value: stats?.totalDepartments ?? 0,
      icon: Building,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Recently Added (30d)",
      value: stats?.recentlyAdded ?? 0,
      icon: CalendarPlus,
      color: "text-success",
      bg: "bg-success/10",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {statsConfig.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
        >
          <Card className="p-5 flex items-center justify-between border-border shadow-sm">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </p>
              <h3 className="text-2xl font-bold text-foreground mt-1">
                {stat.value}
              </h3>
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