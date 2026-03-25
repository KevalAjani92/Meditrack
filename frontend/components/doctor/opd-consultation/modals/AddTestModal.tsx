"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { SearchableSelect, SearchableSelectOption } from "@/components/ui/searchable-select";
import { opdConsultationService } from "@/services/opd-consultation.service";
import { TestOrder } from "@/types/consultation";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  editData?: TestOrder;
}

export default function AddTestModal({ isOpen, onClose, onSave, editData }: Props) {
  const [options, setOptions] = useState<SearchableSelectOption[]>([]);
  const [selectedValue, setSelectedValue] = useState("");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [remarks, setRemarks] = useState("");

  useEffect(() => {
    if (isOpen) {
      opdConsultationService.lookupTests("").then((res) => {
        setOptions(res.map((d: any) => ({ label: d.label, value: d.value, id: d.id })));
      });
    }
  }, [isOpen]);

  useEffect(() => {
    if (editData) {
      setSelectedValue(`${editData.testName}|${editData.code}`);
      setSelectedId(editData.testId || editData.id);
      setRemarks(editData.remarks);
    } else {
      setSelectedValue("");
      setSelectedId(null);
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
    const [testName, code] = selectedValue.split("|");
    onSave({ testId: selectedId, testName, code, remarks, status: "Ordered" });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{editData ? "Edit" : "Order"} Test</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <label className="text-sm font-medium text-foreground">Test <span className="text-destructive">*</span></label>
            <SearchableSelect options={options} value={selectedValue} onChange={handleSelectChange} placeholder="Search test..." className="mt-1" />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground">Remarks / Instructions</label>
            <textarea value={remarks} onChange={(e) => setRemarks(e.target.value)} className="w-full mt-1 p-2.5 border border-input rounded-md bg-background text-sm resize-none h-20" placeholder="Any special instructions..." />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave} disabled={!selectedValue}>Order Test</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}