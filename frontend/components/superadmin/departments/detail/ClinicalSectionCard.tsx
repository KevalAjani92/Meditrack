"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, AlertCircle, CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ClinicalPreviewTable, { ClinicalItem } from "./ClinicalPreviewTable";

interface ClinicalSectionCardProps {
  title: string;
  icon: React.ElementType;
  totalCount: number;
  activeCount: number;
  previewData: ClinicalItem[];
  viewAllUrl: string;
  delay?: number;
}

export default function ClinicalSectionCard({
  title,
  icon: Icon,
  totalCount,
  activeCount,
  previewData,
  viewAllUrl,
  delay = 0,
}: ClinicalSectionCardProps) {
  
  const hasInactive = activeCount < totalCount;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="h-full"
    >
      <Card className="flex flex-col h-full p-5 hover:shadow-md transition-shadow duration-200">
        
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-primary/10 rounded-lg text-primary">
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">{title}</h3>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="font-medium text-foreground">{totalCount}</span> Total
                <span className="text-border">•</span>
                <span className={hasInactive ? "text-warning-foreground" : "text-success"}>
                  {activeCount} Active
                </span>
              </div>
            </div>
          </div>
          
          {/* Health Indicator */}
          {hasInactive && (
            <div className="flex items-center gap-1.5 px-2 py-1 bg-warning/10 text-warning text-[10px] font-medium rounded-full border border-warning/20">
              <AlertCircle className="w-3 h-3" />
              <span>Has Inactive</span>
            </div>
          )}
        </div>

        {/* Content Body */}
        <div className="flex-1 mb-6">
          <ClinicalPreviewTable 
            data={previewData} 
            emptyMessage={`No ${title.toLowerCase()} configured yet.`} 
          />
        </div>

        {/* Footer Action */}
        <div className="mt-auto">
  <Button 
    variant="secondary" 
    className="min-w-auto justify-between group bg-primary/5 hover:bg-primary/10 text-primary border-0 hover:shadow-sm transition-all" 
    asChild
  >
    <Link className="flex justify-center items-center gap-1" href={viewModeUrl(viewAllUrl)}>
      <span className="font-semibold text-primary/80 group-hover:text-primary">
        Manage {title}
      </span>
      <ArrowRight className="w-4 h-4 text-primary/70 group-hover:text-primary group-hover:translate-x-1 transition-transform" />
    </Link>
  </Button>
</div>
      </Card>
    </motion.div>
  );
}

// Helper to handle simple strings or objects
function viewModeUrl(url: string) {
  return url;
}