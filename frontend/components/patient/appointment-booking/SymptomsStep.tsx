"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useEffect } from "react";

const symptomsSchema = z.object({
  symptoms: z.string().max(500, "Maximum 500 characters allowed.").optional(),
});

type SymptomsFormValues = z.infer<typeof symptomsSchema>;

interface Props {
  initialValue: string;
  onChange: (val: string) => void;
  setIsValid: (valid: boolean) => void;
}

export default function SymptomsStep({ initialValue, onChange, setIsValid }: Props) {
  const { register, watch, formState: { errors, isValid } } = useForm<SymptomsFormValues>({
    resolver: zodResolver(symptomsSchema),
    defaultValues: { symptoms: initialValue },
    mode: "onChange",
  });

  const textValue = watch("symptoms") || "";

  useEffect(() => {
    onChange(textValue);
    setIsValid(isValid);
  }, [textValue, isValid, onChange, setIsValid]);

  return (
    <div className="space-y-4 max-w-2xl">
      <div>
        <h2 className="text-xl font-bold text-foreground">Symptoms & Reason for Visit</h2>
        <p className="text-sm text-muted-foreground mt-1">Briefly describe your symptoms so the doctor can prepare for your visit. (Optional)</p>
      </div>

      <div className="space-y-2 relative">
        <textarea 
          {...register("symptoms")}
          placeholder="e.g. Mild fever, persistent headache since yesterday..."
          className="w-full min-h-[150px] p-4 border border-input rounded-xl bg-background text-foreground focus:ring-2 focus:ring-ring focus:outline-none resize-none transition-shadow"
        />
        <div className="flex justify-between items-center px-1">
           {errors.symptoms ? (
             <span className="text-xs text-destructive">{errors.symptoms.message}</span>
           ) : <span/>}
           <span className={`text-xs ${textValue.length > 500 ? "text-destructive font-bold" : "text-muted-foreground"}`}>
             {textValue.length} / 500
           </span>
        </div>
      </div>
    </div>
  );
}