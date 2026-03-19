"use client";

import * as HoverCard from "@radix-ui/react-hover-card";
import { Info, Activity, Droplet, AlertTriangle, Calendar } from "lucide-react";
import { PatientMedicalInfo } from "@/types/opd-queue";

interface Props {
  patientName: string;
  medicalInfo: PatientMedicalInfo;
}

export default function PatientQuickInfoHover({ patientName, medicalInfo }: Props) {
  return (
    <HoverCard.Root openDelay={200} closeDelay={100}>
      <HoverCard.Trigger asChild>
        <span className="font-bold text-foreground cursor-help underline decoration-dashed decoration-primary/50 hover:text-primary transition-colors inline-flex items-center gap-1.5">
          {patientName} <Info className="w-3.5 h-3.5 text-muted-foreground" />
        </span>
      </HoverCard.Trigger>
      <HoverCard.Portal>
        <HoverCard.Content 
          className="z-50 w-72 p-4 bg-popover text-popover-foreground border border-border rounded-xl shadow-xl animate-in fade-in zoom-in-95"
          sideOffset={5}
        >
          <div className="flex flex-col gap-3">
            <div className="border-b border-border pb-2">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Quick Medical Profile</p>
              <p className="font-semibold text-base mt-0.5">{patientName}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-sm">
              <div className="flex flex-col gap-1">
                <span className="text-xs text-muted-foreground flex items-center gap-1"><Droplet className="w-3 h-3 text-destructive" /> Blood Group</span>
                <span className="font-bold text-destructive">{medicalInfo.bloodGroup}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs text-muted-foreground flex items-center gap-1"><Calendar className="w-3 h-3 text-primary" /> Last Visit</span>
                <span className="font-medium">{medicalInfo.lastVisit}</span>
              </div>
              <div className="col-span-2 flex flex-col gap-1 bg-warning/10 p-2 rounded border border-warning/20">
                <span className="text-xs text-warning-foreground flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> Allergies</span>
                <span className="font-medium text-warning-foreground">{medicalInfo.allergies}</span>
              </div>
              <div className="col-span-2 flex flex-col gap-1 bg-muted/30 p-2 rounded border border-border">
                <span className="text-xs text-muted-foreground flex items-center gap-1"><Activity className="w-3 h-3 text-blue-500" /> Conditions</span>
                <span className="font-medium">{medicalInfo.chronicConditions}</span>
              </div>
            </div>
          </div>
          <HoverCard.Arrow className="fill-popover" />
        </HoverCard.Content>
      </HoverCard.Portal>
    </HoverCard.Root>
  );
}