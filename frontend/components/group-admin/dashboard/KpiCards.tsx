"use client";

import { motion } from "framer-motion";
import { Building2, Activity, DollarSign, CalendarCheck, ArrowUpRight, ArrowDownRight } from "lucide-react";

const stats = [
  {
    label: "Total Revenue (Today)",
    value: "$42,500",
    delta: "+12.5%",
    trend: "up",
    icon: DollarSign,
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    label: "Appointments Today",
    value: "1,240",
    delta: "+5.2%",
    trend: "up",
    icon: CalendarCheck,
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    label: "Active Hospitals",
    value: "24/26",
    delta: "-1 Offline",
    trend: "down",
    icon: Building2,
    color: "text-orange-600",
    bg: "bg-orange-50",
  },
  {
    label: "Total Patients Active",
    value: "8,530",
    delta: "+3.1%",
    trend: "up",
    icon: Activity,
    color: "text-purple-600",
    bg: "bg-purple-50",
  },
];

export default function KpiCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          whileHover={{ y: -2 }}
          className="bg-card border border-border p-5 rounded-xl shadow-sm flex flex-col justify-between"
        >
          <div className="flex justify-between items-start mb-4">
            <div className={`p-3 rounded-xl ${stat.bg}`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <div className={`flex items-center text-xs font-medium px-2 py-1 rounded-full ${
              stat.trend === "up" ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
            }`}>
              {stat.trend === "up" ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
              {stat.delta}
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-foreground">{stat.value}</h3>
            <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}