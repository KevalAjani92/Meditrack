"use client";

import { Procedure } from "@/types/procedure";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, Scissors } from "lucide-react";

interface ProceduresTableProps {
  data: Procedure[];
  onViewDetail: (proc: Procedure) => void;
}

export default function ProceduresTable({ data, onViewDetail }: ProceduresTableProps) {
  return (
    <Card className="overflow-hidden border-border shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted/50 text-muted-foreground font-medium border-b border-border">
            <tr>
              <th className="px-6 py-4">Procedure Code</th>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Type</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {data.map((item) => (
              <tr 
                key={item.procedure_id} 
                onClick={() => onViewDetail(item)}
                className={`transition-colors cursor-pointer group ${
                  item.is_active 
                    ? "hover:bg-muted/10" 
                    : "bg-muted/5 opacity-60 hover:opacity-100 grayscale-[0.5]"
                }`}
              >
                <td className="px-6 py-4">
                  <span className="font-mono text-xs font-semibold px-2 py-1 bg-secondary rounded text-secondary-foreground border border-border">
                    {item.procedure_code}
                  </span>
                </td>
                <td className="px-6 py-4 font-medium text-foreground">
                  {item.procedure_name}
                </td>
                <td className="px-6 py-4">
                   {item.is_surgical ? (
                     <Badge variant="destructive" className="gap-1 bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive/15">
                       <Scissors className="w-3 h-3" /> Surgical
                     </Badge>
                   ) : (
                     <Badge variant="outline" className="text-muted-foreground border-border">
                       Standard
                     </Badge>
                   )}
                </td>
                <td className="px-6 py-4">
                   <div className={`w-2 h-2 rounded-full inline-block mr-2 ${item.is_active ? 'bg-success' : 'bg-muted-foreground'}`} />
                   <span className={item.is_active ? "text-foreground" : "text-muted-foreground"}>
                     {item.is_active ? "Active" : "Inactive"}
                   </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={(e) => { e.stopPropagation(); onViewDetail(item); }}
                    className="p-1.5 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-md transition-colors"
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