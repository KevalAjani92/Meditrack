"use client";

import { Diagnosis } from "@/types/diagnosis";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Edit2 } from "lucide-react";

interface DiagnosesCardGridProps {
  data: Diagnosis[];
  onViewDetail: (diagnosis: Diagnosis) => void;
  onEdit: (diagnosis: Diagnosis) => void;
}

export default function DiagnosesCardGrid({ data, onViewDetail, onEdit }: DiagnosesCardGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {data.map((item) => (
        <Card 
          key={item.diagnosis_id} 
          onClick={() => onViewDetail(item)}
          className="p-5 border-border hover:shadow-md hover:-translate-y-0.5 transition-all flex flex-col h-full cursor-pointer"
        >
          <div className="flex justify-between items-start mb-3">
             <span className="font-mono text-xs font-semibold px-2 py-1 bg-secondary rounded text-secondary-foreground border border-border">
              {item.diagnosis_code}
            </span>
            <Badge variant="outline" className="text-xs text-muted-foreground font-normal">
              {item.department_name}
            </Badge>
          </div>
          
          <h3 className="font-semibold text-foreground mb-1 line-clamp-2">{item.diagnosis_name}</h3>
          
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
              <Edit2 className="w-3.5 h-3.5" /> Edit Diagnosis
            </button>
          </div>
        </Card>
      ))}
    </div>
  );
}