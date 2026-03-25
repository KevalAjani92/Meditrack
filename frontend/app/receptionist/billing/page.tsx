"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import OpdSearchSection from "@/components/receptionist/billing/OpdSearchSection";
import PatientVisitSummaryCard from "@/components/receptionist/billing/PatientVisitSummaryCard";
import BillItemsTable from "@/components/receptionist/billing/BillItemsTable";
import MedicineBillingSection from "@/components/receptionist/billing/MedicineBillingSection";
import BillSummaryCard from "@/components/receptionist/billing/BillSummaryCard";
import PaymentSection from "@/components/receptionist/billing/PaymentSection";
import AddBillItemModal from "@/components/receptionist/billing/AddBillItemModal";
import PaymentEntryModal from "@/components/receptionist/billing/PaymentEntryModal";
import { OpdVisit, BillItem, MedicineItem, PaymentEntry, ExistingBill } from "@/types/billing";
import { billingService } from "@/services/billing.service";
import { billingPaymentsService } from "@/services/billing-payments.service";
import { Button } from "@/components/ui/button";
import { Save, CheckCircle, Edit3, Printer, FileDown, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/toast";

// TODO: Get from auth context
const HOSPITAL_ID = 1;

export default function BillingPage() {
  const router = useRouter();
  const {addToast} = useToast();
  const [selectedVisit, setSelectedVisit] = useState<OpdVisit | null>(null);
  const [serviceItems, setServiceItems] = useState<BillItem[]>([]);
  const [medicineItems, setMedicineItems] = useState<MedicineItem[]>([]);
  const [payments, setPayments] = useState<PaymentEntry[]>([]);
  const [existingBill, setExistingBill] = useState<ExistingBill | null>(null);

  const [taxPercent, setTaxPercent] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [billStatus, setBillStatus] = useState<"Draft" | "Finalized">("Draft");
  const [loading, setLoading] = useState(false);

  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const isReadOnly = billStatus === "Finalized";

  // Calculate bill amounts
  const subtotal = useMemo(() => {
    const serviceTotal = serviceItems.reduce((sum, i) => sum + i.quantity * i.unitPrice, 0);
    const medTotal = medicineItems.reduce((sum, i) => sum + i.quantity * i.unitPrice, 0);
    return serviceTotal + medTotal;
  }, [serviceItems, medicineItems]);

  const taxAmount = (subtotal * taxPercent) / 100;
  const totalAmount = subtotal + taxAmount - discount;
  const totalPaid = payments.reduce((sum, p) => sum + p.amountPaid, 0);
  const balanceDue = totalAmount - totalPaid;

  const handleSelectVisit = async (visit: OpdVisit) => {
    setSelectedVisit(visit);
    setServiceItems([]);
    setMedicineItems([]);
    setPayments([]);
    setExistingBill(null);
    setTaxPercent(0);
    setDiscount(0);
    setBillStatus("Draft");

    try {
      setLoading(true);
      const data = await billingService.getVisitDetails(HOSPITAL_ID, visit.opdId);
      

      if (data.existingBill) {
        // Load existing bill
        const bill = data.existingBill;
        setExistingBill(bill);

        const sItems = bill.billItems.filter((i: BillItem) => i.itemType !== "Medicine");
        const mItems = bill.billItems.filter((i: BillItem) => i.itemType === "Medicine").map((i: BillItem) => ({
          ...i,
          medicineCode: "",
          medicineType: "",
          strength: "",
          manufacturer: "-",
          dosage: "",
          durationDays: 0,
        }));

        setServiceItems(sItems);
        setMedicineItems(mItems);
        setPayments(bill.payments || []);
        setTaxPercent(bill.subtotalAmount > 0 ? ((bill.taxAmount / bill.subtotalAmount) * 100) : 0);
        setDiscount(bill.discountAmount);
        setBillStatus(bill.billingStatus === "Finalized" ? "Finalized" : "Draft");
      } else {
        // Load auto-collected items for new bill
        setServiceItems(data.serviceItems || []);
        setMedicineItems(data.medicineItems || []);
        setBillStatus("Draft");
      }
    } catch (err: any) {
      addToast(err?.message || "Failed to load visit details","error");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveBill = async () => {
    if (!selectedVisit) return;

    const allItems = [
      ...serviceItems.map(i => ({
        item_type: i.itemType,
        reference_id: i.referenceId ?? undefined,
        item_description: i.itemDescription,
        quantity: i.quantity,
        unit_price: i.unitPrice,
      })),
      ...medicineItems.map(i => ({
        item_type: "Medicine" as const,
        reference_id: i.referenceId ?? undefined,
        item_description: i.itemDescription,
        quantity: i.quantity,
        unit_price: i.unitPrice,
      })),
    ];

    if (allItems.length === 0) {
      addToast("Add at least one bill item before saving","error");
      return;
    }

    try {
      setLoading(true);
      const res = await billingService.createBill(HOSPITAL_ID, {
        visit_id: selectedVisit.opdId,
        bill_items: allItems,
        tax_amount: taxAmount,
        discount_amount: discount,
      });
      addToast(`Bill created: ${res.data.billNumber}`,"success");
      setExistingBill({ ...existingBill!, billId: res.data.billId, billNumber: res.data.billNumber } as ExistingBill);
      // Reload visit details to get full bill
      handleSelectVisit({ ...selectedVisit, status: "Billed", billId: res.data.billId });
    } catch (err: any) {
      addToast(err?.message || "Failed to create bill","error");
    } finally {
      setLoading(false);
    }
  };

  const handleFinalizeBill = async () => {
    if (!existingBill) return;

    try {
      setLoading(true);
      await billingService.finalizeBill(HOSPITAL_ID, existingBill.billId);
      addToast("Bill finalized successfully","success");
      setBillStatus("Finalized");
      // Reload to reflect changes
      if (selectedVisit) {
        handleSelectVisit(selectedVisit);
      }
    } catch (err: any) {
      addToast(err?.message || "Failed to finalize bill","success");
    } finally {
      setLoading(false);
    }
  };

  const handleRecordPayment = async (data: { payment_mode_id: number; amount: number; reference_number: string }) => {
    if (!existingBill) return;

    try {
      setLoading(true);
      await billingPaymentsService.recordPayment(HOSPITAL_ID, {
        bill_id: existingBill.billId,
        payment_mode_id: data.payment_mode_id,
        amount_paid: data.amount,
        reference_number: data.reference_number || undefined,
      });
      addToast("Payment recorded successfully","success");
      // Reload bill to reflect payment
      if (selectedVisit) {
        handleSelectVisit(selectedVisit);
      }
    } catch (err: any) {
      addToast(err?.message || "Failed to record payment","error");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateServiceItem = (index: number, field: "quantity" | "unitPrice", value: number) => {
    setServiceItems(prev => prev.map((item, i) => i === index ? { ...item, [field]: value } : item));
  };

  const handleUpdateMedicineItem = (index: number, field: "quantity" | "unitPrice", value: number) => {
    setMedicineItems(prev => prev.map((item, i) => i === index ? { ...item, [field]: value } : item));
  };

  const handleRemoveServiceItem = (index: number) => {
    setServiceItems(prev => prev.filter((_, i) => i !== index));
  };

  const handleRemoveMedicineItem = (index: number) => {
    setMedicineItems(prev => prev.filter((_, i) => i !== index));
  };

  const handleModifyBill = () => {
    setBillStatus("Draft");
  };

  return (
    <div className="w-full max-w-7xl mx-auto py-6 px-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Billing</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Generate & manage patient bills</p>
        </div>
      </div>

      <OpdSearchSection hospitalId={HOSPITAL_ID} onSelectVisit={handleSelectVisit} />

      {loading && (
        <div className="flex items-center justify-center py-12 text-muted-foreground gap-2">
          <Loader2 className="w-5 h-5 animate-spin" /> Loading...
        </div>
      )}

      {selectedVisit && !loading && (
        <>
          <PatientVisitSummaryCard visit={selectedVisit} />

          <BillItemsTable
            items={serviceItems}
            isReadOnly={isReadOnly}
            onUpdateItem={handleUpdateServiceItem}
            onRemoveItem={handleRemoveServiceItem}
            onOpenAddModal={() => setShowAddItemModal(true)}
          />

          <MedicineBillingSection
            items={medicineItems}
            isReadOnly={isReadOnly}
            onUpdateItem={handleUpdateMedicineItem}
            onRemoveItem={handleRemoveMedicineItem}
          />

          <BillSummaryCard
            subtotal={subtotal}
            taxPercent={taxPercent}
            discount={discount}
            isReadOnly={isReadOnly}
            onTaxChange={setTaxPercent}
            onDiscountChange={setDiscount}
          />

          <PaymentSection
            totalAmount={totalAmount}
            payments={payments}
            isFinalized={billStatus === "Finalized"}
            onOpenPaymentModal={() => setShowPaymentModal(true)}
          />

          {/* Action Buttons */}
          <div className="flex flex-wrap justify-end gap-3 mt-6 pb-8">
            {billStatus === "Draft" && !existingBill && (
              <Button onClick={handleSaveBill} className="gap-2" disabled={loading}>
                <Save className="w-4 h-4" /> Save Draft
              </Button>
            )}
            {billStatus === "Draft" && existingBill && (
              <Button onClick={handleFinalizeBill} className="gap-2" disabled={loading}>
                <CheckCircle className="w-4 h-4" /> Finalize Bill
              </Button>
            )}
            {billStatus === "Finalized" && (
              <>
                <Button variant="outline" onClick={handleModifyBill} className="gap-2">
                  <Edit3 className="w-4 h-4" /> Modify Bill
                </Button>
                <Button variant="outline" 
                  onClick={() => existingBill && router.push(`/receptionist/billing/print/${existingBill.billId}`)} 
                  className="gap-2"
                >
                  <Printer className="w-4 h-4" /> Preview / Print
                </Button>
                <Button 
                  onClick={async () => {
                    if (!existingBill) return;
                    try {
                      const res = await billingService.downloadBillPdf(HOSPITAL_ID, existingBill.billId);
                      const pdfData = res.data || res; 
                      const blob = new Blob([pdfData], { type: "application/pdf" });
                      const url = URL.createObjectURL(blob);
                      const link = document.createElement("a");
                      link.href = url;
                      link.setAttribute("download",`bill-${existingBill.billNumber}.pdf`);
                      document.body.appendChild(link);
                      link.click();
                      // Cleanup
                      link.parentNode?.removeChild(link);  
                      URL.revokeObjectURL(url);
                      addToast("Bill PDF downloaded","success");
                    } catch {
                      addToast("Failed to download PDF","error");
                    }
                  }}
                  className="gap-2"
                >
                  <FileDown className="w-4 h-4" /> Download PDF
                </Button>
              </>
            )}
          </div>

          {/* Modals */}
          <AddBillItemModal
            isOpen={showAddItemModal}
            onClose={() => setShowAddItemModal(false)}
            onAdd={(item) => {
              setServiceItems(prev => [...prev, {
                itemType: item.type as BillItem["itemType"],
                itemDescription: item.desc,
                quantity: item.qty,
                unitPrice: item.price,
              }]);
            }}
          />

          <PaymentEntryModal
            isOpen={showPaymentModal}
            onClose={() => setShowPaymentModal(false)}
            maxAmount={balanceDue > 0 ? balanceDue : 0}
            onAdd={handleRecordPayment}
          />
        </>
      )}
    </div>
  );
}