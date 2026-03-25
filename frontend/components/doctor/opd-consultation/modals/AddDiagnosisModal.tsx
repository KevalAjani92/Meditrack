"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { SearchableSelect, SearchableSelectOption } from "@/components/ui/searchable-select";
import { opdConsultationService } from "@/services/opd-consultation.service";
import { Diagnosis } from "@/types/consultation";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  editData?: Diagnosis;
}

export default function AddDiagnosisModal({ isOpen, onClose, onSave, editData }: Props) {
  const [options, setOptions] = useState<SearchableSelectOption[]>([]);
  const [selectedValue, setSelectedValue] = useState("");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isPrimary, setIsPrimary] = useState(false);
  const [remarks, setRemarks] = useState("");

  // Load diagnosis options from API
  useEffect(() => {
    if (isOpen) {
      opdConsultationService.lookupDiagnoses("").then((res) => {
        setOptions(res.map((d: any) => ({ label: d.label, value: d.value, id: d.id })));
      });
    }
  }, [isOpen]);

  // Populate edit data
  useEffect(() => {
    if (editData) {
      setSelectedValue(`${editData.name}|${editData.code}`);
      setSelectedId(editData.diagnosisId || editData.id);
      setIsPrimary(editData.isPrimary);
      setRemarks(editData.remarks);
    } else {
      setSelectedValue("");
      setSelectedId(null);
      setIsPrimary(false);
      setRemarks("");
    }
  }, [editData, isOpen]);

  const handleSelectChange = (value: string) => {
    setSelectedValue(value);
    const matched = (options as any[]).find((o) => o.value === value);
    if (matched) setSelectedId(matched.id);
  };

  const handleSave = () => {
    if (!selectedValue || !selectedId) return;
    const [name, code] = selectedValue.split("|");
    onSave({
      diagnosisId: selectedId,
      name,
      code,
      isPrimary,
      remarks,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{editData ? "Edit" : "Add"} Diagnosis</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <label className="text-sm font-medium text-foreground">Diagnosis (ICD-10) <span className="text-destructive">*</span></label>
            <SearchableSelect
              options={options}
              value={selectedValue}
              onChange={handleSelectChange}
              placeholder="Search diagnosis..."
              className="mt-1"
            />
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" checked={isPrimary} onChange={(e) => setIsPrimary(e.target.checked)} id="is-primary" className="rounded" />
            <label htmlFor="is-primary" className="text-sm text-foreground">Primary Diagnosis</label>
          </div>
          <div>
            <label className="text-sm font-medium text-foreground">Remarks</label>
            <textarea value={remarks} onChange={(e) => setRemarks(e.target.value)} className="w-full mt-1 p-2.5 border border-input rounded-md bg-background text-sm resize-none h-20" placeholder="Optional notes..." />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave} disabled={!selectedValue}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}