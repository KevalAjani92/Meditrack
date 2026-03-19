"use client";

import { motion } from "framer-motion";
import { Activity, BookOpen, Stethoscope, Filter } from "lucide-react";
import { Card } from "@/components/ui/card";

interface DiagnosisStatsProps {
  stats?: {
    totalDiagnoses: number;
    recentlyAdded: number;
    activeDepartments: number;
  };
  scopedDepartmentName?: string;
}

export default function DiagnosisStats({ stats, scopedDepartmentName }: DiagnosisStatsProps) {
  const statsList = [
    { 
      label: scopedDepartmentName ? "Filtered Diagnoses" : "Total Diagnoses", 
      value: stats?.totalDiagnoses.toString() || "0", 
      icon: Activity, 
      color: "text-primary", 
      bg: "bg-primary/10",
      sub: scopedDepartmentName ? `In ${scopedDepartmentName}` : "Across all departments"
    },
    { 
      label: "Active Departments", 
      value: stats?.activeDepartments ?? 0, 
      icon: Stethoscope, 
      color: "text-blue-600", 
      bg: "bg-blue-50",
      sub: "With registered codes"
    },
    { 
      label: "Recently Added", 
      value: stats?.recentlyAdded ?? 0,
      icon: BookOpen, 
      color: "text-success", 
      bg: "bg-success/10",
      sub: "Last 30 days"
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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