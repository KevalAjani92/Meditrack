"use client";

import WalkInVisitSection from "./WalkInVisitSection";
import { AlertTriangle } from "lucide-react";
import { Patient, Doctor } from "@/types/opd";

interface Props {
  hospitalId:number;
  onSelect: (patient: Patient | null, doctor: Doctor | null) => void;
}

export default function EmergencyVisitSection({ onSelect,hospitalId }: Props) {
  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="p-3 bg-destructive/5 border border-destructive/30 rounded-lg flex items-start gap-3">
        <div className="p-1.5 bg-destructive text-destructive-foreground rounded-full animate-pulse">
          <AlertTriangle className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-bold text-destructive">EMERGENCY PROTOCOL ACTIVE</h3>
          <p className="text-xs text-destructive/80">Queue will be bypassed. Proceed with immediate assignment.</p>
        </div>
      </div>
      
      {/* Reuse the walk-in logic but wrapped in emergency context */}
      <div className="p-4 border-2 border-destructive/20 rounded-xl bg-destructive/5">
         <WalkInVisitSection  hospitalId={hospitalId} onSelect={onSelect} />
      </div>
    </div>
  );
}