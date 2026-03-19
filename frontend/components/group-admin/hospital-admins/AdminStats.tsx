"use client";

import { motion } from "framer-motion";
import { Users, UserCheck, UserX, Building, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";

interface HospitalAdminsStatsProps{
  stats?:{
    totalAdmins: number;
    activeAdmins: number;
    unassignedAdmins: number;
    hospitalsWithoutAdmins: number;
  }
}

export default function AdminStats({ stats }: HospitalAdminsStatsProps) {
  const total = stats?.totalAdmins || 0;
  const active = stats?.activeAdmins || 0;
  const unassigned = stats?.unassignedAdmins || 0;
  const hospitalsWithoutAdmin = stats?.hospitalsWithoutAdmins ||0;

  const statsList = [
    { label: "Total Admins", value: total, icon: Users, color: "text-primary", bg: "bg-primary/10" },
    { label: "Active Accounts", value: active, icon: UserCheck, color: "text-success", bg: "bg-success/10" },
    { label: "Unassigned Pool", value: unassigned, icon: UserX, color: "text-blue-600", bg: "bg-blue-50" },
    { 
      label: "Hospitals w/o Admin", 
      value: hospitalsWithoutAdmin, 
      icon: hospitalsWithoutAdmin > 0 ? AlertCircle : Building, 
      color: hospitalsWithoutAdmin > 0 ? "text-destructive" : "text-muted-foreground", 
      bg: hospitalsWithoutAdmin > 0 ? "bg-destructive/10" : "bg-muted" 
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {statsList.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
        >
          <Card className="p-5 flex items-center justify-between border-border shadow-sm">
            <div>
              <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
              <h3 className={`text-2xl font-bold mt-1 ${stat.label.includes("w/o") && stat.value > 0 ? "text-destructive" : "text-foreground"}`}>
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