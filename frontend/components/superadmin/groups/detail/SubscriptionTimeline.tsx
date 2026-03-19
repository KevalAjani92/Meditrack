"use client";

import { motion } from "framer-motion";
import { CreditCard, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { GroupDetail } from "@/types/groups";

export default function SubscriptionTimeline({ subscription }: { subscription: GroupDetail["subscription"] }) {
  // Logic to calculate progress
  const start = new Date(subscription.startDate).getTime();
  const end = new Date(subscription.endDate).getTime();
  const now = new Date().getTime();
  
  // Calculate percentage (clamped between 0 and 100)
  const percentage = Math.min(Math.max(((now - start) / (end - start)) * 100, 0), 100);

  // Determine Color State
  const isExpired = now > end;
  const isExpiringSoon = !isExpired && percentage > 85;

  const barColor = isExpired 
    ? "bg-destructive" 
    : isExpiringSoon 
      ? "bg-warning" 
      : "bg-success";

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ delay: 0.2 }}
    >
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-accent rounded-lg text-accent-foreground">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">
                {subscription.plan} Plan
              </h3>
              <p className="text-xs text-muted-foreground">
                Billed Annually
              </p>
            </div>
          </div>
          
          <div className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center gap-1.5 w-fit ${
            isExpired ? "bg-destructive/10 text-destructive border-destructive/20" :
            isExpiringSoon ? "bg-warning/10 text-warning border-warning/20" :
            "bg-success/10 text-success border-success/20"
          }`}>
            {isExpired ? <AlertTriangle className="w-3 h-3" /> : <CheckCircle2 className="w-3 h-3" />}
            {subscription.status}
          </div>
        </div>

        {/* Timeline Visual */}
        <div className="relative pt-2 pb-6 px-1">
          {/* Background Track */}
          <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
            <motion.div 
              className={`h-full rounded-full ${barColor}`}
              initial={{ width: 0 }}
              animate={{ width: `${percentage}%` }}
              transition={{ duration: 1, delay: 0.3 }}
            />
          </div>

          {/* Markers */}
          <div className="flex justify-between mt-3 text-xs text-muted-foreground font-medium">
            <div className="flex flex-col items-start gap-1">
              <span>Start Date</span>
              <span className="text-foreground">{subscription.startDate}</span>
            </div>
             <div className="flex flex-col items-end gap-1">
              <span>Renewal Date</span>
              <span className="text-foreground">{subscription.endDate}</span>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}