"use client";

import { Hospital } from "@/types/booking";
import { Building2, MapPin } from "lucide-react";
import { Card } from "@/components/ui/card";

interface Props {
  hospitals: Hospital[];
  selectedId: number | null;
  onSelect: (id: number) => void;
}

export default function HospitalSelectionStep({ hospitals, selectedId, onSelect }: Props) {
  if (hospitals.length === 0) {
    return <p className="text-muted-foreground p-6 text-center border rounded-lg border-dashed">No hospitals available.</p>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-foreground mb-4">Select a Hospital</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {hospitals.map((hospital) => (
          <Card 
            key={hospital.hospital_id}
            onClick={() => onSelect(hospital.hospital_id)}
            className={`p-5 cursor-pointer transition-all flex items-start gap-4 border-2 ${
              selectedId === hospital.hospital_id 
                ? "border-primary bg-primary/5 shadow-sm" 
                : "border-border hover:border-primary/40 hover:bg-muted/10"
            }`}
          >
            <div className={`p-3 rounded-xl ${selectedId === hospital.hospital_id ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"}`}>
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground text-lg">{hospital.hospital_name}</h3>
              <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                <MapPin className="w-3.5 h-3.5" /> 
                {[hospital.address, hospital.city_name, hospital.state_name].filter(Boolean).join(", ")}
              </p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}