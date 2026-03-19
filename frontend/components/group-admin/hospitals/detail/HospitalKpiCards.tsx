"use client";

import { motion } from "framer-motion";
import { Users, Stethoscope, UserCircle, CalendarCheck, DollarSign, Activity } from "lucide-react";
import { Card } from "@/components/ui/card";
import { HospitalDetails } from "@/types/hospital-monitor";

export default function HospitalKpiCards({ stats }: { stats: HospitalDetails['stats'] }) {
  const kpis = [
    { label: "Total Doctors", value: stats.doctors, icon: Stethoscope, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Staff Members", value: stats.staff, icon: UserCircle, color: "text-purple-600", bg: "bg-purple-50" },
    { label: "Total Patients", value: stats.patients.toLocaleString(), icon: Users, color: "text-primary", bg: "bg-primary/10" },
    { label: "Appts Today", value: stats.appointments_today, icon: CalendarCheck, color: "text-orange-600", bg: "bg-orange-50" },
    { label: "Revenue (Mo)", value: stats.revenue_month, icon: DollarSign, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Active Depts", value: stats.active_departments, icon: Activity, color: "text-indigo-600", bg: "bg-indigo-50" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {kpis.map((kpi, i) => (
        <motion.div
          key={kpi.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
        >
          <Card className="p-4 flex flex-col items-center text-center justify-center h-full hover:shadow-sm transition-shadow border-border">
            <div className={`p-2.5 rounded-full mb-3 ${kpi.bg}`}>
              <kpi.icon className={`w-5 h-5 ${kpi.color}`} />
            </div>
            <h3 className="text-xl font-bold text-foreground">{kpi.value}</h3>
            <p className="text-xs text-muted-foreground font-medium mt-1">{kpi.label}</p>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}