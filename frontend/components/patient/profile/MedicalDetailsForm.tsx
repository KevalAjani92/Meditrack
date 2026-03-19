"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { PatientProfile } from "@/types/patient";
import { patientService } from "@/services/patient.service";
import { Stethoscope, Loader2, Edit2, X } from "lucide-react";

const medicalSchema = z.object({
  bloodGroup: z.string().min(1, "Blood group is required"),
  allergies: z.string().optional(),
  chronicConditions: z.string().optional(),
  currentMedications: z.string().optional(),
});

type MedicalFormValues = z.infer<typeof medicalSchema>;

const bloodGroupMap: Record<string, number> = {
  "A+": 1, "A-": 2, "B+": 3, "B-": 4, "AB+": 5, "AB-": 6, "O+": 7, "O-": 8,
};

export default function MedicalDetailsForm({ patient, onSaved }: { patient: PatientProfile; onSaved: () => void }) {
  const [isEditing, setIsEditing] = useState(false);

  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm<MedicalFormValues>({
    resolver: zodResolver(medicalSchema),
    defaultValues: {
      bloodGroup: patient.bloodGroup,
      allergies: patient.allergies,
      chronicConditions: patient.chronicConditions,
      currentMedications: patient.currentMedications,
    },
  });

  const onSubmit = async (data: MedicalFormValues) => {
    try {
      await patientService.updateMedical({
        blood_group_id: bloodGroupMap[data.bloodGroup] ?? patient.blood_group_id ?? undefined,
        allergies: data.allergies || "",
        chronic_conditions: data.chronicConditions || "",
        current_medications: data.currentMedications || "",
      });
      setIsEditing(false);
      onSaved();
    } catch (err) {
      console.error("Failed to update medical details:", err);
    }
  };

  const handleCancel = () => {
    reset();
    setIsEditing(false);
  };

  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  const inputStyles = "w-full px-3 py-2 border border-input rounded-md bg-background text-foreground text-sm focus:ring-2 focus:ring-ring focus:outline-none transition-colors disabled:bg-muted/30 disabled:text-muted-foreground disabled:opacity-100 disabled:cursor-default";

  return (
    <div className="bg-card border border-border rounded-xl p-6 shadow-sm transition-all">
      <div className="flex items-center justify-between border-b border-border pb-3 mb-5">
        <div className="flex items-center gap-2">
          <Stethoscope className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">Medical Overview</h2>
        </div>
        {!isEditing && (
          <button type="button" onClick={() => setIsEditing(true)} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-primary bg-primary/10 hover:bg-primary/20 rounded-md transition-colors">
            <Edit2 className="w-3.5 h-3.5" /> Edit Details
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <div className="space-y-1.5 md:col-span-2 max-w-xs">
            <label className="text-sm font-medium text-foreground">Blood Group</label>
            <select disabled={!isEditing} {...register("bloodGroup")} className={`${inputStyles} font-semibold text-destructive disabled:text-destructive/70`}>
              <option value="">Select Group</option>
              {bloodGroups.map(bg => <option key={bg} value={bg}>{bg}</option>)}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Known Allergies</label>
            <textarea disabled={!isEditing} {...register("allergies")} placeholder="None" className={`${inputStyles} resize-none h-20`} />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Chronic Conditions</label>
            <textarea disabled={!isEditing} {...register("chronicConditions")} placeholder="None" className={`${inputStyles} resize-none h-20`} />
          </div>

          <div className="md:col-span-2 space-y-1.5">
            <label className="text-sm font-medium text-foreground">Current Medications</label>
            <textarea disabled={!isEditing} {...register("currentMedications")} placeholder="None" className={`${inputStyles} resize-none h-16`} />
          </div>

        </div>

        {isEditing && (
          <div className="flex justify-end gap-3 pt-4 border-t border-border mt-4 animate-in fade-in duration-200">
            <button type="button" onClick={handleCancel} className="px-4 py-2 border border-input text-foreground text-sm font-medium rounded-md hover:bg-muted transition-colors flex items-center gap-1.5">
              <X className="w-4 h-4" /> Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-md hover:bg-primary/90 transition-colors flex items-center gap-2 disabled:opacity-70">
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
              Save Medical Details
            </button>
          </div>
        )}
      </form>
    </div>
  );
}