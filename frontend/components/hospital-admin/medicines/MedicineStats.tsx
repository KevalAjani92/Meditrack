"use client";

import { motion } from "framer-motion";
import { LayoutGrid, Pill, CheckCircle2, AlertTriangle } from "lucide-react";
import { Card } from "@/components/ui/card";

interface Props {
  totalMaster: number;
  totalEnabled: number;
  activeCount: number;
  lowStockCount: number;
}

export default function MedicineStats({ totalMaster, totalEnabled, activeCount, lowStockCount }: Props) {
  const stats = [
    { label: "Master Catalog", value: totalMaster, icon: LayoutGrid, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Enabled Pharmacy", value: totalEnabled, icon: Pill, color: "text-primary", bg: "bg-primary/10" },
    { label: "Active Medicines", value: activeCount, icon: CheckCircle2, color: "text-success", bg: "bg-success/10" },
    { label: "Low Stock Items", value: lowStockCount, icon: AlertTriangle, color: "text-destructive", bg: "bg-destructive/10" },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, i) => (
        <motion.div key={stat.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
          <Card className="p-5 flex items-center justify-between border-border shadow-sm hover:shadow-md transition-shadow">
            <div>
              <h3 className="text-2xl font-bold text-foreground">{stat.value}</h3>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mt-1">{stat.label}</p>
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