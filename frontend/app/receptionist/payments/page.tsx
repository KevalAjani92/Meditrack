"use client";

import { useState, useMemo } from "react";
import { Pagination } from "@/components/ui/Pagination"; // Assumed existing

import PaymentStats from "@/components/receptionist/payments/PaymentStats";
import PaymentFilters from "@/components/receptionist/payments/PaymentFilters";
import QuickDateFilters from "@/components/receptionist/payments/QuickDateFilters";
import PaymentsTable from "@/components/receptionist/payments/PaymentsTable";
import PaymentDetailModal from "@/components/receptionist/payments/PaymentDetailModal";

import { mockPayments, Payment } from "@/types/payment";

const ITEMS_PER_PAGE = 10;

export default function PaymentsPage() {
  const [filters, setFilters] = useState({
    search: "",
    fromDate: "",
    toDate: "",
    mode: "All",
    status: "All",
    doctor: "All",
  });

  const [appliedFilters, setAppliedFilters] = useState(filters);
  const [currentPage, setCurrentPage] = useState(1);
  
  // Modal State
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);

  // Derived Filtering
  const filteredData = useMemo(() => {
    return mockPayments.filter(p => {
      const q = appliedFilters.search.toLowerCase();
      const matchesSearch = !q || 
        p.patientName.toLowerCase().includes(q) || 
        p.billNumber.toLowerCase().includes(q) || 
        p.paymentId.toLowerCase().includes(q) ||
        p.patientPhone.includes(q);
      
      const matchesMode = appliedFilters.mode === "All" || p.mode === appliedFilters.mode;
      const matchesStatus = appliedFilters.status === "All" || p.status === appliedFilters.status;
      
      const matchesFrom = !appliedFilters.fromDate || p.date >= appliedFilters.fromDate;
      const matchesTo = !appliedFilters.toDate || p.date <= appliedFilters.toDate;

      return matchesSearch && matchesMode && matchesStatus && matchesFrom && matchesTo;
    });
  }, [appliedFilters]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const currentData = filteredData.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handleApply = () => {
    setAppliedFilters(filters);
    setCurrentPage(1);
  };

  const handleReset = () => {
    const resetState = { search: "", fromDate: "", toDate: "", mode: "All", status: "All", doctor: "All" };
    setFilters(resetState);
    setAppliedFilters(resetState);
    setCurrentPage(1);
  };

  const handleQuickDates = (from: string, to: string) => {
    const newState = { ...filters, fromDate: from, toDate: to };
    setFilters(newState);
    setAppliedFilters(newState); // Auto-apply for quick buttons
  };

  const handleAction = (action: string, payment: Payment) => {
    if (action === "view") {
      setSelectedPayment(payment);
    } else {
      console.log(`Action triggered: ${action} on Payment ${payment.paymentId}`);
    }
  };

  return (
    <main className="min-h-full bg-background p-4 sm:p-6 lg:p-8 space-y-6">
      
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Payments & Receipts</h1>
        <p className="text-muted-foreground">Monitor financial transactions, download receipts, and manage billing status.</p>
      </div>

      <PaymentStats data={mockPayments} />

      <div className="pt-2">
        <QuickDateFilters onSelectRange={handleQuickDates} />
        <PaymentFilters 
          filters={filters} 
          setFilters={setFilters} 
          onApply={handleApply} 
          onReset={handleReset} 
        />
      </div>

      <div className="space-y-4">
        <PaymentsTable data={currentData} onAction={handleAction} />
        
        {filteredData.length > 0 && (
          <div className="pt-2 border-t border-border mt-4">
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
          </div>
        )}
      </div>

      <PaymentDetailModal 
        isOpen={selectedPayment !== null} 
        onClose={() => setSelectedPayment(null)} 
        payment={selectedPayment} 
      />

    </main>
  );
}