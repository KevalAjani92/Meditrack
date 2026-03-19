"use client";

import { MedicalTest } from "@/types/medical-test";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Edit2, Eye, FlaskConical } from "lucide-react";

interface TestsCardGridProps {
  data: MedicalTest[];
  onViewDetail: (test: MedicalTest) => void;
  onEdit: (test: MedicalTest) => void;
}

export default function TestsCardGrid({ data, onViewDetail, onEdit }: TestsCardGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {data.map((item) => (
        <Card
          key={item.test_id}
          onClick={() => onViewDetail(item)}
          className={`p-5 border-border hover:shadow-md hover:-translate-y-0.5 transition-all flex flex-col h-full cursor-pointer group ${
            !item.is_active ? "opacity-70 grayscale-[30%] hover:opacity-100 hover:grayscale-0" : ""
          }`}
        >
          <div className="flex justify-between items-start mb-3">
            <span className="font-mono text-xs font-semibold px-2 py-1 bg-secondary rounded text-secondary-foreground border border-border">
              {item.test_code}
            </span>
            <Badge 
              variant="outline" 
              className={item.is_active ? "text-success border-success/30 bg-success/5" : "text-muted-foreground"}
            >
              {item.is_active ? "Active" : "Inactive"}
            </Badge>
          </div>

          <h3 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors line-clamp-2">
            {item.test_name}
          </h3>
          
          <div className="flex items-center gap-2 mb-3">
             <span className="text-xs text-muted-foreground">{item.department_name}</span>
             <span className="text-border text-xs">•</span>
             <span className="text-xs text-muted-foreground flex items-center gap-1">
                <FlaskConical className="w-3 h-3" /> {item.test_type}
             </span>
          </div>
          
          <p className="text-sm text-muted-foreground flex-1 line-clamp-3 mb-4">
            {item.description}
          </p>

          <div className="pt-3 border-t border-border flex justify-between items-center">
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