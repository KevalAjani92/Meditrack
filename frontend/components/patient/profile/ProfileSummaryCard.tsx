"use client";

import { CheckCircle2, ShieldCheck } from "lucide-react";
import { PatientProfile } from "@/types/patient";
import ProfilePhotoUpload from "./ProfilePhotoUpload";

export default function ProfileSummaryCard({ patient }: { patient: PatientProfile }) {
  return (
    <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
        
        <ProfilePhotoUpload 
          initialAvatarUrl={patient.avatarUrl} 
          name={patient.name}
          onUpload={(f) => console.log("Uploaded:", f.name)}
          onRemove={() => console.log("Removed avatar")}
        />

        <div className="flex-1 space-y-3 w-full">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-foreground">{patient.name}</h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-success/10 text-success border border-success/20">
                  {patient.status}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-primary" /> Patient ID: <span className="font-mono text-foreground font-medium">{patient.id}</span>
              </p>
            </div>

            {/* Profile Completion Indicator */}
            <div className="w-full sm:w-48 space-y-1.5 p-3 rounded-lg bg-muted/30 border border-border">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-muted-foreground">Profile Completion</span>
                <span className={patient.profileCompletion === 100 ? "text-success" : "text-primary"}>
                  {patient.profileCompletion}%
                </span>
              </div>
              <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-500 ${patient.profileCompletion === 100 ? "bg-success" : "bg-primary"}`}
                  style={{ width: `${patient.profileCompletion}%` }}
                />
              </div>
              {patient.profileCompletion < 100 && (
                <p className="text-[10px] text-muted-foreground">Complete medical details to reach 100%.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}