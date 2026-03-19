"use client";

import { motion } from "framer-motion";
import { Building2, Activity, Moon, AlertTriangle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Hospital } from "@/types/hospital";

interface HospitalsStatsProps{
  stats?:{
    totalHospitals: number;
    activeHospitals: number;
    inactiveHospitals: number;
    twentyFourSevenHospitals: number;
  }
}

export default function HospitalStats({ stats }: HospitalsStatsProps) {
  const total = stats?.totalHospitals || 0;
  const active = stats?.activeHospitals || 0;
  const inactive = stats?.inactiveHospitals || 0;
  const alwaysOpen = stats?.twentyFourSevenHospitals || 0;

  const statsList = [
    { label: "Total Hospitals", value: total, icon: Building2, color: "text-primary", bg: "bg-primary/10" },
    { label: "Operational", value: active, icon: Activity, color: "text-success", bg: "bg-success/10" },
    { label: "Inactive Units", value: inactive, icon: AlertTriangle, color: "text-destructive", bg: "bg-destructive/10" },
    { label: "24x7 Emergency", value: alwaysOpen, icon: Moon, color: "text-blue-600", bg: "bg-blue-50" },
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