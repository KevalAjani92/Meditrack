"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FollowUp } from "@/types/consultation";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  editData?: FollowUp;
}

export default function AddFollowupModal({ isOpen, onClose, onSave, editData }: Props) {
  const [date, setDate] = useState("");
  const [reason, setReason] = useState("");
  const [daysFromNow, setDaysFromNow] = useState<number | "">(7);

  useEffect(() => {
    if (editData) {
      setDate(editData.date);
      setReason(editData.reason);
      setDaysFromNow("");
    } else {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 7);
      setDate(futureDate.toISOString().split("T")[0]);
      setReason("");
      setDaysFromNow(7);
    }
  }, [editData, isOpen]);

  const handleDaysChange = (days: number) => {
    setDaysFromNow(days);
    if (days > 0) {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + days);
      setDate(futureDate.toISOString().split("T")[0]);
    }
  };

  const handleSave = () => {
    if (!date || !reason) return;
    onSave({ date, reason, status: "Pending" });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>{editData ? "Edit" : "Schedule"} Follow-Up</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <label className="text-sm font-medium text-foreground">Quick Select (Days from today)</label>
            <div className="flex gap-2 mt-2">
              {[3, 7, 14, 30, 60, 90].map((d) => (
                <button
                  key={d}
                  onClick={() => handleDaysChange(d)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md border transition-colors ${
                    daysFromNow === d
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background border-input text-foreground hover:bg-muted"
                  }`}
                >
                  {d}d
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-foreground">Follow-Up Date <span className="text-destructive">*</span></label>
            <input type="date" value={date} onChange={(e) => { setDate(e.target.value); setDaysFromNow(""); }} className="w-full mt-1 p-2.5 border border-input rounded-md bg-background text-sm" />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground">Reason <span className="text-destructive">*</span></label>
            <textarea value={reason} onChange={(e) => setReason(e.target.value)} className="w-full mt-1 p-2.5 border border-input rounded-md bg-background text-sm resize-none h-20" placeholder="Reason for follow-up..." />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave} disabled={!date || !reason}>Schedule</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}