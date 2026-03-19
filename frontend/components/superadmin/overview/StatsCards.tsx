"use client";

import { Building2, Network, Users } from "lucide-react";
import { motion } from "framer-motion";
import { KPICard } from "@/components/common/KPICard";

const stats = [
  {
    label: "Total Hospital Groups",
    value: "12",
    icon: Network,
    trend: "+2 this month",
  },
  {
    label: "Total Hospitals",
    value: "48",
    icon: Building2,
    trend: "+5 this month",
  },
  {
    label: "Total Active Users",
    value: "3,240",
    icon: Users,
    trend: "+12% vs last month",
  },
];

export default function StatsCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stats.map((stat, index) => (
        <KPICard key={index} label={stat.label} value={stat.value} icon={stat.icon} trend={stat.trend} />
      ))}
    </div>
  );
}