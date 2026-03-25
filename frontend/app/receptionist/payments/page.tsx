"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import PaymentStats from "@/components/receptionist/payments/PaymentStats";
import PaymentFilters from "@/components/receptionist/payments/PaymentFilters";
import QuickDateFilters from "@/components/receptionist/payments/QuickDateFilters";
import PaymentsTable from "@/components/receptionist/payments/PaymentsTable";
import PaymentDetailModal from "@/components/receptionist/payments/PaymentDetailModal";
import {Pagination} from "@/components/ui/Pagination";
import { Payment, PaymentStats as PaymentStatsType } from "@/types/payment";
import { billingPaymentsService } from "@/services/billing-payments.service";
import { useToast } from "@/components/ui/toast";

// TODO: Get from auth context
const HOSPITAL_ID = 1;
const getToday = () => new Date().toISOString().split("T")[0];

const defaultFilters = {
  search: "",
  fromDate: getToday(),
  toDate: getToday(),
  mode: "All",
  status: "All",
};
export default function PaymentsPage() {
  const {addToast} = useToast();
  const router = useRouter();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [stats, setStats] = useState<PaymentStatsType>({ todaysRevenue: 0, todaysPayments: 0, pending: 0, success: 0, failed: 0 });
  const [filters, setFilters] = useState(defaultFilters);
  const [appliedFilters, setAppliedFilters] = useState(defaultFilters);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [quickFilter, setQuickFilter] = useState<number | null>(0);

  const fetchPayments = useCallback(async () => {
    try {
      setLoading(true);
      const data = await billingPaymentsService.getPayments(HOSPITAL_ID, {
        page,
        limit: 10,
        search: appliedFilters.search || undefined,
        fromDate: appliedFilters.fromDate || undefined,
        toDate: appliedFilters.toDate || undefined,
        mode: appliedFilters.mode !== "All" ? appliedFilters.mode : undefined,
        status: appliedFilters.status !== "All" ? appliedFilters.status : undefined,
      });

      setPayments(data.data || []);
      setTotalPages(data.meta?.totalPages || 1);
      setStats(data.stats || stats);
    } catch (err: any) {
      addToast(err?.message || "Failed to load payments","error");
    } finally {
      setLoading(false);
    }
  }, [page, appliedFilters]);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  const handleApplyFilters = () => {
    setPage(1);
    setAppliedFilters({ ...filters });
  };

  // const handleResetFilters = () => {
  //   setFilters(defaultFilters);
  //   setAppliedFilters(defaultFilters);
  //   setPage(1);
  //   setQuickFilter(null);
  // };

  const handleResetFilters = () => {
  const today = getToday();

  const reset = {
    ...defaultFilters,
    fromDate: today,
    toDate: today,
  };

  setFilters(reset);
  setAppliedFilters(reset);
  setQuickFilter(0); // highlight Today
  setPage(1);
};

  const handleQuickDate = (from: string, to: string,days:number) => {
    const updated = { ...filters, fromDate: from, toDate: to };
    setFilters(updated);
    setAppliedFilters(updated);
    setPage(1);
    setQuickFilter(days)
  };

  const handleAction = async (action: string, payment: Payment) => {
    switch (action) {
      case "view":
        setSelectedPayment(payment);
        setShowModal(true);
        break;
      case "bill":
        router.push(`/receptionist/billing/print/${payment.billId}`);
        break;
      case "print":
        router.push(`/receptionist/payments/print/${payment.id}`);
        break;
      case "download":
        try {
          const res = await billingPaymentsService.downloadReceiptPdf(HOSPITAL_ID, payment.id);
          const pdfData = res.data || res; 
          const blob = new Blob([pdfData], { type: "application/pdf" });
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download",`receipt-${payment.paymentId}.pdf`);
          document.body.appendChild(link);
          link.click();

          // Cleanup
          link.parentNode?.removeChild(link);
          URL.revokeObjectURL(url);
          addToast("Receipt PDF downloaded","success");
        } catch(error) {
          addToast("Failed to download PDF","error");
        }
        break;
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto py-6 px-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Payments</h1>
          <p className="text-sm text-muted-foreground mt-0.5">View, filter & manage all payment transactions</p>
        </div>
      </div>

      <PaymentStats stats={stats} loading={loading} />
      <QuickDateFilters onSelectRange={handleQuickDate} selected={quickFilter} />
      <PaymentFilters 
        filters={filters} 
        setFilters={setFilters} 
        onApply={handleApplyFilters} 
        onReset={handleResetFilters} 
      />

      <PaymentsTable data={payments} onAction={handleAction} />

      <div className="mt-6 flex justify-center">
        <Pagination 
          currentPage={page} 
          totalPages={totalPages} 
          onPageChange={setPage} 
        />
      </div>

      <PaymentDetailModal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)} 
        payment={selectedPayment} 
      />
    </div>
  );
}