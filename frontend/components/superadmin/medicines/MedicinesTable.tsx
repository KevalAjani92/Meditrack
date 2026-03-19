"use client";

import { Medicine } from "@/types/medicine";
import { Card } from "@/components/ui/card";
import { Edit2, Eye, Droplet, Pill, Syringe } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface MedicinesTableProps {
  data: Medicine[];
  onViewDetail: (medicine: Medicine) => void;
  onEdit: (medicine: Medicine) => void;
}

// Helper to get icon based on medicine type
const getTypeIcon = (type: string) => {
  switch (type) {
    case "Tablet": return <Pill className="w-3 h-3" />;
    case "Capsule": return <Pill className="w-3 h-3" />;
    case "Syrup": return <Droplet className="w-3 h-3" />;
    case "Injection": return <Syringe className="w-3 h-3" />;
    default: return <Pill className="w-3 h-3" />;
  }
};

export default function MedicinesTable({ data, onViewDetail, onEdit }: MedicinesTableProps) {
  return (
    <Card className="overflow-hidden border-border shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted/50 text-muted-foreground font-medium border-b border-border">
            <tr>
              <th className="px-6 py-4">Code</th>
              <th className="px-6 py-4">Medicine Name</th>
              <th className="px-6 py-4">Type</th>
              <th className="px-6 py-4">Strength</th>
              <th className="px-6 py-4">Manufacturer</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {data.map((item) => (
              <tr 
                key={item.medicine_id} 
                onClick={() => onViewDetail(item)}
                className={`transition-colors cursor-pointer group ${
                  item.is_active 
                    ? "hover:bg-muted/10" 
                    : "bg-muted/5 opacity-70 hover:opacity-100"
                }`}
              >
                <td className="px-6 py-4">
                  <span className="font-mono text-xs font-semibold px-2 py-1 bg-secondary rounded text-secondary-foreground border border-border">
                    {item.medicine_code}
                  </span>
                </td>
                <td className="px-6 py-4 font-medium text-foreground">
                  {item.medicine_name}
                </td>
                <td className="px-6 py-4">
                  <Badge variant="outline" className="text-muted-foreground gap-1.5">
                    {getTypeIcon(item.medicine_type)} {item.medicine_type}
                  </Badge>
                </td>
                <td className="px-6 py-4 text-foreground font-semibold">
                  {item.strength}
                </td>
                <td className="px-6 py-4 text-muted-foreground">
                  {item.manufacturer}
                </td>
                <td className="px-6 py-4">
                   <div className={`w-2 h-2 rounded-full inline-block mr-2 ${item.is_active ? 'bg-success' : 'bg-muted-foreground'}`} />
                   <span className={item.is_active ? "text-foreground" : "text-muted-foreground"}>
                     {item.is_active ? "Active" : "Inactive"}
                   </span>
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