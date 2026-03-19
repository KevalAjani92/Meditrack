"use client";

import { Department, getRelativeTime } from "@/types/department";
import { Card } from "@/components/ui/card";
import { Edit2, Eye } from "lucide-react";

export type SortConfig = {
  key: keyof Department;
  direction: "asc" | "desc";
} | null;

interface DepartmentsTableProps {
  data: Department[];
  onEdit: (dept: Department) => void;
  onRowClick: (id: number) => void;
}

export default function DepartmentsTable({
  data,
  onEdit,
  onRowClick,
}: DepartmentsTableProps) {
  return (
    <Card className="overflow-hidden border-border shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted/50 text-muted-foreground font-medium border-b border-border">
            <tr>
              <th className="px-6 py-4 cursor-pointer group select-none">
                <div className="flex items-center">Code </div>
              </th>
              <th className="px-6 py-4 cursor-pointer group select-none">
                <div className="flex items-center">Department Name </div>
              </th>
              <th className="px-6 py-4">Description</th>
              <th className="px-6 py-4 cursor-pointer group select-none">
                <div className="flex items-center">Created </div>
              </th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {data.map((dept) => (
              <tr
                key={dept.department_id}
                onClick={()=>onRowClick(dept.department_id)}
                className="hover:bg-muted/10 transition-colors group cursor-pointer"
              >
                <td className="px-6 py-4">
                  <span className="px-2 py-1 bg-secondary text-secondary-foreground text-xs font-semibold rounded-md border border-border">
                    {dept.department_code}
                  </span>
                </td>
                <td className="px-6 py-4 font-medium text-foreground">
                  {dept.department_name}
                </td>
                <td className="px-6 py-4 text-muted-foreground truncate max-w-xs">
                  {dept.description || "—"}
                </td>
                <td className="px-6 py-4 text-muted-foreground text-xs">
                  {getRelativeTime(dept.created_at)}
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={(e) =>{ 
                      e.stopPropagation();
                      onEdit(dept)
                    }}
                    className="p-1.5 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-md transition-colors outline-none"
                    title="Edit Department"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onRowClick(dept.department_id)}
                    className="p-1.5 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-md transition-colors outline-none"
                    title="View Details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
