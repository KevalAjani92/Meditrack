"use client";

import { useFormContext } from "react-hook-form";
import { PatientRegistrationData } from "@/types/patient-registration";
import { User, Stethoscope, PhoneCall, MapPin } from "lucide-react";

export default function RegistrationSummaryStep() {
  const { getValues } = useFormContext<PatientRegistrationData>();
  const data = getValues();

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-foreground">Review & Confirm</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Basic Info */}
        <div className="p-4 rounded-xl border border-border bg-card shadow-sm space-y-3">
          <h3 className="text-sm font-semibold flex items-center gap-2 text-primary border-b border-border pb-2">
            <User className="w-4 h-4" /> Personal Information
          </h3>
          <div className="grid grid-cols-2 gap-y-2 text-sm">
            <span className="text-muted-foreground">Full Name</span><span className="font-medium text-foreground">{data.fullName}</span>
            <span className="text-muted-foreground">Gender</span><span className="font-medium text-foreground">{data.gender}</span>
            <span className="text-muted-foreground">DOB</span><span className="font-medium text-foreground">{data.dob}</span>
            <span className="text-muted-foreground">Phone</span><span className="font-mono text-foreground">{data.phone}</span>
          </div>
        </div>

        {/* Address */}
        <div className="p-4 rounded-xl border border-border bg-card shadow-sm space-y-3">
          <h3 className="text-sm font-semibold flex items-center gap-2 text-primary border-b border-border pb-2">
            <MapPin className="w-4 h-4" /> Location Details
          </h3>
          <div className="grid grid-cols-2 gap-y-2 text-sm">
            <span className="text-muted-foreground">Address</span><span className="font-medium text-foreground truncate">{data.address}</span>
            <span className="text-muted-foreground">City</span><span className="font-medium text-foreground">{data.city}</span>
            <span className="text-muted-foreground">State</span><span className="font-medium text-foreground">{data.state}</span>
            <span className="text-muted-foreground">Pincode</span><span className="font-medium text-foreground">{data.pincode}</span>
          </div>
        </div>

        {/* Medical Details */}
        <div className="p-4 rounded-xl border border-border bg-card shadow-sm space-y-3">
          <h3 className="text-sm font-semibold flex items-center gap-2 text-primary border-b border-border pb-2">
            <Stethoscope className="w-4 h-4" /> Medical Overview
          </h3>
          <div className="grid grid-cols-2 gap-y-2 text-sm">
            <span className="text-muted-foreground">Blood Group</span><span className="font-bold text-destructive">{data.bloodGroup}</span>
            <span className="text-muted-foreground">Allergies</span><span className="font-medium text-foreground truncate">{data.allergies || "None"}</span>
            <span className="text-muted-foreground">Conditions</span><span className="font-medium text-foreground truncate">{data.chronicConditions || "None"}</span>
          </div>
        </div>

        {/* Emergency Contacts */}
        <div className="p-4 rounded-xl border border-border bg-card shadow-sm space-y-3">
          <h3 className="text-sm font-semibold flex items-center gap-2 text-primary border-b border-border pb-2">
            <PhoneCall className="w-4 h-4" /> Emergency Contacts
          </h3>
          {data.emergencyContacts.map((c, i) => (
            <div key={i} className="flex justify-between items-center text-sm border-b border-border/50 pb-1 last:border-0">
              <div>
                <span className="font-medium text-foreground">{c.name}</span>
                <span className="text-xs text-muted-foreground ml-2">({c.relation})</span>
              </div>
              <span className="font-mono text-foreground">{c.phone}</span>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}