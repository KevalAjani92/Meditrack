"use client";

import { useState } from "react";
import { useFormContext, useFieldArray } from "react-hook-form";
import { PatientRegistrationData, EmergencyContact } from "@/types/patient-registration";
import { Plus, Edit2, Trash2, ShieldAlert } from "lucide-react";
import EmergencyContactModal from "./EmergencyContactModal";

export default function EmergencyContactsStep() {
  const { control, formState: { errors } } = useFormContext<PatientRegistrationData>();
  const { fields, append, update, remove } = useFieldArray({
    control,
    name: "emergencyContacts",
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const handleAdd = (data: EmergencyContact) => {
    if (data.isPrimary) {
      fields.forEach((_, idx) => update(idx, { ...fields[idx], isPrimary: false }));
    }
    append(data);
  };

  const handleUpdate = (data: EmergencyContact) => {
    if (editingIndex !== null) {
      if (data.isPrimary) {
        fields.forEach((_, idx) => update(idx, { ...fields[idx], isPrimary: false }));
      }
      update(editingIndex, data);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">Emergency Contacts</h2>
          <p className="text-sm text-muted-foreground">Add at least one emergency contact.</p>
        </div>
        <button 
          type="button"
          onClick={(e) => { e.preventDefault(); setEditingIndex(null); setIsModalOpen(true); }}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary text-sm font-medium rounded-md hover:bg-primary/20 transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Contact
        </button>
      </div>

      {fields.length === 0 ? (
        <div className="p-8 border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center text-center bg-muted/10">
          <ShieldAlert className="w-8 h-8 text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground">No emergency contacts added yet.</p>
          {errors.emergencyContacts && <p className="text-xs text-destructive mt-1">{errors.emergencyContacts.message}</p>}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {fields.map((contact, index) => (
            <div key={contact.id} className="p-4 rounded-xl border border-border bg-card shadow-sm hover:shadow-md transition-all group relative">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-foreground">{contact.name}</h3>
                  {contact.isPrimary && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-success/10 text-success border border-success/20">
                      Primary
                    </span>
                  )}
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button type="button" onClick={(e) => { e.preventDefault(); setEditingIndex(index); setIsModalOpen(true); }} className="p-1.5 text-muted-foreground hover:text-primary rounded-md hover:bg-primary/10">
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button type="button" onClick={(e) => { e.preventDefault(); remove(index); }} className="p-1.5 text-muted-foreground hover:text-destructive rounded-md hover:bg-destructive/10">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-1">{contact.relation}</p>
              <p className="font-mono text-sm font-medium text-foreground">{contact.phone}</p>
            </div>
          ))}
        </div>
      )}

      <EmergencyContactModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        onSave={(data) => {
          editingIndex !== null ? handleUpdate(data) : handleAdd(data);
          setIsModalOpen(false);
        }}
        defaultValues={editingIndex !== null ? fields[editingIndex] : undefined}
      />
    </div>
  );
}