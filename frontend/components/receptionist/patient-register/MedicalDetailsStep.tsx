"use client";

import { useFormContext } from "react-hook-form";
import { PatientRegistrationData } from "@/types/patient-registration";

export default function MedicalDetailsStep() {
  const { register, formState: { errors } } = useFormContext<PatientRegistrationData>();

  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
  const inputClass = "w-full px-3 py-2 border border-input rounded-md bg-background text-sm focus:ring-2 focus:ring-ring outline-none transition-shadow";

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-foreground">Medical Details</h2>
      <p className="text-sm text-muted-foreground -mt-4 mb-4">Provide basic health indicators for initial screening.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <div className="space-y-1.5 md:col-span-2 max-w-xs">
          <label className="text-sm font-medium text-foreground">Blood Group <span className="text-destructive">*</span></label>
          <select {...register("bloodGroup")} className={`${inputClass} font-semibold text-destructive`}>
            <option value="">Select Group</option>
            {bloodGroups.map(bg => <option key={bg} value={bg}>{bg}</option>)}
          </select>
          {errors.bloodGroup && <p className="text-xs text-destructive">{errors.bloodGroup.message}</p>}
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">Known Allergies</label>
          <textarea {...register("allergies")} placeholder="Enter any allergies (e.g., Peanuts, Penicillin)" className={`${inputClass} resize-none h-24`} />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">Chronic Conditions</label>
          <textarea {...register("chronicConditions")} placeholder="E.g., Diabetes, Hypertension" className={`${inputClass} resize-none h-24`} />
        </div>

        <div className="space-y-1.5 md:col-span-2">
          <label className="text-sm font-medium text-foreground">Current Medications</label>
          <textarea {...register("currentMedications")} placeholder="List any medications currently being taken..." className={`${inputClass} resize-none h-20`} />
        </div>

      </div>
    </div>
  );
}