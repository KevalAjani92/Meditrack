"use client";

import { Diagnosis } from "@/types/diagnosis";
import { Card } from "@/components/ui/card";
import { Edit2, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface DiagnosesTableProps {
  data: Diagnosis[];
  onViewDetail: (diagnosis: Diagnosis) => void;
  onEdit: (diagnosis: Diagnosis) => void;
}

export default function DiagnosesTable({ data, onViewDetail, onEdit }: DiagnosesTableProps) {
  return (
    <Card className="overflow-hidden border-border shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted/50 text-muted-foreground font-medium border-b border-border">
            <tr>
              <th className="px-6 py-4">Code</th>
              <th className="px-6 py-4">Diagnosis Name</th>
              <th className="px-6 py-4">Department</th>
              <th className="px-6 py-4">Description</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {data.map((item) => (
              <tr 
                key={item.diagnosis_id} 
                onClick={() => onViewDetail(item)}
                className="hover:bg-muted/10 transition-colors cursor-pointer group"
              >
                <td className="px-6 py-4">
                  <span className="font-mono text-xs font-semibold px-2 py-1 bg-secondary rounded text-secondary-foreground border border-border">
                    {item.diagnosis_code}
                  </span>
                </td>
                <td className="px-6 py-4 font-medium text-foreground">
                  {item.diagnosis_name}
                </td>
                <td className="px-6 py-4 text-muted-foreground">
                  {item.department_name}
                </td>
                <td className="px-6 py-4 text-muted-foreground truncate max-w-[200px]">
                  {item.description}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                     <button
                      onClick={() => onViewDetail(item)}
                      className="p-1.5 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-md transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onEdit(item)}
                      className="p-1.5 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-md transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
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