"use client";

import { Department, HospitalDepartment } from "@/types/department";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit2, ShieldAlert } from "lucide-react";
import DepartmentTooltip from "./DepartmentTooltip";

interface Props {
  department: Department | HospitalDepartment;
  type: "master" | "enabled";
  onAction: (dept: any) => void;
}

export default function DepartmentCard({ department, type, onAction }: Props) {
  const isEnabled = type === "enabled";
  const hospitalDept = department as HospitalDepartment;
  const isActive = isEnabled ? hospitalDept.isActive : false;

  return (
    <DepartmentTooltip description={department.description} date={department.created_at}>
      <Card className={`p-4 flex flex-col h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-md cursor-default border-2
        ${!isEnabled ? 'bg-muted/10 border-dashed border-border opacity-90' : ''}
        ${isEnabled && !isActive ? 'bg-muted/30 border-border opacity-75 grayscale-[20%]' : ''}
        ${isEnabled && isActive ? 'bg-card border-border border-solid' : ''}
      `}>
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="font-bold text-foreground text-lg">{department.department_name}</h3>
            <p className="text-xs font-mono text-muted-foreground mt-0.5">{department.department_code}</p>
          </div>
          {isEnabled && (
            <Badge variant="outline" className={`px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider ${isActive ? 'bg-success/10 text-success border-success/20' : 'bg-muted text-muted-foreground border-border'}`}>
              {isActive ? "Active" : "Inactive"}
            </Badge>
          )}
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1">
          {department.description}
        </p>

        <div className="mt-auto pt-3 border-t border-border/50">
          {!isEnabled ? (
            <Button variant="outline" size="sm" className="w-full gap-2 hover:bg-primary/10 hover:text-primary border-border" onClick={() => onAction(department)}>
              <Plus className="w-3.5 h-3.5" /> Enable Department
            </Button>
          ) : (
            <Button variant="secondary" size="sm" className="w-full gap-2 bg-muted hover:bg-muted/80 text-foreground" onClick={() => onAction(department)}>
              <Edit2 className="w-3.5 h-3.5" /> Manage Settings
            </Button>
          )}
        </div>
      </Card>
    </DepartmentTooltip>
  );
}