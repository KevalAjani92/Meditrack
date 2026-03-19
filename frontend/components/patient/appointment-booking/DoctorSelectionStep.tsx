"use client";

import { Doctor } from "@/types/booking";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Briefcase, DollarSign } from "lucide-react";

interface Props {
  doctors: Doctor[];
  selectedId: number | null;
  onSelect: (id: number) => void;
}

export default function DoctorSelectionStep({ doctors, selectedId, onSelect }: Props) {
  if (doctors.length === 0) {
    return <p className="text-muted-foreground p-6 text-center border rounded-lg border-dashed">No doctors available in this department.</p>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-foreground mb-4">Select a Doctor</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {doctors.map((doc) => {
          const isSelected = selectedId === doc.doctor_id;
          return (
            <Card 
              key={doc.doctor_id}
              onClick={() => doc.available && onSelect(doc.doctor_id)}
              className={`p-5 transition-all flex gap-4 border-2 ${
                !doc.available ? "opacity-60 cursor-not-allowed border-border bg-muted/5" 
                : isSelected ? "border-primary bg-primary/5 shadow-sm cursor-pointer" 
                : "border-border hover:border-primary/40 hover:bg-muted/10 cursor-pointer"
              }`}
            >
              <div className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground font-bold text-lg shrink-0">
                {doc.avatar}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-foreground">{doc.name}</h3>
                  <Badge variant={doc.available ? "outline" : "secondary"} className={doc.available ? "text-success border-success/30 bg-success/5" : "text-muted-foreground"}>
                    {doc.available ? "Available" : "Unavailable"}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-0.5">{doc.specialization}</p>
                
                <div className="flex items-center gap-4 mt-3 pt-3 border-t border-border/60">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Briefcase className="w-3.5 h-3.5" /> {doc.experience} Yrs Exp.
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                    <DollarSign className="w-3.5 h-3.5 text-muted-foreground" /> ₹{doc.fee} Fee
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}