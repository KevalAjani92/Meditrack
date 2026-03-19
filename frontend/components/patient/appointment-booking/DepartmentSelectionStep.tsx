"use client";

import { Department } from "@/types/booking";
import { Stethoscope } from "lucide-react";
import { Card } from "@/components/ui/card";

interface Props {
  departments: Department[];
  selectedId: number | null;
  onSelect: (id: number) => void;
}

export default function DepartmentSelectionStep({ departments, selectedId, onSelect }: Props) {
  if (departments.length === 0) {
    return <p className="text-muted-foreground p-6 text-center border rounded-lg border-dashed">No departments found for this hospital.</p>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-foreground mb-4">Select a Department</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {departments.map((dept) => (
          <Card 
            key={dept.department_id}
            onClick={() => onSelect(dept.department_id)}
            className={`p-4 cursor-pointer transition-all flex items-center gap-3 border-2 ${
              selectedId === dept.department_id 
                ? "border-primary bg-primary/5 shadow-sm" 
                : "border-border hover:border-primary/40 hover:bg-muted/10"
            }`}
          >
            <div className={`p-2 rounded-lg ${selectedId === dept.department_id ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
              <Stethoscope className="w-4 h-4" />
            </div>
            <h3 className="font-medium text-foreground">{dept.department_name}</h3>
          </Card>
        ))}
      </div>
    </div>
  );
}