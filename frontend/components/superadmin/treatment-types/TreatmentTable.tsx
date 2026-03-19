"use client";

import { TreatmentType } from "@/types/treatment";
import { Card } from "@/components/ui/card";
import { Edit2, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface TreatmentTableProps {
  data: TreatmentType[];
  onRowClick: (id: string) => void;
  onEdit: (treatment: TreatmentType) => void;
}

export default function TreatmentTable({ data, onRowClick, onEdit }: TreatmentTableProps) {
  return (
    <Card className="overflow-hidden border-border shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted/50 text-muted-foreground font-medium border-b border-border">
            <tr>
              <th className="px-6 py-4">Treatment Code</th>
              <th className="px-6 py-4">Treatment Name</th>
              <th className="px-6 py-4">Department</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {data.map((item) => (
              <tr
                key={item.treatment_type_id}
                onClick={() => onRowClick(item.treatment_type_id)}
                className={`transition-colors cursor-pointer group ${
                  item.is_active ? "hover:bg-muted/10" : "bg-muted/5 opacity-70 hover:opacity-100"
                }`}
              >
                <td className="px-6 py-4">
                  <span className="font-mono text-xs font-semibold px-2 py-1 bg-secondary rounded text-secondary-foreground border border-border">
                    {item.treatment_code}
                  </span>
                </td>
                <td className="px-6 py-4 font-medium text-foreground">
                  {item.treatment_name}
                </td>
                <td className="px-6 py-4 text-muted-foreground">
                  {item.department_name}
                </td>
                <td className="px-6 py-4">
                  <Badge 
                    variant={item.is_active ? "default" : "secondary"}
                    className={item.is_active ? "bg-success/10 text-success border-success/20 hover:bg-success/20" : "bg-muted text-muted-foreground hover:bg-muted"}
                  >
                    {item.is_active ? "Active" : "Inactive"}
                  </Badge>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // Stop row click
                        onEdit(item);
                      }}
                      className="p-1.5 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-md transition-colors"
                      title="Edit Configuration"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <ChevronRight className="w-4 h-4 text-muted-foreground/50 group-hover:text-primary transition-colors" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}