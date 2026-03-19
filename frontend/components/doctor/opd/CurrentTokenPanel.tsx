"use client";

import { useRouter } from "next/navigation";
import { PlayCircle, SkipForward, XCircle, AlertTriangle, Stethoscope } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { OpdToken } from "@/types/opd-queue";

interface Props {
  token: OpdToken | null;
  onSkip: (id: string) => void;
  onNoShow: (id: string) => void;
}

export default function CurrentTokenPanel({ token, onSkip, onNoShow }: Props) {
  const router = useRouter();
  if (!token) return null;

  return (
    <div className={`relative p-6 rounded-2xl border-2 shadow-md animate-in zoom-in-95 duration-300 ${token.isEmergency ? 'bg-destructive/5 border-destructive shadow-destructive/20' : 'bg-primary/5 border-primary shadow-primary/10'}`}>
      
      {token.isEmergency && (
        <div className="absolute -top-3 left-6 px-3 py-0.5 bg-destructive text-destructive-foreground text-xs font-bold uppercase rounded-full tracking-widest flex items-center gap-1.5 animate-pulse">
          <AlertTriangle className="w-3.5 h-3.5" /> Emergency Priority
        </div>
      )}

      <div className="flex flex-col lg:flex-row justify-between gap-6 items-start lg:items-center mt-2">
        <div className="flex gap-5 items-center">
          <div className={`w-20 h-20 flex items-center justify-center rounded-xl text-3xl font-black shadow-inner border ${token.isEmergency ? 'bg-destructive text-destructive-foreground border-destructive/50' : 'bg-primary text-primary-foreground border-primary/50'}`}>
            {token.tokenNo}
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1">Currently Consulting</p>
            <h2 className="text-2xl font-bold text-foreground">{token.patientName}</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm text-muted-foreground">{token.age}Y, {token.gender}</span>
              <span className="text-muted-foreground">•</span>
              <Badge variant="outline" className="text-[10px] uppercase font-bold">{token.visitType}</Badge>
              {token.apptNo && <span className="text-xs font-mono text-muted-foreground bg-muted px-1.5 rounded">{token.apptNo}</span>}
            </div>
            <p className="text-sm font-medium text-foreground mt-2"><span className="text-muted-foreground">CC:</span> {token.chiefComplaint}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 w-full lg:w-auto">
          <Button variant="outline" onClick={() => onSkip(token.id)} className="flex-1 lg:flex-none gap-2 hover:bg-muted">
            <SkipForward className="w-4 h-4" /> Skip
          </Button>
          <Button variant="outline" onClick={() => onNoShow(token.id)} className="flex-1 lg:flex-none gap-2 text-destructive hover:bg-destructive/10 hover:text-destructive border-destructive/30">
            <XCircle className="w-4 h-4" /> No Show
          </Button>
          <Button onClick={() => router.push(`/doctor/opd-consultation/${token.id}`)} className="flex-1 lg:flex-none gap-2 bg-success hover:bg-success/90 text-success-foreground py-6 text-base font-bold shadow-lg shadow-success/20">
            <Stethoscope className="w-5 h-5" /> Start Consultation
          </Button>
        </div>
      </div>
    </div>
  );
}