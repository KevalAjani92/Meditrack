"use client";

import { Badge } from "@/components/ui/badge";

export interface ClinicalItem {
  code: string;
  name: string;
  is_active: boolean;
}

interface ClinicalPreviewTableProps {
  data: ClinicalItem[];
  emptyMessage: string;
}

export default function ClinicalPreviewTable({ data, emptyMessage }: ClinicalPreviewTableProps) {
  if (data.length === 0) {
    return (
      <div className="h-[120px] flex items-center justify-center text-center p-4 border border-dashed border-border rounded-lg bg-muted/10">
        <p className="text-sm text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <table className="w-full text-sm text-left">
        <thead className="bg-muted/50 text-xs text-muted-foreground font-medium uppercase">
          <tr>
            <th className="px-3 py-2">Code</th>
            <th className="px-3 py-2">Name</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border bg-card">
          {data.map((item, idx) => (
            <tr key={idx} className="group hover:bg-muted/5 transition-colors">
              <td className="px-3 py-2 w-[30%]">
                <span className="font-mono text-[11px] font-semibold px-1.5 py-0.5 bg-secondary text-secondary-foreground rounded border border-border">
                  {item.code}
                </span>
              </td>
              <td className="px-3 py-2">
                <div className="flex items-center justify-between">
                  <span className={`truncate max-w-[140px] ${!item.is_active ? 'text-muted-foreground line-through decoration-border' : 'text-foreground'}`}>
                    {item.name}
                  </span>
                  {!item.is_active && (
                    <Badge variant="outline" className="text-[10px] h-4 px-1 text-muted-foreground">
                      Inactive
                    </Badge>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}