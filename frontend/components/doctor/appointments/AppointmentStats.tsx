"use client";

import { motion } from "framer-motion";
import { Users, UserCheck, CheckCircle2, XCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Appointment } from "@/types/doctor-schedule";

export default function AppointmentStats({ data }: { data: any }) {
  const total = data?.total;
  const checkedIn = data?.checkedIn;
  const completed = data?.completed;
  const cancelledNoShow = data?.cancelledNoShow;

  const stats = [
    { label: "Today's Appointments", value: total, icon: Users, color: "text-primary", bg: "bg-primary/10" },
    { label: "Checked-In / Waiting", value: checkedIn, icon: UserCheck, color: "text-accent-foreground", bg: "bg-accent/20" },
    { label: "Completed", value: completed, icon: CheckCircle2, color: "text-success", bg: "bg-success/10" },
    { label: "Cancelled / No-Show", value: cancelledNoShow, icon: XCircle, color: "text-destructive", bg: "bg-destructive/10" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
        >
          <Card className="p-4 flex items-center justify-between border-border shadow-sm hover:shadow-md transition-all">
            <div>
              <h3 className="text-2xl font-bold text-foreground">{stat.value}</h3>
              <p className="text-xs font-medium text-muted-foreground mt-1">{stat.label}</p>
            </div>
            <div className={`p-2.5 rounded-xl ${stat.bg}`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}