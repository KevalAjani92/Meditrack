"use client";

import { useState } from "react";
import { PhoneCall, Plus, Edit2, ShieldAlert } from "lucide-react";
import { EmergencyContact } from "@/types/patient";
import EmergencyContactsModal from "./EmergencyContactsModal";

export default function EmergencyContactsSection({ contacts, onChanged }: { contacts: EmergencyContact[]; onChanged: () => void }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<EmergencyContact | undefined>(undefined);

  const handleAdd = () => {
    setSelectedContact(undefined);
    setIsModalOpen(true);
  };

  const handleEdit = (contact: EmergencyContact) => {
    setSelectedContact(contact);
    setIsModalOpen(true);
  };

  const handleSaved = () => {
    setIsModalOpen(false);
    onChanged();
  };

  return (
    <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between border-b border-border pb-3 mb-5">
        <div className="flex items-center gap-2">
          <PhoneCall className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">Emergency Contacts</h2>
        </div>
        <button
          onClick={handleAdd}
          className="text-sm font-medium text-primary hover:text-primary/80 flex items-center gap-1 transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Contact
        </button>
      </div>

      {contacts.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-6">No emergency contacts added yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {contacts.map((contact) => (
            <div key={contact.id} className="relative p-4 rounded-lg border border-border bg-muted/10 hover:bg-muted/30 transition-colors">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-foreground">{contact.name}</h3>
                  {contact.isPrimary && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-destructive/10 text-destructive border border-destructive/20 flex items-center gap-1">
                      <ShieldAlert className="w-3 h-3" /> Primary
                    </span>
                  )}
                </div>
                <button onClick={() => handleEdit(contact)} className="text-muted-foreground hover:text-primary transition-colors p-1">
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-sm text-muted-foreground mb-1">Relation: {contact.relation}</p>
              <p className="font-mono text-sm text-foreground">{contact.phone}</p>
            </div>
          ))}
        </div>
      )}

      <EmergencyContactsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        defaultValues={selectedContact}
        onSaved={handleSaved}
      />
    </div>
  );
}