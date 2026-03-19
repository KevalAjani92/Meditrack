"use client";

import { motion } from "framer-motion";
import { Activity, Clock, FileText, Layers } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TreatmentDetail } from "@/types/procedure";

export default function TreatmentProfileCard({ treatment }: { treatment?: TreatmentDetail }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }} 
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="p-6 border-l-4 border-l-primary shadow-sm bg-card relative overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
          <Activity className="w-32 h-32" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row gap-6 justify-between items-start">
          <div className="space-y-4 flex-1">
            
            {/* Header */}
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <span className="font-mono text-sm font-bold px-2 py-0.5 bg-primary/10 text-primary rounded border border-primary/20">
                  {treatment?.treatment_code}
                </span>
                <Badge variant="outline" className="text-muted-foreground">
                  {treatment?.department_name}
                </Badge>
                <Badge 
                  variant={treatment?.is_active ? "default" : "secondary"}
                  className={treatment?.is_active ? "bg-success/15 text-success hover:bg-success/25" : ""}
                >
                  {treatment?.is_active ? "Active Treatment" : "Inactive"}
                </Badge>
              </div>
              <h1 className="text-2xl font-bold text-foreground">{treatment?.treatment_name}</h1>
            </div>

            {/* Description */}
            <div className="flex gap-3 text-muted-foreground">
              <FileText className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <p className="text-sm leading-relaxed max-w-3xl">
                {treatment?.description}
              </p>
            </div>
          </div>

          {/* Metadata Block */}
          <div className="flex flex-col gap-3 min-w-[200px] text-sm text-muted-foreground border-t md:border-t-0 md:border-l border-border pt-4 md:pt-0 md:pl-6">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4" />
              <span>Type Code: {treatment?.treatment_code}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>Updated: {treatment?.updated_at ? new Date(treatment.updated_at).toLocaleDateString("en-IN") : "Never"}</span>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}