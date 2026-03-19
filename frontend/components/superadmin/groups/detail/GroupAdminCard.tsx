"use client";

import { motion } from "framer-motion";
import { Mail, ShieldCheck, Copy, UserX, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GroupDetail } from "@/types/groups";

export default function GroupAdminCard({ admin }: { admin: GroupDetail["admin"] }) {
  const copyToClipboard = () => {
    if (admin?.email) navigator.clipboard.writeText(admin.email);
    // Optional: Add toast notification trigger here
  };

  if (!admin) {
    return (
      <Card className="h-full p-6 flex flex-col items-center justify-center text-center text-muted-foreground border-dashed">
        <div className="p-4 bg-muted rounded-full mb-3">
          <UserX className="w-8 h-8 opacity-50" />
        </div>
        <h3 className="font-medium text-foreground">No Admin Assigned</h3>
        <p className="text-sm mt-1">Assign a group admin to manage this account.</p>
        <button className="mt-4 text-sm text-primary font-medium hover:underline">
          Assign Admin
        </button>
      </Card>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      <Card className="h-full p-6 flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-semibold text-foreground flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-primary" />
            Primary Admin
          </h3>
          <Badge variant="neutral" className="bg-blue-50 text-blue-700 border-blue-200">
            {admin.role}
          </Badge>
        </div>

        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center text-xl font-bold text-secondary-foreground border border-border">
            {admin.avatarInitials}
          </div>
          <div>
            <p className="font-bold text-lg text-foreground">{admin.name}</p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-0.5 group cursor-pointer" onClick={copyToClipboard}>
              <Mail className="w-3.5 h-3.5" />
              <span className="group-hover:text-primary transition-colors">{admin.email}</span>
              <Copy className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
        </div>

        <div className="mt-auto pt-4 border-t border-border flex items-center gap-2 text-xs text-muted-foreground">
          <Clock className="w-3.5 h-3.5" />
          Last active: <span className="text-foreground font-medium">{admin.lastActive}</span>
        </div>
      </Card>
    </motion.div>
  );
}