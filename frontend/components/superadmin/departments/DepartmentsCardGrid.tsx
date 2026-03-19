"use client";

import { Department, getRelativeTime } from "@/types/department";
import { Card } from "@/components/ui/card";
import { Edit2, Clock, Eye } from "lucide-react";

interface DepartmentsCardGridProps {
  data: Department[];
  onEdit: (dept: Department) => void;
  onRowClick: (id: number) => void;
}

export default function DepartmentsCardGrid({
  data,
  onEdit,
  onRowClick,
}: DepartmentsCardGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {data.map((dept) => (
        <Card
          key={dept.department_id}
          onClick={() => onRowClick(dept.department_id)}
          className="p-5 border-border hover:shadow-md hover:-translate-y-0.5 transition-all flex flex-col h-full cursor-pointer"
        >
          <div className="flex justify-between items-start mb-3">
            <span className="px-2.5 py-1 bg-secondary text-secondary-foreground text-xs font-bold rounded-md border border-border">
              {dept.department_code}
            </span>
            <div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(dept);
                }}
                className="p-1.5 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-md transition-colors"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => onRowClick(dept.department_id)}
                className="p-1.5 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-md transition-colors"
              >
                <Eye className="w-4 h-4" />
              </button>
            </div>
          </div>

          <h3 className="font-semibold text-lg text-foreground mb-1">
            {dept.department_name}
          </h3>
          <p className="text-sm text-muted-foreground flex-1 line-clamp-2">
            {dept.description || "No description provided."}
          </p>

          <div className="mt-4 pt-4 border-t border-border flex items-center gap-1.5 text-xs text-muted-foreground">
            <Clock className="w-3.5 h-3.5" />
            Created {getRelativeTime(dept.created_at)}
          </div>
        </Card>
      ))}
    </div>
  );
}
