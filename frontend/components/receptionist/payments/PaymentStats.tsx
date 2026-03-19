"use client";

import { motion } from "framer-motion";
import { IndianRupee, CreditCard, Clock, CheckCircle2, XCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Payment } from "@/types/payment";

export default function PaymentStats({ data }: { data: Payment[] }) {
  const todayStr = new Date().toISOString().split('T')[0];
  
  const todaysPayments = data.filter(p => p.date === todayStr);
  const todaysRevenue = todaysPayments.filter(p => p.status === "Success").reduce((acc, p) => acc + p.amount, 0);
  const pending = data.filter(p => p.status === "Pending").length;
  const success = data.filter(p => p.status === "Success").length;
  const failed = data.filter(p => p.status === "Failed").length;

  const stats = [
    { label: "Today's Revenue", value: `₹${todaysRevenue.toLocaleString('en-IN')}`, icon: IndianRupee, color: "text-emerald-600", bg: "bg-emerald-50", trend: "+12% vs yesterday" },
    { label: "Today's Payments", value: todaysPayments.length, icon: CreditCard, color: "text-primary", bg: "bg-primary/10" },
    { label: "Pending Dues", value: pending, icon: Clock, color: "text-warning-foreground", bg: "bg-warning/10" },
    { label: "Successful", value: success, icon: CheckCircle2, color: "text-success", bg: "bg-success/10" },
    { label: "Failed", value: failed, icon: XCircle, color: "text-destructive", bg: "bg-destructive/10" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
        >
          <Card className="p-4 flex flex-col justify-between h-full border-border shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-3">
              <div className={`p-2 rounded-lg ${stat.bg}`}>
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold text-foreground">{stat.value}</h3>
              <p className="text-[11px] text-muted-foreground uppercase tracking-wide font-semibold mt-1">
                {stat.label}
              </p>
              {stat.trend && <p className="text-[10px] text-success mt-1">{stat.trend}</p>}
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}