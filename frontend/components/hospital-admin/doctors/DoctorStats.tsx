"use client";

import { motion } from "framer-motion";
import { Stethoscope, UserCheck, UserX, Activity } from "lucide-react";
import { Card } from "@/components/ui/card";
import { DoctorStats as DoctorStatsType } from "@/types/doctor";

interface DoctorStatsProps {
  stats: DoctorStatsType | null;
  loading: boolean;
}

export default function DoctorStats({ stats, loading }: DoctorStatsProps) {
  const availabilityPercentage = stats && stats.totalDoctors > 0 
    ? Math.round((stats.availableDoctors / stats.totalDoctors) * 100) 
    : 0;

  const statItems = [
    { label: "Total Doctors", value: stats?.totalDoctors ?? 0, icon: Stethoscope, color: "text-primary", bg: "bg-primary/10" },
    { label: "Available Now", value: stats?.availableDoctors ?? 0, icon: UserCheck, color: "text-success", bg: "bg-success/10", sub: `${availabilityPercentage}% Availability` },
    { label: "Unavailable / Off", value: stats?.unavailableDoctors ?? 0, icon: UserX, color: "text-muted-foreground", bg: "bg-muted" },
    { label: "Departments Covered", value: stats?.departmentsCovered ?? 0, icon: Activity, color: "text-blue-600", bg: "bg-blue-50" },
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