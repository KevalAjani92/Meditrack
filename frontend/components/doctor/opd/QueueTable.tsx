"use client";

import { OpdToken } from "@/types/opd-queue";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Volume2, AlertTriangle, Clock } from "lucide-react";
import PatientQuickInfoHover from "./PatientQuickInfoHover";

interface Props {
  queue: OpdToken[];
  onCall: (id: string) => void;
}

export default function QueueTable({ queue, onCall }: Props) {
  
  const getStatusBadge = (status: string) => {
    if (status === "Waiting") return "bg-primary/10 text-primary border-primary/20";
    if (status === "In Progress") return "bg-success/10 text-success border-success/20";
    if (status === "Completed") return "bg-muted text-muted-foreground border-border";
    return "bg-destructive/10 text-destructive border-destructive/20";
  };

  return (
    <Card className="overflow-hidden border-border shadow-sm flex-1">
      <div className="overflow-x-auto max-h-[600px] no-scrollbar relative">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted text-muted-foreground font-medium sticky top-0 z-10 border-b border-border">
            <tr>
              <th className="px-4 py-3">Token</th>
              <th className="px-4 py-3">Patient Identity</th>
              <th className="px-4 py-3">Visit Info</th>
              <th className="px-4 py-3">Chief Complaint</th>
              <th className="px-4 py-3">Wait Time</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {queue.map((token) => (
              <tr key={token.id} className={`transition-colors group hover:bg-muted/10 ${token.isEmergency && token.status === 'Waiting' ? 'bg-destructive/5' : ''}`}>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className={`font-mono font-bold text-base ${token.isEmergency ? 'text-destructive' : 'text-foreground'}`}>{token.tokenNo}</span>
                    {token.isEmergency && <AlertTriangle className="w-3.5 h-3.5 text-destructive" title="Emergency" />}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <PatientQuickInfoHover patientName={token.patientName} medicalInfo={token.medicalInfo} />
                  <p className="text-xs text-muted-foreground mt-0.5">{token.age}Y, {token.gender}</p>
                </td>
                <td className="px-4 py-3">
                  <Badge variant="outline" className="text-[10px] uppercase font-bold">{token.visitType}</Badge>
                  {token.apptNo && <p className="text-xs text-muted-foreground font-mono mt-1">{token.apptNo}</p>}
                </td>
                <td className="px-4 py-3 text-muted-foreground max-w-[200px] truncate" title={token.chiefComplaint}>
                  {token.chiefComplaint}
                </td>
                <td className="px-4 py-3">
                  {token.status === "Waiting" ? (
                    <span className={`flex items-center gap-1.5 font-medium ${token.waitTimeMins > 30 ? 'text-destructive' : 'text-foreground'}`}>
                      <Clock className="w-3.5 h-3.5" /> {token.waitTimeMins} min
                    </span>
                  ) : (
                    <span className="text-muted-foreground text-xs">—</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <Badge variant="outline" className={getStatusBadge(token.status)}>{token.status}</Badge>
                </td>
                <td className="px-4 py-3 text-right">
                  {token.status === "Waiting" && (
                    <Button variant="outline" size="sm" onClick={() => onCall(token.id)} className="h-8 gap-1.5 text-primary hover:text-primary hover:bg-primary/10 border-primary/20">
                      <Volume2 className="w-3.5 h-3.5" /> Call
                    </Button>
                  )}
                </td>
              </tr>
            ))}
            {queue.length === 0 && (
               <tr><td colSpan={7} className="px-4 py-12 text-center text-muted-foreground">No patients in queue.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}