"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { PatientProfile } from "@/types/patient";
import { patientService } from "@/services/patient.service";
import { User, Loader2, Info, Edit2, X } from "lucide-react";

const personalSchema = z.object({
  name: z.string().min(2, "Name is required"),
  gender: z.enum(["Male", "Female", "Other", ""]),
  dob: z.string().min(1, "Date of birth is required"),
});

type PersonalFormValues = z.infer<typeof personalSchema>;

export default function PersonalInfoForm({ patient, onSaved }: { patient: PatientProfile; onSaved: () => void }) {
  const [isEditing, setIsEditing] = useState(false);

  const { register, handleSubmit, watch, reset, formState: { errors, isSubmitting } } = useForm<PersonalFormValues>({
    resolver: zodResolver(personalSchema),
    defaultValues: {
      name: patient.name,
      gender: patient.gender,
      dob: patient.dob ? new Date(patient.dob).toISOString().split("T")[0] : "",
    },
  });

  const dobValue = watch("dob");

  const isMinor = () => {
    if (!dobValue) return false;
    const ageDifMs = Date.now() - new Date(dobValue).getTime();
    const ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970) < 18;
  };

  const onSubmit = async (data: PersonalFormValues) => {
    try {
      await patientService.updatePersonal({
        full_name: data.name,
        gender: data.gender || undefined,
        dob: data.dob || undefined,
      });
      setIsEditing(false);
      onSaved();
    } catch (err) {
      console.error("Failed to update personal info:", err);
    }
  };

  const handleCancel = () => {
    reset();
    setIsEditing(false);
  };

  const inputStyles = "w-full px-3 py-2 border border-input rounded-md bg-background text-foreground text-sm focus:ring-2 focus:ring-ring focus:outline-none transition-colors disabled:bg-muted/30 disabled:text-muted-foreground disabled:opacity-100 disabled:cursor-default";

  return (
    <div className="bg-card border border-border rounded-xl p-6 shadow-sm transition-all">
      <div className="flex items-center justify-between border-b border-border pb-3 mb-5">
        <div className="flex items-center gap-2">
          <User className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">Personal Information</h2>
        </div>
        {!isEditing && (
          <button type="button" onClick={() => setIsEditing(true)} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-primary bg-primary/10 hover:bg-primary/20 rounded-md transition-colors">
            <Edit2 className="w-3.5 h-3.5" /> Edit Details
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Full Name</label>
            <input disabled={!isEditing} {...register("name")} className={inputStyles} />
            {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Gender</label>
            <select disabled={!isEditing} {...register("gender")} className={inputStyles}>
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            {errors.gender && <p className="text-xs text-destructive">{errors.gender.message}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Date of Birth</label>
            <input type="date" disabled={!isEditing} {...register("dob")} className={inputStyles} />
            {errors.dob && <p className="text-xs text-destructive">{errors.dob.message}</p>}
          </div>

          <div className="flex items-center pt-6">
            {isMinor() && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-warning/10 border border-warning/20 text-warning text-sm font-medium">
                <Info className="w-4 h-4" /> Minor Patient (Under 18)
              </span>
            )}
          </div>
        </div>

        {isEditing && (
          <div className="flex justify-end gap-3 pt-4 border-t border-border mt-4 animate-in fade-in duration-200">
            <button type="button" onClick={handleCancel} className="px-4 py-2 border border-input text-foreground text-sm font-medium rounded-md hover:bg-muted transition-colors flex items-center gap-1.5">
              <X className="w-4 h-4" /> Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-md hover:bg-primary/90 transition-colors flex items-center gap-2 disabled:opacity-70">
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
              Save Changes
            </button>
          </div>
        )}
      </form>
    </div>
  );
}