"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { SearchableSelect, SearchableSelectOption } from "@/components/ui/searchable-select";
import { opdConsultationService } from "@/services/opd-consultation.service";
import { Procedure } from "@/types/consultation";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  editData?: Procedure;
}

export default function AddProcedureModal({ isOpen, onClose, onSave, editData }: Props) {
  const [options, setOptions] = useState<SearchableSelectOption[]>([]);
  const [selectedValue, setSelectedValue] = useState("");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [remarks, setRemarks] = useState("");

  useEffect(() => {
    if (isOpen) {
      opdConsultationService.lookupProcedures("").then((res) => {
        setOptions(res.map((d: any) => ({ label: d.label, value: d.value, id: d.id })));
      });
    }
  }, [isOpen]);

  useEffect(() => {
    if (editData) {
      setSelectedValue(`${editData.name}|${editData.code}`);
      setSelectedId(editData.procedureId || editData.id);
      setDate(editData.date);
      setRemarks(editData.remarks);
    } else {
      setSelectedValue("");
      setSelectedId(null);
      setDate(new Date().toISOString().split("T")[0]);
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
    onSave({ procedureId: selectedId, name, code, date, remarks });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{editData ? "Edit" : "Add"} Procedure</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <label className="text-sm font-medium text-foreground">Procedure <span className="text-destructive">*</span></label>
            <SearchableSelect options={options} value={selectedValue} onChange={handleSelectChange} placeholder="Search procedure..." className="mt-1" />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground">Date</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full mt-1 p-2.5 border border-input rounded-md bg-background text-sm" />
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