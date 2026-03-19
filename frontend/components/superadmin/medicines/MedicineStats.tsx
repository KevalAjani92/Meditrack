"use client";

import { motion } from "framer-motion";
import { Pill, Activity, Archive, Factory } from "lucide-react";
import { Card } from "@/components/ui/card";

interface MedicineStatsProps {
  stats?:{
    totalMedicines: number;
    activeMedicines: number;
    inactiveMedicines: number;
    distinctManufacturers: number;
  }
}

export default function MedicineStats({ stats }: MedicineStatsProps) {
  const total = stats?.totalMedicines || 0;
  const active = stats?.activeMedicines || 0;
  const inactive = stats?.inactiveMedicines || 0;
  const manufacturers = stats?.distinctManufacturers || 0;

  const statsList = [
    {
      label: "Total Medicines",
      value: total,
      icon: Pill,
      color: "text-primary",
      bg: "bg-primary/10",
      sub: "Registered in formulary",
    },
    {
      label: "Active Stock",
      value: active,
      icon: Activity,
      color: "text-success",
      bg: "bg-success/10",
      sub: `${Math.round((active / total) * 100) || 0}% of total inventory`,
    },
    {
      label: "Discontinued / Inactive",
      value: inactive,
      icon: Archive,
      color: "text-muted-foreground",
      bg: "bg-muted",
      sub: "Not available for prescribing",
    },
    {
      label: "Manufacturers",
      value: manufacturers,
      icon: Factory,
      color: "text-blue-600",
      bg: "bg-blue-50",
      sub: "distinct suppliers",
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