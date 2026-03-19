"use client";

import { TreatmentType } from "@/types/treatment";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Edit2 } from "lucide-react";

interface TreatmentCardGridProps {
  data: TreatmentType[];
  onRowClick: (id: string) => void;
  onEdit: (treatment: TreatmentType) => void;
}

export default function TreatmentCardGrid({ data, onRowClick, onEdit }: TreatmentCardGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {data.map((item) => (
        <Card
          key={item.treatment_type_id}
          onClick={() => onRowClick(item.treatment_type_id)}
          className={`p-5 border-border hover:shadow-md hover:-translate-y-0.5 transition-all flex flex-col h-full cursor-pointer group ${
            !item.is_active ? "opacity-70 grayscale-[30%] hover:opacity-100 hover:grayscale-0" : ""
          }`}
        >
          <div className="flex justify-between items-start mb-3">
            <span className="font-mono text-xs font-semibold px-2 py-1 bg-secondary rounded text-secondary-foreground border border-border">
              {item.treatment_code}
            </span>
            <Badge 
              variant="outline" 
              className={item.is_active ? "text-success border-success/30 bg-success/5" : "text-muted-foreground"}
            >
              {item.is_active ? "Active" : "Inactive"}
            </Badge>
          </div>

          <h3 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
            {item.treatment_name}
          </h3>
          <p className="text-xs text-muted-foreground mb-3 font-medium">
            {item.department_name}
          </p>
          
          <p className="text-sm text-muted-foreground flex-1 line-clamp-3 mb-4">
            {item.description}
          </p>

          <div className="pt-3 border-t border-border flex justify-end">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(item);
              }}
              className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              <Edit2 className="w-3.5 h-3.5" /> Edit Configuration
            </button>
          </div>
        </Card>
      ))}
    </div>
  );
}