"use client"

import { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

interface KPICardProps {
  label: string;
  value: React.ReactNode;
  icon: LucideIcon;
  trend?: string;
}

export function KPICard({ label, value, icon: Icon, trend }: KPICardProps) {
  return (
    <motion.div
      key={label}
      whileHover={{ y: -2 }}
      className="bg-card text-card-foreground border border-border p-6 rounded-xl shadow-sm flex flex-col justify-between"
    >
      {/* <Card> */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-muted-foreground">
            {label}
          </span>
          <div className="p-2 bg-primary/10 rounded-lg">
            <Icon className="w-5 h-5 text-primary" />
          </div>
        </div>
          <div>
            <div className="text-3xl font-bold tracking-tight text-foreground">
              {value}
            </div>
            <p className="text-xs text-muted-foreground mt-1">{trend}</p>
          </div>
      {/* </Card> */}
    </motion.div>
  );
}
