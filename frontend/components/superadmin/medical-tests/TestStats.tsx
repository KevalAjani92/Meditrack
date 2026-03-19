"use client";

import { motion } from "framer-motion";
import { Activity, Beaker, CheckCircle2, Archive } from "lucide-react";
import { Card } from "@/components/ui/card";

interface TestStatsProps {
  stats?: {
    totalTests: number;
    activeTests: number;
    inactiveTests: number;
    testCategoriesDistinct: number;
  };
  scopedDepartmentName?: string;
}

export default function TestStats({ stats, scopedDepartmentName }: TestStatsProps) {
  const total = stats?.totalTests || 0;
  const active = stats?.activeTests || 0;
  const inactive = stats?.inactiveTests || 0;
  const typesCount = stats?.testCategoriesDistinct || 0;

  const statsList = [
    {
      label: scopedDepartmentName ? "Filtered Tests" : "Total Tests",
      value: total,
      icon: Beaker,
      color: "text-primary",
      bg: "bg-primary/10",
      sub: scopedDepartmentName ? `In ${scopedDepartmentName}` : "Global Registry",
    },
    {
      label: "Active Configs",
      value: active,
      icon: CheckCircle2,
      color: "text-success",
      bg: "bg-success/10",
      sub: "Available for ordering",
    },
    {
      label: "Inactive / Retired",
      value: inactive,
      icon: Archive,
      color: "text-muted-foreground",
      bg: "bg-muted",
      sub: "Archived records",
    },
    {
      label: "Test Categories",
      value: typesCount,
      icon: Activity,
      color: "text-blue-600",
      bg: "bg-blue-50",
      sub: "Distinct types found",
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