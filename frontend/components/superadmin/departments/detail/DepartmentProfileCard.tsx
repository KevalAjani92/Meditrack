"use client";

import { motion } from "framer-motion";
import { Building2, Calendar, Edit, Hash } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface DepartmentProfileProps {
  department: {
    name: string;
    code: string;
    description: string;
    created_at: string;
  };
  onEdit: () => void;
}

export default function DepartmentProfileCard({ department, onEdit }: DepartmentProfileProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="p-6 md:p-8 bg-gradient-to-r from-card to-muted/20 border-border">
        <div className="flex flex-col md:flex-row justify-between items-start gap-6">
          
          {/* Left: Identity */}
          <div className="flex gap-5">
            <div className="hidden sm:flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20 text-primary shadow-sm">
              <Building2 className="w-8 h-8" />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold tracking-tight text-foreground">
                  {department.name}
                </h1>
                <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-secondary text-secondary-foreground text-xs font-mono font-bold border border-border">
                  <Hash className="w-3 h-3 opacity-50" />
                  {department.code}
                </span>
              </div>
              
              <p className="text-muted-foreground max-w-2xl leading-relaxed">
                {department.description}
              </p>

              <div className="flex items-center gap-2 text-xs text-muted-foreground pt-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>Created on {new Date(department.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex-shrink-0 w-full md:w-auto">
            <Button onClick={onEdit} className="w-full gap-2 shadow-sm">
              <Edit className="w-4 h-4" /> Edit Details
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}