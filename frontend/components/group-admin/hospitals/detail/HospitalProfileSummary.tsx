"use client";

import { motion } from "framer-motion";
import { Building2, MapPin, Phone, Mail, Calendar, ShieldCheck, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { HospitalDetails } from "@/types/hospital-monitor";

export default function HospitalProfileSummary({ data }: { data: HospitalDetails }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-border rounded-xl p-6 shadow-sm flex flex-col md:flex-row gap-6 justify-between items-start"
    >
      {/* Left: Identity */}
      <div className="flex gap-5">
        <div className="hidden sm:flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20 text-primary shadow-sm">
          <Building2 className="w-10 h-10" />
        </div>
        
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-bold text-foreground">{data.name}</h1>
            <span className="font-mono text-xs font-semibold px-2 py-0.5 bg-secondary text-secondary-foreground rounded border border-border">
              {data.reg_id}
            </span>
            <Badge variant={data.status === "Active" ? "default" : "secondary"}>
              {data.status}
            </Badge>
          </div>

          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="w-3.5 h-3.5" /> {data.address}
          </div>

          <div className="flex gap-4 pt-1">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Phone className="w-3.5 h-3.5" /> {data.contact_phone}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Mail className="w-3.5 h-3.5" /> {data.contact_email}
            </div>
          </div>
        </div>
      </div>

      {/* Right: Meta & Subscription */}
      <div className="flex flex-col gap-3 min-w-[240px] border-t md:border-t-0 md:border-l border-border pt-4 md:pt-0 md:pl-6">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Admin:</span>
          <span className="font-medium text-foreground flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-primary" /> {data.admin_name}
          </span>
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Onboarded:</span>
          <span className="font-medium text-foreground flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" /> {data.created_at}
          </span>
        </div>

        <div className={`mt-2 p-2.5 rounded-lg border flex items-center gap-2 text-xs font-medium ${
          data.subscription_status === 'Active' 
            ? 'bg-success/10 text-success border-success/20' 
            : 'bg-warning/10 text-warning-foreground border-warning/20'
        }`}>
          {data.subscription_status === 'Expiring Soon' && <AlertTriangle className="w-4 h-4" />}
          License: {data.subscription_status}
        </div>
      </div>
    </motion.div>
  );
}