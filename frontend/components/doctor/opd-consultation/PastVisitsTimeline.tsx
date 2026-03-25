"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Clock, Eye, Activity } from "lucide-react";
import { PastVisit } from "@/types/consultation";
import VisitDetailsModal from "./VisitDetailsModal";

export default function PastVisitsTimeline({ visits }: { visits: PastVisit[] }) {
  const [selectedVisit, setSelectedVisit] = useState<PastVisit | null>(null);

  return (
    <>
      <Card className="p-5 border-border shadow-sm h-full">
        <h3 className="text-sm font-bold text-foreground uppercase tracking-wider mb-4 border-b border-border pb-2 flex items-center gap-2">
          <Clock className="w-4 h-4 text-primary"/> Past Visits
        </h3>
        <div className="space-y-4">
          {visits.map((v, i) => (
            <div key={v.id} className="relative flex gap-3">
              {i !== visits.length - 1 && <div className="absolute left-2.5 top-6 bottom-[-16px] w-0.5 bg-border" />}
              <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-0.5 z-10"><div className="w-2 h-2 rounded-full bg-primary" /></div>
              <div className="bg-muted/20 border border-border p-3 rounded-lg flex-1">
                <div className="flex justify-between items-center mb-1">
                  <p className="text-sm font-bold">{v.date}</p>
                  <button 
                    onClick={() => setSelectedVisit(v)} 
                    className="text-primary hover:bg-primary/10 px-2 py-1 rounded text-xs flex items-center gap-1 transition-colors"
                  >
                    <Eye className="w-3 h-3"/> View
                  </button>
                </div>
                <p className="text-xs text-muted-foreground">{v.doctor} • {v.department}</p>
                <p className="text-xs mt-2 font-medium flex items-center gap-1 truncate text-muted-foreground">
                  <Activity className="w-3 h-3"/> {v.diagnoses[0] || "No diagnosis"}
                </p>
              </div>
            </div>
          ))}
          {visits.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">No previous visits found.</p>
          )}
        </div>
      </Card>

      <VisitDetailsModal 
        isOpen={selectedVisit !== null} 
        onClose={() => setSelectedVisit(null)} 
        visit={selectedVisit} 
      />
    </>
  );
}