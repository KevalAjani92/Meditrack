"use client";

import { motion } from "framer-motion";
import { Users, CalendarCheck, DollarSign, Clock, UserCheck, AlertCircle, Activity } from "lucide-react";
import { Card } from "@/components/ui/card";
import { KpiData } from "@/types/reports";

interface KpiSummaryCardsProps {
  data: KpiData;
  compareMode: boolean;
}

export default function KpiSummaryCards({ data, compareMode }: KpiSummaryCardsProps) {
  const kpis = [
    { label: "Total Revenue", value: data.revenue.value, delta: data.revenue.delta, icon: DollarSign, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Total Appointments", value: data.appointments.value.toLocaleString(), delta: data.appointments.delta, icon: CalendarCheck, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Total Patients", value: data.patients.value.toLocaleString(), delta: data.patients.delta, icon: Users, color: "text-purple-600", bg: "bg-purple-50" },
    { label: "Active Doctors", value: data.activeDoctors.value, delta: data.activeDoctors.delta, icon: UserCheck, color: "text-primary", bg: "bg-primary/10" },
    { label: "Daily Avg Appts", value: data.avgDailyAppointments.value, delta: data.avgDailyAppointments.delta, icon: Activity, color: "text-indigo-600", bg: "bg-indigo-50" },
    { label: "Avg Wait Time", value: data.avgWaitTime.value, delta: data.avgWaitTime.delta, icon: Clock, color: "text-orange-600", bg: "bg-orange-50", inverse: true }, // Inverse: lower is better
    { label: "No-Show Rate", value: data.noShowRate.value, delta: data.noShowRate.delta, icon: AlertCircle, color: "text-destructive", bg: "bg-destructive/10", inverse: true },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-6">
      {kpis.map((kpi, i) => (
        <motion.div
          key={kpi.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          className="col-span-1"
        >
          <Card className="p-4 flex flex-col justify-between h-full hover:shadow-sm transition-all border-border">
            <div className="flex justify-between items-start mb-2">
              <div className={`p-2 rounded-lg ${kpi.bg}`}>
                <kpi.icon className={`w-4 h-4 ${kpi.color}`} />
              </div>
              {compareMode && (
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                  (kpi.inverse ? kpi.delta < 0 : kpi.delta > 0) 
                    ? "bg-success/10 text-success" 
                    : "bg-destructive/10 text-destructive"
                }`}>
                  {kpi.delta > 0 ? "+" : ""}{kpi.delta}%
                </span>
              )}
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground">{kpi.value}</h3>
              <p className="text-[11px] text-muted-foreground uppercase tracking-wide font-medium mt-1 truncate">
                {kpi.label}
              </p>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}