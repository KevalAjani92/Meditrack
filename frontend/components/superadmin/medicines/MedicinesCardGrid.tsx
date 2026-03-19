"use client";

import { Medicine } from "@/types/medicine";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Edit2, Eye, Pill, Droplet, Syringe } from "lucide-react";

interface MedicinesCardGridProps {
  data: Medicine[];
  onViewDetail: (medicine: Medicine) => void;
  onEdit: (medicine: Medicine) => void;
}

// Duplicate helper for grid view (in real app, move to common utils)
const getTypeIcon = (type: string) => {
  switch (type) {
    case "Tablet": return <Pill className="w-3 h-3" />;
    case "Capsule": return <Pill className="w-3 h-3" />;
    case "Syrup": return <Droplet className="w-3 h-3" />;
    case "Injection": return <Syringe className="w-3 h-3" />;
    default: return <Pill className="w-3 h-3" />;
  }
};

export default function MedicinesCardGrid({ data, onViewDetail, onEdit }: MedicinesCardGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {data.map((item) => (
        <Card
          key={item.medicine_id}
          onClick={() => onViewDetail(item)}
          className={`p-5 border-border hover:shadow-md hover:-translate-y-0.5 transition-all flex flex-col h-full cursor-pointer group ${
            !item.is_active ? "opacity-70 grayscale-[30%] hover:opacity-100 hover:grayscale-0" : ""
          }`}
        >
          <div className="flex justify-between items-start mb-3">
            <span className="font-mono text-xs font-semibold px-2 py-1 bg-secondary rounded text-secondary-foreground border border-border">
              {item.medicine_code}
            </span>
            <Badge 
              variant="outline" 
              className={item.is_active ? "text-success border-success/30 bg-success/5" : "text-muted-foreground"}
            >
              {item.is_active ? "Active" : "Inactive"}
            </Badge>
          </div>

          <h3 className="font-semibold text-lg text-foreground mb-1 group-hover:text-primary transition-colors">
            {item.medicine_name}
          </h3>
          
          <div className="flex items-center gap-2 mb-4">
             <Badge variant="secondary" className="text-xs font-medium text-foreground gap-1">
                {getTypeIcon(item.medicine_type)} {item.medicine_type}
             </Badge>
             <span className="text-sm font-bold text-foreground">{item.strength}</span>
          </div>
          
          <div className="flex-1">
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Manufacturer</p>
            <p className="text-sm text-foreground">{item.manufacturer}</p>
          </div>

          <div className="pt-3 border-t border-border flex justify-between items-center mt-4">
             <button
              onClick={(e) => {
                e.stopPropagation();
                onViewDetail(item);
              }}
              className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <Eye className="w-3.5 h-3.5" /> Details
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(item);
              }}
              className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              <Edit2 className="w-3.5 h-3.5" /> Edit
            </button>
          </div>
        </Card>
      ))}
    </div>
  );
}