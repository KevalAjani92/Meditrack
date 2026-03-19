"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X, Edit, Calendar, FlaskConical, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MedicalTest } from "@/types/medical-test";

interface TestDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  test?: MedicalTest;
  onEdit: (test: MedicalTest) => void;
}

export default function TestDetailModal({
  isOpen,
  onClose,
  test,
  onEdit,
}: TestDetailModalProps) {
  if (!test) return null;

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50 animate-in fade-in duration-200" />
        <Dialog.Content className="fixed left-[50%] top-[50%] z-50 w-full max-w-lg translate-x-[-50%] translate-y-[-50%] rounded-xl bg-card p-0 shadow-lg border border-border animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b border-border bg-muted/10 flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-mono text-sm font-bold px-2 py-0.5 bg-primary/10 text-primary rounded border border-primary/20">
                  {test.test_code}
                </span>
                <Badge variant="outline" className="text-muted-foreground">
                  {test.department_name}
                </Badge>
              </div>
              <h2 className="text-xl font-bold text-foreground leading-tight">
                {test.test_name}
              </h2>
            </div>
            <Dialog.Close asChild>
              <button className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </Dialog.Close>
          </div>

          <div className="p-6 space-y-6">
            {/* Status Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Type
                </span>
                <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <FlaskConical className="w-4 h-4 text-blue-500" />
                  {test.test_type}
                </div>
              </div>
              <div className="space-y-1">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Status
                </span>
                <div className="flex items-center gap-2 text-sm text-foreground">
                  <Activity
                    className={`w-4 h-4 ${test.is_active ? "text-success" : "text-muted-foreground"}`}
                  />
                  {test.is_active ? "Active" : "Inactive"}
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Clinical Description
              </span>
              <div className="p-4 bg-muted/20 rounded-lg border border-border text-sm text-foreground leading-relaxed max-h-[150px] overflow-y-auto">
                {test.description || "No description provided."}
              </div>
            </div>

            {/* Metadata */}
            <div className="flex items-center justify-between pt-2 text-xs text-muted-foreground border-t border-border">
              <div className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5" />
                Last Updated:{" "}
                {new Date(test.updated_at).toLocaleString("en-IN", {
                  timeZone: "Asia/Kolkata",
                })}
              </div>
            </div>
          </div>

          <div className="p-4 bg-muted/30 border-t border-border flex justify-end gap-3">
            <Button variant="ghost" onClick={onClose}>
              Close
            </Button>
            <Button onClick={() => onEdit(test)} className="gap-2">
              <Edit className="w-4 h-4" /> Edit Test Configuration
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
