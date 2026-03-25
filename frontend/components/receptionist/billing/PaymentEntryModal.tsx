"use client";

import { useEffect, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PaymentMode } from "@/types/billing";
import { billingPaymentsService } from "@/services/billing-payments.service";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  maxAmount: number;
  onAdd: (data: { payment_mode_id: number; amount: number; reference_number: string }) => void;
}

export default function PaymentEntryModal({ isOpen, onClose, maxAmount, onAdd }: Props) {
  const [modes, setModes] = useState<PaymentMode[]>([]);
  const [selectedModeId, setSelectedModeId] = useState<number>(0);
  const [amount, setAmount] = useState<number>(maxAmount);
  const [reference, setReference] = useState("");
  const [loadingModes, setLoadingModes] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) {
      setAmount(maxAmount);
      setReference("");
      setErrors({});
      fetchModes();
    }
  }, [isOpen, maxAmount]);

  const fetchModes = async () => {
    try {
      setLoadingModes(true);
      const res = await billingPaymentsService.getPaymentModes();
      setModes(res || []);
      if (res?.length > 0) {
        setSelectedModeId(res[0].paymentModeId);
      }
    } catch {
      setModes([]);
    } finally {
      setLoadingModes(false);
    }
  };

  const selectedMode = modes.find(m => m.paymentModeId === selectedModeId);

  const handleSubmit = () => {
    const newErrors: Record<string, string> = {};
    if (!selectedModeId) newErrors.mode = "Select a payment mode";
    if (!amount || amount <= 0) newErrors.amount = "Amount must be greater than 0";
    if (amount > maxAmount) newErrors.amount = `Amount cannot exceed ₹${maxAmount.toFixed(2)}`;
    if (selectedMode?.requiresReference && !reference.trim()) {
      newErrors.reference = `Reference number is required for ${selectedMode.paymentModeName}`;
    }
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      onAdd({ payment_mode_id: selectedModeId, amount, reference_number: reference });
      onClose();
    }
  };

  const inputClass = "w-full px-3 py-2 text-sm border border-input rounded-md bg-background focus:ring-1 focus:ring-primary outline-none";

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 animate-in fade-in duration-200" />
        <Dialog.Content className="fixed left-[50%] top-[50%] z-50 w-full max-w-md translate-x-[-50%] translate-y-[-50%] rounded-2xl bg-card p-6 shadow-xl border border-border animate-in fade-in zoom-in-95 duration-200">
          <Dialog.Title className="text-lg font-bold text-foreground flex items-center gap-2 mb-4">
            <CreditCard className="w-5 h-5 text-primary" /> Record Payment
          </Dialog.Title>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Payment Mode*</label>
              <select 
                className={inputClass} 
                value={selectedModeId} 
                onChange={(e) => setSelectedModeId(Number(e.target.value))}
                disabled={loadingModes}
              >
                {loadingModes ? (
                  <option>Loading...</option>
                ) : (
                  modes.map(m => (
                    <option key={m.paymentModeId} value={m.paymentModeId}>
                      {m.paymentModeName}
                    </option>
                  ))
                )}
              </select>
              {errors.mode && <p className="text-xs text-destructive mt-1">{errors.mode}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Amount (₹)*</label>
              <input 
                type="number" step="0.01" min="0.01" max={maxAmount}
                value={amount} 
                onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                className={inputClass} 
                placeholder={`Max: ₹${maxAmount.toFixed(2)}`} 
              />
              {errors.amount && <p className="text-xs text-destructive mt-1">{errors.amount}</p>}
              <p className="text-xs text-muted-foreground mt-1">Remaining balance: ₹{maxAmount.toFixed(2)}</p>
            </div>

            {selectedMode?.requiresReference && (
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Reference Number*</label>
                <input 
                  type="text" 
                  value={reference} 
                  onChange={(e) => setReference(e.target.value)}
                  className={inputClass} 
                  placeholder="Transaction/Reference ID" 
                />
                {errors.reference && <p className="text-xs text-destructive mt-1">{errors.reference}</p>}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-border">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button onClick={handleSubmit}>Record Payment</Button>
          </div>

          <button onClick={onClose} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
            <X className="w-5 h-5" />
          </button>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}