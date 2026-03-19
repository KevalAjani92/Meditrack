"use client";

import { Medicine, HospitalMedicine } from "@/types/medicine";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Settings2, Pill, AlertTriangle } from "lucide-react";
import MedicineTooltip from "./MedicineTooltip";

interface Props {
  medicine: Medicine | HospitalMedicine;
  type: "master" | "enabled";
  onAction: (m: any) => void;
}

export default function MedicineCard({ medicine, type, onAction }: Props) {
  const isEnabled = type === "enabled";
  const hospitalMed = medicine as HospitalMedicine;
  const isActive = isEnabled ? hospitalMed.isActive : false;
  const isLowStock = isEnabled && hospitalMed.stock < 10;

  return (
    <MedicineTooltip 
      description={medicine.description || "Sample Description"} 
      type={medicine.medicine_type} 
      strength={medicine.strength} 
      manufacturer={medicine.manufacturer} 
      date={medicine.created_at}
    >
      <Card className={`p-4 flex flex-col h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-md cursor-default border-2
        ${!isEnabled ? 'bg-muted/10 border-dashed border-border opacity-90' : ''}
        ${isEnabled && !isActive ? 'bg-muted/30 border-border opacity-75 grayscale-[20%]' : ''}
        ${isEnabled && isActive ? 'bg-card border-border border-solid' : ''}
      `}>
        <div className="flex justify-between items-start mb-2">
          <div className="flex-1 pr-2">
            <h3 className="font-bold text-foreground text-base leading-tight line-clamp-2">{medicine.medicine_name}</h3>
            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
              <p className="text-[11px] font-mono text-primary font-semibold bg-primary/10 px-1.5 py-0.5 rounded">{medicine.medicine_code}</p>
              <Badge variant="secondary" className="text-[10px] text-muted-foreground flex items-center gap-1">
                 <Pill className="w-3 h-3" /> {medicine.medicine_type}
              </Badge>
            </div>
          </div>
          
          <div className="flex flex-col items-end gap-1">
            {isEnabled && (
              <Badge variant="outline" className={`shrink-0 px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider ${isActive ? 'bg-success/10 text-success border-success/20' : 'bg-muted text-muted-foreground border-border'}`}>
                {isActive ? "Active" : "Inactive"}
              </Badge>
            )}
            {isLowStock && (
              <Badge variant="destructive" className="shrink-0 px-1.5 py-0.5 text-[9px] uppercase font-bold tracking-wider flex items-center gap-1 animate-pulse">
                <AlertTriangle className="w-3 h-3" /> Low Stock
              </Badge>
            )}
          </div>
        </div>

        <div className="mb-3 flex-1 mt-2 text-sm text-muted-foreground space-y-1">
          <p><span className="font-medium text-foreground">Strength:</span> {medicine.strength}</p>
          <p className="truncate"><span className="font-medium text-foreground">Mfg:</span> {medicine.manufacturer}</p>
        </div>

        <div className="mt-auto pt-3 border-t border-border/50 flex flex-col gap-3">
          {isEnabled && (
            <div className="flex items-center justify-between">
              <div className="font-black text-lg text-foreground tracking-tight">
                ₹ {hospitalMed.price}
              </div>
              <div className={`text-xs font-semibold ${isLowStock ? 'text-destructive' : 'text-muted-foreground'}`}>
                Stock: {hospitalMed.stock} units
              </div>
            </div>
          )}
          
          {!isEnabled ? (
            <Button variant="outline" size="sm" className="w-full gap-2 hover:bg-primary/10 hover:text-primary border-border transition-colors" onClick={() => onAction(medicine)}>
              <Plus className="w-3.5 h-3.5" /> Enable Medicine
            </Button>
          ) : (
            <Button variant="secondary" size="sm" className="w-full gap-2 bg-muted hover:bg-muted/80 text-foreground transition-colors" onClick={() => onAction(medicine)}>
              <Settings2 className="w-3.5 h-3.5" /> Manage Settings
            </Button>
          )}
        </div>
      </Card>
    </MedicineTooltip>
  );
}