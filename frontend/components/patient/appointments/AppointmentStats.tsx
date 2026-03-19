"use client";

import { motion } from "framer-motion";
import { CalendarClock, CheckCircle2, XCircle, Activity } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Appointment } from "@/types/appointment";

export default function AppointmentStats({ data }: { data: Appointment[] }) {
  const upcoming = data.filter(a => a.status === "Scheduled" || a.status === "Rescheduled").length;
  const completed = data.filter(a => a.status === "Completed").length;
  const cancelled = data.filter(a => a.status === "Cancelled").length;
  const totalThisMonth = data.length; // Mock simplified

  const stats = [
    { label: "Upcoming Appts", value: upcoming, icon: CalendarClock, color: "text-primary", bg: "bg-primary/10", trend: "+1 this week" },
    { label: "Completed", value: completed, icon: CheckCircle2, color: "text-success", bg: "bg-success/10" },
    { label: "Cancelled", value: cancelled, icon: XCircle, color: "text-destructive", bg: "bg-destructive/10" },
    { label: "Total (This Month)", value: totalThisMonth, icon: Activity, color: "text-blue-600", bg: "bg-blue-50" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
        >
          <Card className="p-5 flex items-center justify-between border-border shadow-sm hover:shadow-md transition-all">
            <div>
              <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
              <h3 className="text-2xl font-bold text-foreground mt-1">{stat.value}</h3>
              {stat.trend && <p className="text-[10px] text-success font-medium mt-1">{stat.trend}</p>}
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