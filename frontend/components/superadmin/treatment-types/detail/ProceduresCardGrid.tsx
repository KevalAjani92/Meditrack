"use client";

import { Procedure } from "@/types/procedure";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, Scissors } from "lucide-react";

interface ProceduresCardGridProps {
  data: Procedure[];
  onViewDetail: (proc: Procedure) => void;
}

export default function ProceduresCardGrid({ data, onViewDetail }: ProceduresCardGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {data.map((item) => (
        <Card
          key={item.procedure_id}
          onClick={() => onViewDetail(item)}
          className={`p-5 border-border hover:shadow-md hover:-translate-y-0.5 transition-all flex flex-col h-full cursor-pointer group ${
            !item.is_active ? "opacity-60 grayscale-[0.5] hover:opacity-100 hover:grayscale-0" : ""
          }`}
        >
          <div className="flex justify-between items-start mb-3">
            <span className="font-mono text-xs font-semibold px-2 py-1 bg-secondary rounded text-secondary-foreground border border-border">
              {item.procedure_code}
            </span>
            {item.is_surgical ? (
              <Badge variant="destructive" className="bg-destructive/10 text-destructive border-destructive/20">
                <Scissors className="w-3 h-3 mr-1" /> Surgical
              </Badge>
            ) : (
              <Badge variant="outline" className="text-muted-foreground">Standard</Badge>
            )}
          </div>

          <h3 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
            {item.procedure_name}
          </h3>
          
          <p className="text-sm text-muted-foreground flex-1 line-clamp-3 mb-4">
            {item.description}
          </p>

          <div className="pt-3 border-t border-border flex justify-between items-center">
            <Badge variant="outline" className={`text-xs ${item.is_active ? 'text-success border-success/20 bg-success/5' : 'text-muted-foreground'}`}>
              {item.is_active ? "Active" : "Inactive"}
            </Badge>
            <button className="text-xs font-medium text-primary hover:underline flex items-center gap-1">
              View Details <Eye className="w-3 h-3" />
            </button>
          </div>
        </Card>
      ))}
    </div>
  );
}