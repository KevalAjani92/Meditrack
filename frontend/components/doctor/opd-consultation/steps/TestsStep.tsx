"use client";
import { ConsultationData } from "@/types/consultation";
import TestOrdersTable from "../tables/TestOrdersTable";

export default function TestsStep({ data, updateData, onEditTest, onOpenTest }: any) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 space-y-6">
       <div>
         <h2 className="text-xl font-bold text-foreground">Lab & Imaging Tests</h2>
         <p className="text-sm text-muted-foreground mt-1">Order diagnostic tests for the patient.</p>
       </div>
       <TestOrdersTable tests={data.tests} onRemove={(id: string) => updateData({ tests: data.tests.filter((d:any)=>d.id !== id)})} onEdit={onEditTest} onAdd={onOpenTest} />
    </div>
  );
}