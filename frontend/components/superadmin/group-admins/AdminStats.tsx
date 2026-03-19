"use client";

import { motion } from "framer-motion";
import { Users, UserCheck, UserX, Building2 } from "lucide-react";
import { Card } from "@/components/ui/card"; // Assuming generic Card exists

const stats = [
  {
    label: "Total Admins",
    value: "24",
    icon: Users,
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    label: "Active Admins",
    value: "18",
    icon: UserCheck,
    color: "text-success",
    bg: "bg-success/10",
  },
  {
    label: "Inactive/Suspended",
    value: "6",
    icon: UserX,
    color: "text-destructive",
    bg: "bg-destructive/10",
  },
  {
    label: "Assigned Groups",
    value: "12",
    icon: Building2,
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
];

interface AdminStatsProps {
  stats: {
    totalAdmins: number;
    activeAdmins: number;
    inactiveAdmins: number;
    assignedGroups: number;
  };
  isLoading?: boolean;
}

export default function AdminStats({ stats, isLoading }: AdminStatsProps) {
  const statsConfig = [
    {
      label: "Total Admins",
      value: stats.totalAdmins,
      icon: Users,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      label: "Active Admins",
      value: stats.activeAdmins,
      icon: UserCheck,
      color: "text-success",
      bg: "bg-success/10",
    },
    {
      label: "Inactive Admins",
      value: stats.inactiveAdmins,
      icon: UserX,
      color: "text-destructive",
      bg: "bg-destructive/10",
    },
    {
      label: "Assigned Groups",
      value: stats.assignedGroups,
      icon: Building2,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((_, i) => (
          <div key={i} className="h-24 rounded-lg bg-muted animate-pulse" />
        ))}
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {statsConfig.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
        >
          <Card className="p-5 flex items-center justify-between hover:shadow-md transition-all border-border">
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
