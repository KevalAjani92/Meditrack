"use client";

import { motion } from "framer-motion";
import { Activity, Archive, CheckCircle2, Layers } from "lucide-react";
import { Card } from "@/components/ui/card";

interface TreatmentStatsProps {
  stats?: {
    totalTreatments: number;
    activeTreatments: number;
    inactiveTreatments: number;
    departmentsWithDefinedTreatments: number;
  };
  scopedDepartmentName?: string;
}

export default function TreatmentStats({ stats, scopedDepartmentName }: TreatmentStatsProps) {
  // Dynamic Calculation
  const total = stats?.totalTreatments || 0;
  const active = stats?.activeTreatments || 0;
  const inactive = stats?.inactiveTreatments || 0;
  const departments = stats?.departmentsWithDefinedTreatments || 0;

  const statsList = [
    {
      label: "Total Treatments",
      value: total,
      icon: Layers,
      color: "text-primary",
      bg: "bg-primary/10",
      sub: scopedDepartmentName ? `In ${scopedDepartmentName}` : "Global Registry",
    },
    {
      label: "Active Procedures",
      value: active,
      icon: CheckCircle2,
      color: "text-success",
      bg: "bg-success/10",
      sub: "Available for booking",
    },
    {
      label: "Inactive / Retired",
      value: inactive,
      icon: Archive,
      color: "text-muted-foreground",
      bg: "bg-muted",
      sub: "Archived codes",
    },
  ];

  // Only show Department Coverage in Global Mode
  if (!scopedDepartmentName) {
    statsList.push({
      label: "Departments",
      value: departments,
      icon: Activity,
      color: "text-blue-600",
      bg: "bg-blue-50",
      sub: "With defined treatments",
    });
  }

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 ${!scopedDepartmentName ? 'lg:grid-cols-4' : 'lg:grid-cols-3'} gap-4`}>
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
              <h3 className="text-2xl font-bold text-foreground mt-1">{stat.value}</h3>
              <p className="text-xs text-muted-foreground mt-1">{stat.sub}</p>
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