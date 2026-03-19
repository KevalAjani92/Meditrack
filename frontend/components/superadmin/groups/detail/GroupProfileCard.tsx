"use client";

import { motion } from "framer-motion";
import { Building2, Calendar, Users, Activity } from "lucide-react";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/common/StatusBadge"; // Reuse from previous step
import { GroupDetail } from "@/types/groups";

export default function GroupProfileCard({ group }: { group: GroupDetail }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="h-full p-6 flex flex-col justify-between">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex gap-4">
            <div className="p-3 bg-primary/10 rounded-xl text-primary h-fit">
              <Building2 className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">{group.name}</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm text-muted-foreground">ID: {group.id}</span>
                <StatusBadge status={group.status} />
              </div>
            </div>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-4 pt-6 border-t border-border">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Activity className="w-3.5 h-3.5" /> Total Hospitals
            </div>
            <p className="text-2xl font-semibold text-foreground">{group.totalHospitals}</p>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Users className="w-3.5 h-3.5" /> Total Users
            </div>
            <p className="text-2xl font-semibold text-foreground">{group.totalUsers}</p>
          </div>

          <div className="col-span-2 mt-2 space-y-1">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Calendar className="w-3.5 h-3.5" /> Client Since
            </div>
            <p className="text-sm font-medium text-foreground">{group.createdAt}</p>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}