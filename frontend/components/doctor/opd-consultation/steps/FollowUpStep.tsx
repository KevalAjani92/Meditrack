"use client";
import { ConsultationData } from "@/types/consultation";
import FollowUpTable from "../tables/FollowUpTable";

export default function FollowUpStep({ data, updateData, onEditFollowup, onOpenFollowup }: any) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 space-y-6">
       <div>
         <h2 className="text-xl font-bold text-foreground">Schedule Follow-Up</h2>
         <p className="text-sm text-muted-foreground mt-1">Set a future date for the patient to return.</p>
       </div>
       <FollowUpTable followUps={data.followUps} onRemove={(id: string) => updateData({ followUps: data.followUps.filter((d:any)=>d.id !== id)})} onEdit={onEditFollowup} onAdd={onOpenFollowup} />
    </div>
  );
}