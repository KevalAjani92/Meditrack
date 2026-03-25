"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { SearchableSelect, SearchableSelectOption } from "@/components/ui/searchable-select";
import { opdConsultationService } from "@/services/opd-consultation.service";
import { Prescription } from "@/types/consultation";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  editData?: Prescription;
}

export default function AddMedicineModal({ isOpen, onClose, onSave, editData }: Props) {
  const [options, setOptions] = useState<SearchableSelectOption[]>([]);
  const [selectedValue, setSelectedValue] = useState("");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [dosage, setDosage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [durationDays, setDurationDays] = useState(7);
  const [instructions, setInstructions] = useState("");
  const [timing, setTiming] = useState("After Meals");

  useEffect(() => {
    if (isOpen) {
      opdConsultationService.lookupMedicines("").then((res) => {
        setOptions(res.map((d: any) => ({ label: d.label, value: d.value, id: d.id })));
      });
    }
  }, [isOpen]);

  useEffect(() => {
    if (editData) {
      setSelectedValue(editData.medicineName);
      setSelectedId(editData.medicineId || editData.id);
      setDosage(editData.dosage);
      setQuantity(editData.quantity);
      setDurationDays(editData.durationDays);
      setInstructions(editData.instructions);
      setTiming(editData.timing);
    } else {
      setSelectedValue("");
      setSelectedId(null);
      setDosage("");
      setQuantity(1);
      setDurationDays(7);
      setInstructions("");
      setTiming("After Meals");
    }
  }, [editData, isOpen]);

  const handleSelectChange = (value: string) => {
    setSelectedValue(value);
    const matched = (options as any[]).find((o) => o.value === value);
    if (matched) setSelectedId(matched.id);
  };

  const handleSave = () => {
    if (!selectedValue || !selectedId || !dosage) return;
    onSave({
      medicineId: selectedId,
      medicineName: selectedValue,
      dosage,
      quantity,
      durationDays,
      instructions,
      timing,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>{editData ? "Edit" : "Add"} Medicine</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <label className="text-sm font-medium text-foreground">Medicine Name <span className="text-destructive">*</span></label>
            <SearchableSelect options={options} value={selectedValue} onChange={handleSelectChange} placeholder="Search medicine..." className="mt-1" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-foreground">Dosage <span className="text-destructive">*</span></label>
              <input value={dosage} onChange={(e) => setDosage(e.target.value)} className="w-full mt-1 p-2.5 border border-input rounded-md bg-background text-sm" placeholder="e.g. 500mg" />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Timing</label>
              <select value={timing} onChange={(e) => setTiming(e.target.value)} className="w-full mt-1 p-2.5 border border-input rounded-md bg-background text-sm">
                <option>Before Meals</option>
                <option>After Meals</option>
                <option>With Meals</option>
                <option>Morning</option>
                <option>Night</option>
                <option>SOS</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-foreground">Quantity</label>
              <input type="number" min={1} value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} className="w-full mt-1 p-2.5 border border-input rounded-md bg-background text-sm" />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Duration (days)</label>
              <input type="number" min={1} value={durationDays} onChange={(e) => setDurationDays(Number(e.target.value))} className="w-full mt-1 p-2.5 border border-input rounded-md bg-background text-sm" />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-foreground">Instructions</label>
            <textarea value={instructions} onChange={(e) => setInstructions(e.target.value)} className="w-full mt-1 p-2.5 border border-input rounded-md bg-background text-sm resize-none h-16" placeholder="Special instructions..." />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave} disabled={!selectedValue || !dosage}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}