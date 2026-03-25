"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Download, Printer, Loader2, CheckCircle2, AlertTriangle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { billingPaymentsService } from "@/services/billing-payments.service";
import { useToast } from "@/components/ui/toast";

const HOSPITAL_ID = 1;

export default function ReceiptPrintPage({ params }: { params: Promise<{ paymentId: string }> }) {
  const {addToast} = useToast();
  const resolvedParams = use(params);
  const paymentId = parseInt(resolvedParams.paymentId);
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await billingPaymentsService.getReceiptPrintData(HOSPITAL_ID, paymentId);
        setData(res);
      } catch {
        addToast("Failed to load receipt data","error");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [paymentId]);

  const handleDownload = async () => {
    try {
      const res = await billingPaymentsService.downloadReceiptPdf(HOSPITAL_ID, paymentId);
      const pdfData = res.data || res; 
      const blob = new Blob([pdfData], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `receipt-${data?.payment?.paymentDisplayId || paymentId}.pdf`);
      document.body.appendChild(link);
      link.click();

      // Cleanup
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
      addToast("Receipt PDF downloaded","success");
    } catch {
      addToast("Failed to download PDF","error");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-muted-foreground gap-2">
        <Loader2 className="w-5 h-5 animate-spin" /> Loading receipt...
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-screen text-muted-foreground">
        Receipt not found.
      </div>
    );
  }

  const StatusIcon = data.payment.paymentStatus === "Success" ? CheckCircle2 : data.payment.paymentStatus === "Failed" ? AlertTriangle : Clock;
  const statusColor = data.payment.paymentStatus === "Success" ? "text-green-600 bg-green-50 border-green-200" : data.payment.paymentStatus === "Failed" ? "text-red-600 bg-red-50 border-red-200" : "text-amber-600 bg-amber-50 border-amber-200";

  return (
    <>
      {/* Action bar */}
      <div className="print:hidden sticky top-0 z-20 bg-background border-b border-border px-4 py-3 flex items-center justify-between">
        <Button variant="ghost" onClick={() => router.back()} className="gap-2">
          <ArrowLeft className="w-4 h-4" /> Back
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleDownload} className="gap-2">
            <Download className="w-4 h-4" /> Download PDF
          </Button>
          <Button onClick={() => window.print()} className="gap-2">
            <Printer className="w-4 h-4" /> Print
          </Button>
        </div>
      </div>

      {/* Receipt Preview */}
      <div className="max-w-md mx-auto py-8 px-4 print:max-w-full print:p-0 print:py-4">
        <div className="bg-white text-gray-900 rounded-xl border border-gray-200 shadow-lg overflow-hidden print:shadow-none print:border-0">
          
          {/* Header */}
          <div className="text-center border-b-[3px] border-teal-700 p-5 pb-3">
            <h1 className="text-lg font-extrabold text-teal-700 tracking-wide">{data.hospital.name}</h1>
            <p className="text-[9px] text-gray-500 mt-1">{data.hospital.address}</p>
            <p className="text-[9px] text-gray-500">Phone: {data.hospital.phone} | Email: {data.hospital.email}</p>
            <div className="inline-block mt-2 border-2 border-teal-700 px-4 py-1 text-[11px] font-bold text-teal-700 uppercase tracking-widest">
              Transaction Receipt
            </div>
          </div>

          {/* Status Badge */}
          <div className="flex justify-center py-3">
            <span className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wide border ${statusColor}`}>
              <StatusIcon className="w-3.5 h-3.5" />
              {data.payment.paymentStatus}
            </span>
          </div>

          {/* Amount Highlight */}
          <div className="mx-5 mb-4 text-center bg-gradient-to-br from-teal-50 to-emerald-50 border-2 border-teal-700 rounded-xl p-5">
            <p className="text-[9px] uppercase tracking-[2px] text-teal-700 font-bold">Amount Paid</p>
            <p className="text-4xl font-black text-teal-700 mt-1">₹{data.payment.amountPaid.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
            <span className="inline-block mt-2 bg-white text-gray-700 text-[11px] px-3 py-1 rounded-full border border-gray-200">
              {data.payment.paymentMode} Payment
            </span>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-2 px-5 mb-4">
            {[
              { label: "Receipt No.", value: data.payment.paymentDisplayId },
              { label: "Date & Time", value: new Date(data.payment.paymentDate).toLocaleString('en-IN') },
              { label: "Reference No.", value: data.payment.referenceNumber },
              { label: "Received By", value: data.payment.receivedBy },
            ].map((item, i) => (
              <div key={i} className="bg-gray-50 border border-gray-100 rounded-lg p-2.5">
                <p className="text-[8px] uppercase tracking-[1px] text-gray-400 font-bold">{item.label}</p>
                <p className="text-[11px] font-semibold text-gray-800 mt-0.5">{item.value}</p>
              </div>
            ))}
          </div>

          {/* Divider */}
          <hr className="border-dashed border-gray-200 mx-5 my-3" />

          {/* Patient & Bill */}
          <div className="grid grid-cols-2 gap-2 px-5 mb-4">
            {[
              { label: "Patient Name", value: data.patient.patientName },
              { label: "Patient ID", value: data.patient.patientNo },
              { label: "Bill Number", value: data.bill.billNumber, highlight: true },
              { label: "Doctor", value: data.doctor.doctorName },
              { label: "Bill Amount", value: `₹${data.bill.totalAmount.toFixed(2)}` },
              { label: "Phone", value: data.patient.phone },
            ].map((item, i) => (
              <div key={i} className="bg-gray-50 border border-gray-100 rounded-lg p-2.5">
                <p className="text-[8px] uppercase tracking-[1px] text-gray-400 font-bold">{item.label}</p>
                <p className={`text-[11px] font-semibold mt-0.5 ${item.highlight ? 'text-teal-700' : 'text-gray-800'}`}>{item.value}</p>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="border-t-2 border-gray-200 px-5 py-3 text-center text-[9px] text-gray-400">
            <p>This is a computer-generated receipt. No signature is required.</p>
            <p>Thank you for choosing {data.hospital.name}.</p>
            <p>For queries, contact: {data.hospital.phone}</p>
          </div>
        </div>
      </div>
    </>
  );
}
