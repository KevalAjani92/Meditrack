"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, CheckCircle, Printer, Download, Save, Edit2, X } from "lucide-react";

import OpdSearchSection from "@/components/receptionist/billing/OpdSearchSection";
import PatientVisitSummaryCard from "@/components/receptionist/billing/PatientVisitSummaryCard";
import BillItemsTable from "@/components/receptionist/billing/BillItemsTable";
import MedicineBillingSection from "@/components/receptionist/billing/MedicineBillingSection";
import BillSummaryCard from "@/components/receptionist/billing/BillSummaryCard";
import PaymentSection from "@/components/receptionist/billing/PaymentSection";
import AddBillItemModal from "@/components/receptionist/billing/AddBillItemModal";
import PaymentEntryModal from "@/components/receptionist/billing/PaymentEntryModal";

import { 
  OpdVisit, BillItem, MedicineItem, PaymentEntry, BillStatus, 
  mockInitialBillItems, mockInitialMedicines, mockBilledItems, mockBilledPayments 
} from "@/types/billing";

export default function BillingIntegrationPage() {
  const [selectedVisit, setSelectedVisit] = useState<OpdVisit | null>(null);
  const [billStatus, setBillStatus] = useState<BillStatus>("Draft");
  
  // Track if we are editing an already finalized bill
  const [isModifying, setIsModifying] = useState(false);

  // Arrays
  const [billItems, setBillItems] = useState<BillItem[]>([]);
  const [medicines, setMedicines] = useState<MedicineItem[]>([]);
  const [payments, setPayments] = useState<PaymentEntry[]>([]);

  // Summary Inputs
  const [taxPct, setTaxPct] = useState(5);
  const [discountAmt, setDiscountAmt] = useState(0);

  // Modals
  const [isItemModalOpen, setItemModalOpen] = useState(false);
  const [isPaymentModalOpen, setPaymentModalOpen] = useState(false);

  // Triggered when search selects a visit
  const handleSelectVisit = (visit: OpdVisit) => {
    setSelectedVisit(visit);
    setIsModifying(false); // Reset modifying state on new selection

    if (visit.status === "Billed") {
      setBillStatus("Finalized");
      setBillItems([...mockBilledItems]);
      setMedicines([]); // Mock empty meds for this specific patient
      setPayments([...mockBilledPayments]);
    } else {
      setBillStatus("Draft");
      setBillItems([...mockInitialBillItems]);
      setMedicines([...mockInitialMedicines]);
      setPayments([]);
    }
    setTaxPct(5);
    setDiscountAmt(0);
  };

  // Modifying Handlers
  const handleModifyBill = () => {
    setIsModifying(true);
    setBillStatus("Draft"); // Unlocks the tables
  };

  const handleCancelModification = () => {
    setIsModifying(false);
    setBillStatus("Finalized");
    // In a real app, you would refetch or restore original items here
    console.log("Reverted to original bill state");
  };

  const handleSaveChanges = () => {
    setIsModifying(false);
    setBillStatus("Finalized");
    console.log("Saved modifications to database.");
  };

  // Updaters for Tables
  const updateBillItem = (id: string, field: "quantity"|"unitPrice", val: number) => {
    setBillItems(prev => prev.map(item => item.id === id ? { ...item, [field]: val } : item));
  };
  const removeBillItem = (id: string) => setBillItems(prev => prev.filter(item => item.id !== id));
  
  const updateMedItem = (id: string, field: "quantity"|"unitPrice", val: number) => {
    setMedicines(prev => prev.map(item => item.id === id ? { ...item, [field]: val } : item));
  };
  const removeMedItem = (id: string) => setMedicines(prev => prev.filter(item => item.id !== id));

  // Calculations
  const itemsSubtotal = billItems.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0);
  const medsSubtotal = medicines.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0);
  const totalSubtotal = itemsSubtotal + medsSubtotal;
  
  const taxAmount = (totalSubtotal * taxPct) / 100;
  const totalAmount = totalSubtotal + taxAmount - discountAmt;
  
  const paidAmount = payments.reduce((acc, pay) => acc + pay.amount, 0);
  const remainingAmount = Math.max(0, totalAmount - paidAmount);

  // UI Lock state
  const isReadOnly = billStatus !== "Draft";
  const isFinalized = billStatus === "Finalized";

  return (
    <main className="min-h-full bg-background p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Billing & Invoice</h1>
        <p className="text-muted-foreground">Generate and manage patient bills, prescriptions, and payments.</p>
      </div>

      <OpdSearchSection onSelectVisit={handleSelectVisit} />

      {selectedVisit && (
        <div className="animate-in fade-in duration-500">
          
          {/* Status Header */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-foreground">
              {isModifying ? "Modifying Invoice" : "Active Invoice"}
            </h2>
            <Badge variant="outline" className={`px-3 py-1 uppercase tracking-widest text-xs font-bold ${
               billStatus === 'Draft' ? 'bg-warning/10 text-warning border-warning/20' : 
               billStatus === 'Finalized' ? 'bg-success/10 text-success border-success/20' : 
               'bg-destructive/10 text-destructive border-destructive/20'
            }`}>
              Status: {isModifying ? "EDITING" : billStatus}
            </Badge>
          </div>

          <PatientVisitSummaryCard visit={selectedVisit} />

          {/* Warning Banner */}
          {billStatus === "Draft" && !isModifying && selectedVisit.indicators.testsOrdered && (
             <div className="mb-6 p-3 bg-warning/10 border border-warning/20 rounded-lg flex gap-2 text-sm text-warning-foreground items-center">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span className="font-medium">Unbilled Clinical Items:</span> Ensure all newly ordered lab tests and procedures have been added to the bill below.
             </div>
          )}

          <BillItemsTable 
            items={billItems} isReadOnly={isReadOnly} 
            onUpdateItem={updateBillItem} onRemoveItem={removeBillItem} 
            onOpenAddModal={() => setItemModalOpen(true)} 
          />

          <MedicineBillingSection 
            items={medicines} isReadOnly={isReadOnly} 
            onUpdateItem={updateMedItem} onRemoveItem={removeMedItem} 
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <BillSummaryCard 
              subtotal={totalSubtotal} taxPct={taxPct} discountAmt={discountAmt} total={totalAmount} 
              isReadOnly={isReadOnly} onUpdateTax={setTaxPct} onUpdateDiscount={setDiscountAmt} 
            />
            <PaymentSection 
              total={totalAmount} paidAmount={paidAmount} remainingAmount={remainingAmount} 
              payments={payments} isFinalized={isFinalized} onOpenPaymentModal={() => setPaymentModalOpen(true)} 
            />
          </div>

          {/* Action Bar */}
          <div className="sticky bottom-4 z-10 bg-card/95 backdrop-blur-md border border-border p-4 rounded-xl shadow-lg flex flex-wrap items-center justify-between gap-4">
             <div className="flex gap-3">
               
               {/* State 1: New Draft Bill */}
               {!isFinalized && !isModifying && (
                 <>
                   <Button variant="outline" className="gap-2" onClick={() => console.log("Saved Draft")}><Save className="w-4 h-4" /> Save Draft</Button>
                   <Button className="gap-2 bg-success hover:bg-success/90 text-success-foreground" onClick={() => setBillStatus("Finalized")}><CheckCircle className="w-4 h-4" /> Finalize Bill</Button>
                 </>
               )}

               {/* State 2: Modifying an Existing Bill */}
               {!isFinalized && isModifying && (
                 <>
                   <Button variant="outline" className="gap-2" onClick={handleCancelModification}><X className="w-4 h-4" /> Cancel Modifying</Button>
                   <Button className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground" onClick={handleSaveChanges}><Save className="w-4 h-4" /> Save Changes</Button>
                 </>
               )}

               {/* State 3: Finalized (Read-Only) */}
               {isFinalized && (
                  <>
                    <Button variant="outline" className="gap-2 text-primary border-primary/30 hover:bg-primary/10" onClick={handleModifyBill}>
                      <Edit2 className="w-4 h-4" /> Modify Bill
                    </Button>
                    {remainingAmount <= 0 && (
                      <Badge variant="outline" className="bg-success/10 text-success border-success/30 px-4 ml-2">PAID IN FULL</Badge>
                    )}
                  </>
               )}

             </div>
             
             <div className="flex gap-3">
                <Button variant="secondary" className="gap-2"><Download className="w-4 h-4" /> PDF</Button>
                <Button variant="secondary" className="gap-2"><Printer className="w-4 h-4" /> Print</Button>
             </div>
          </div>

        </div>
      )}

      {/* Modals */}
      <AddBillItemModal isOpen={isItemModalOpen} onClose={() => setItemModalOpen(false)} onAdd={(item) => setBillItems(prev => [...prev, item])} />
      <PaymentEntryModal isOpen={isPaymentModalOpen} onClose={() => setPaymentModalOpen(false)} onAdd={(pay) => setPayments(prev => [...prev, pay])} maxAmount={remainingAmount} />

    </main>
  );
}