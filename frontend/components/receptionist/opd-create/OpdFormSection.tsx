"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, CheckCircle, Hash } from "lucide-react";
import { Button } from "@/components/ui/button";

const opdSchema = z.object({
  chiefComplaint: z.string().min(3, "Chief complaint is required"),
  clinicalNotes: z.string().optional(),
  skipQueue: z.boolean().optional(),
});

export type OpdFormData = z.infer<typeof opdSchema>;

interface Props {
  isEmergency: boolean;
  isLoading:boolean;
  onSubmit: (data: OpdFormData) => void;
  canSubmit: boolean;
}

export default function OpdFormSection({ isEmergency, onSubmit,isLoading, canSubmit }: Props) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<OpdFormData>({
    resolver: zodResolver(opdSchema),
  });

  // const generatedOpdNo = "OPD-" + Math.floor(10000 + Math.random() * 90000);
  const now = new Date().toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-card border border-border p-6 rounded-xl shadow-sm">
      <div className="flex justify-between items-center border-b border-border pb-4">
        <h3 className="text-lg font-bold text-foreground">OPD Visit Details</h3>
        <div className="flex gap-4 text-sm">
          <div className="flex items-center gap-1.5 font-mono bg-muted px-2 py-1 rounded text-muted-foreground">
            <Hash className="w-3.5 h-3.5" /> Auto Generated
          </div>
          <div className="flex items-center gap-1.5 font-medium text-foreground">
            {now}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">Chief Complaint <span className="text-destructive">*</span></label>
          <input 
            {...register("chiefComplaint")} 
            placeholder="e.g. Severe headache and nausea..." 
            className="w-full px-3 py-2 bg-background border border-input rounded-md focus:ring-2 focus:ring-ring outline-none" 
          />
          {errors.chiefComplaint && <p className="text-xs text-destructive">{errors.chiefComplaint.message}</p>}
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">Clinical Notes (Optional)</label>
          <textarea 
            {...register("clinicalNotes")} 
            placeholder="Additional observations..." 
            className="w-full px-3 py-2 bg-background border border-input rounded-md focus:ring-2 focus:ring-ring outline-none resize-none h-20" 
          />
        </div>

        {isEmergency && (
          <div className="flex items-center gap-3 p-3 rounded-lg border border-destructive/30 bg-destructive/5 mt-2">
            <input type="checkbox" id="skipQueue" {...register("skipQueue")} defaultChecked className="w-4 h-4 accent-destructive" />
            <label htmlFor="skipQueue" className="text-sm font-bold text-destructive cursor-pointer">Skip Queue (Priority Visit)</label>
          </div>
        )}
      </div>

      <div className="pt-4 flex justify-end">
        <Button 
          type="submit" 
          disabled={!canSubmit || isLoading} 
          className={`px-8 gap-2 ${isEmergency ? 'bg-destructive hover:bg-destructive/90 text-destructive-foreground' : ''}`}
        >
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
          {isEmergency ? "Create Emergency OPD" : "Create OPD Visit"}
        </Button>
      </div>
    </form>
  );
}