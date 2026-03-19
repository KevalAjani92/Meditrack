"use client";

import { ConsultationData } from "@/types/consultation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  CheckCircle2, 
  Printer, 
  ClipboardList, 
  Syringe, 
  Pill, 
  FlaskConical, 
  CalendarClock 
} from "lucide-react";

export default function ConsultationSummaryStep({ data }: { data: ConsultationData }) {
  
  const handlePrint = () => {
    // In a real application, this would open a formatted PDF or trigger window.print()
    console.log("Printing prescription...");
    window.print();
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
      
      {/* Success Banner & Actions */}
      <div className="bg-success/10 border border-success/20 p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-success">
          <CheckCircle2 className="w-6 h-6 shrink-0" />
          <div>
            <h3 className="font-bold">Ready for Completion</h3>
            <p className="text-sm opacity-90">Please review the details below before finalizing the consultation.</p>
          </div>
        </div>
        <Button 
          onClick={handlePrint} 
          variant="outline" 
          className="shrink-0 gap-2 text-primary border-primary/30 hover:bg-primary/10 hover:text-primary transition-colors"
        >
          <Printer className="w-4 h-4" /> Print Prescription
        </Button>
      </div>

      {/* Summary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Card 1: Clinical Assessment */}
        <Card className="p-5 border-border shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider border-b border-border pb-2 flex items-center gap-2">
            <ClipboardList className="w-4 h-4 text-primary" /> Clinical Assessment
          </h3>
          
          <div>
            <p className="text-xs text-muted-foreground mb-1">Chief Complaint</p>
            <p className="font-medium text-foreground text-sm bg-muted/20 p-2.5 rounded-md border border-border/50">
              {data.chiefComplaint || <span className="text-muted-foreground italic">None recorded</span>}
            </p>
          </div>
          
          <div>
            <p className="text-xs text-muted-foreground mb-1">Clinical Notes</p>
            <p className="font-medium text-foreground text-sm bg-muted/20 p-2.5 rounded-md border border-border/50 whitespace-pre-wrap">
              {data.clinicalNotes || <span className="text-muted-foreground italic">No clinical notes added.</span>}
            </p>
          </div>

          <div>
            <p className="text-xs text-muted-foreground mb-1">Diagnoses</p>
            {data.diagnoses.length > 0 ? (
              <ul className="list-disc pl-5 text-sm font-medium space-y-1 text-foreground mt-1">
                {data.diagnoses.map(d => (
                  <li key={d.id}>
                    {d.name} 
                    {d.isPrimary && <span className="text-[10px] font-bold bg-primary/10 text-primary px-1.5 py-0.5 rounded ml-2 uppercase tracking-wide">Primary</span>}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground italic mt-1">No diagnoses added.</p>
            )}
          </div>
        </Card>

        {/* Card 2: Prescriptions & Advice */}
        <Card className="p-5 border-border shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider border-b border-border pb-2 flex items-center gap-2">
            <Pill className="w-4 h-4 text-primary" /> Prescriptions & Advice
          </h3>
          
          <div>
            <p className="text-xs text-muted-foreground mb-1">Medicines Prescribed</p>
            {data.prescriptions.length > 0 ? (
              <ul className="list-disc pl-5 text-sm font-medium space-y-2 text-foreground mt-1">
                {data.prescriptions.map(p => (
                  <li key={p.id}>
                    <span className="font-semibold">{p.medicineName}</span>
                    <span className="text-muted-foreground font-normal ml-1"> — {p.dosage} ({p.timing}) for {p.durationDays} days</span>
                    {p.instructions && (
                      <p className="text-xs text-muted-foreground font-normal mt-0.5">Note: {p.instructions}</p>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground italic mt-1">No medicines prescribed.</p>
            )}
          </div>

          {data.adviceNotes && (
            <div className="pt-2">
              <p className="text-xs text-muted-foreground mb-1">General Advice</p>
              <p className="font-medium text-foreground text-sm bg-muted/20 p-2.5 rounded-md border border-border/50 whitespace-pre-wrap">
                {data.adviceNotes}
              </p>
            </div>
          )}
        </Card>

        {/* Card 3: Treatment & Procedures */}
        <Card className="p-5 border-border shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider border-b border-border pb-2 flex items-center gap-2">
            <Syringe className="w-4 h-4 text-primary" /> Treatment Details
          </h3>
          
          <div>
            <p className="text-xs text-muted-foreground mb-1">Procedures</p>
            {data.procedures.length > 0 ? (
              <ul className="list-disc pl-5 text-sm font-medium space-y-1 text-foreground mt-1">
                {data.procedures.map(p => (
                  <li key={p.id}>
                    {p.name} 
                    <span className="text-xs text-muted-foreground font-normal ml-2">({p.date})</span>
                    {p.remarks && <span className="text-xs text-muted-foreground font-normal italic ml-1"> - {p.remarks}</span>}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground italic mt-1">No procedures recorded.</p>
            )}
          </div>
        </Card>

        {/* Card 4: Tests & Follow-Up */}
        <Card className="p-5 border-border shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider border-b border-border pb-2 flex items-center gap-2">
            <FlaskConical className="w-4 h-4 text-primary" /> Investigations & Follow-Up
          </h3>
          
          <div>
            <p className="text-xs text-muted-foreground mb-1">Tests Ordered</p>
            {data.tests.length > 0 ? (
              <ul className="list-disc pl-5 text-sm font-medium space-y-1 text-foreground mt-1">
                {data.tests.map(t => (
                  <li key={t.id}>
                    {t.testName} 
                    <span className="text-xs text-muted-foreground font-normal ml-2">[{t.status}]</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground italic mt-1">No tests ordered.</p>
            )}
          </div>

          <div className="pt-3 border-t border-border/50">
            <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1.5">
              <CalendarClock className="w-3.5 h-3.5" /> Follow-Up Schedule
            </p>
            {data.followUps.length > 0 ? (
              <ul className="list-disc pl-5 text-sm font-medium space-y-1 text-foreground mt-1">
                {data.followUps.map(f => (
                  <li key={f.id}>
                    {f.date} <span className="text-xs text-muted-foreground font-normal ml-1">— {f.reason}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground italic mt-1">No follow-up scheduled.</p>
            )}
          </div>
        </Card>

      </div>
    </div>
  );
}