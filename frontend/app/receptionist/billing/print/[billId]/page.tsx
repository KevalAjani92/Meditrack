"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Download, Printer, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { billingService } from "@/services/billing.service";
import { useToast } from "@/components/ui/toast";

const HOSPITAL_ID = 1;

export default function BillPrintPage({ params }: { params: Promise<{ billId: string }> }) {
  const resolvedParams = use(params);
  const {addToast} = useToast();
  const billId = parseInt(resolvedParams.billId);
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await billingService.getBillPrintData(HOSPITAL_ID, billId);
        setData(res);
      } catch {
        addToast("Failed to load bill data","error");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [billId]);

  const handleDownload = async () => {
    // try {
    //   const res = await billingService.downloadBillPdf(HOSPITAL_ID, billId);
    //   const blob = new Blob([res.data as any], { type: "application/pdf" });
    //   const url = URL.createObjectURL(blob);
    //   const link = document.createElement("a");
    //   link.href = url;
    //   link.download = `bill-${data?.bill?.billNumber || billId}.pdf`;
    //   link.click();
    //   URL.revokeObjectURL(url);
    //   addToast("PDF downloaded","success");
    // } catch {
    //   addToast("Failed to download PDF","error");
    // }

    try {
      const res = await billingService.downloadBillPdf(HOSPITAL_ID, billId);
      
      // Safely grab the buffer (handles cases where an Axios interceptor unwraps the response)
      const pdfData = res.data || res; 
      
      const blob = new Blob([pdfData], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      
      link.href = url;
      link.setAttribute("download", `bill-${data?.bill?.billNumber || billId}.pdf`);
      
      // Required for Firefox and some Safari versions
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      addToast("PDF downloaded", "success");
    } catch (error) {
      console.error("Download Error:", error);
      addToast("Failed to download PDF", "error");
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-muted-foreground gap-2">
        <Loader2 className="w-5 h-5 animate-spin" /> Loading bill...
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-screen text-muted-foreground">
        Bill not found.
      </div>
    );
  }

  const serviceItems = data.billItems.filter((i: any) => i.itemType !== "Medicine");
  const medicineItems = data.billItems.filter((i: any) => i.itemType === "Medicine");
  const totalPaid = data.payments.reduce((s: number, p: any) => s + p.amountPaid, 0);
  const balance = data.bill.totalAmount - totalPaid;

  return (
    <>
      {/* Action bar - hidden on print */}
      <div className="print:hidden sticky top-0 z-20 bg-background border-b border-border px-4 py-3 flex items-center justify-between">
        <Button variant="ghost" onClick={() => router.back()} className="gap-2">
          <ArrowLeft className="w-4 h-4" /> Back
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleDownload} className="gap-2">
            <Download className="w-4 h-4" /> Download PDF
          </Button>
          <Button onClick={handlePrint} className="gap-2">
            <Printer className="w-4 h-4" /> Print
          </Button>
        </div>
      </div>

      {/* Bill Preview */}
      <div className="max-w-3xl mx-auto py-8 px-4 print:max-w-full print:p-0 print:py-4">
        <div className="bg-white text-gray-900 rounded-xl border border-gray-200 shadow-lg overflow-hidden print:shadow-none print:border-0 print:rounded-none">
          
          {/* Hospital Header */}
          <div className="text-center border-b-[3px] border-teal-700 p-6 pb-4">
            <h1 className="text-2xl font-extrabold text-teal-700 tracking-wide">{data.hospital.name}</h1>
            <p className="text-xs text-gray-500 mt-1">{data.hospital.address}</p>
            <p className="text-xs text-gray-500">Phone: {data.hospital.phone} | Email: {data.hospital.email}</p>
            {data.hospital.registrationNo !== "-" && (
              <p className="text-xs text-gray-500">
                Reg. No: {data.hospital.registrationNo}
                {data.hospital.gstNo !== "-" && ` | GST: ${data.hospital.gstNo}`}
              </p>
            )}
            <div className="inline-block mt-3 border-2 border-teal-700 px-5 py-1 text-sm font-bold text-teal-700 uppercase tracking-widest">
              Tax Invoice / Receipt
            </div>
          </div>

          {/* Patient & Bill Info */}
          <div className="grid grid-cols-2 gap-4 p-6 pb-4">
            <div className="bg-teal-50 border border-teal-100 rounded-lg p-3">
              <h4 className="text-[9px] uppercase tracking-[1.5px] text-teal-700 font-bold mb-2">Patient Details</h4>
              <div className="space-y-1 text-[11px]">
                <div className="flex justify-between"><span className="text-gray-500">Name</span><span className="font-semibold">{data.visit.patientName}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">ID</span><span className="font-semibold">{data.visit.patientId}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Age / Gender</span><span className="font-semibold">{data.visit.age}Y, {data.visit.gender}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Phone</span><span className="font-semibold">{data.visit.phone}</span></div>
              </div>
            </div>
            <div className="bg-teal-50 border border-teal-100 rounded-lg p-3">
              <h4 className="text-[9px] uppercase tracking-[1.5px] text-teal-700 font-bold mb-2">Bill Details</h4>
              <div className="space-y-1 text-[11px]">
                <div className="flex justify-between"><span className="text-gray-500">Bill No.</span><span className="font-bold text-teal-700">{data.bill.billNumber}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Bill Date</span><span className="font-semibold">{new Date(data.bill.billDate).toLocaleDateString('en-IN')}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">OPD No.</span><span className="font-semibold">{data.visit.opdNo}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Doctor</span><span className="font-semibold">{data.visit.doctorName}</span></div>
              </div>
            </div>
          </div>

          {/* Service Items */}
          {serviceItems.length > 0 && (
            <div className="px-6">
              <h3 className="text-[13px] font-bold text-teal-700 border-b-2 border-teal-200 pb-1 mb-2 mt-2">⚕ Service & Procedure Charges</h3>
              <table className="w-full text-[11px] mb-4">
                <thead>
                  <tr className="bg-teal-700 text-white">
                    <th className="px-3 py-2 text-left uppercase text-[10px] tracking-wider">#</th>
                    <th className="px-3 py-2 text-left uppercase text-[10px] tracking-wider">Type</th>
                    <th className="px-3 py-2 text-left uppercase text-[10px] tracking-wider">Description</th>
                    <th className="px-3 py-2 text-right uppercase text-[10px] tracking-wider">Qty</th>
                    <th className="px-3 py-2 text-right uppercase text-[10px] tracking-wider">Unit Price</th>
                    <th className="px-3 py-2 text-right uppercase text-[10px] tracking-wider">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {serviceItems.map((item: any, i: number) => (
                    <tr key={i} className={i % 2 === 0 ? "" : "bg-gray-50"}>
                      <td className="px-3 py-2">{i + 1}</td>
                      <td className="px-3 py-2">{item.itemType}</td>
                      <td className="px-3 py-2">{item.itemDescription}</td>
                      <td className="px-3 py-2 text-right">{item.quantity}</td>
                      <td className="px-3 py-2 text-right">₹{item.unitPrice.toFixed(2)}</td>
                      <td className="px-3 py-2 text-right font-medium">₹{item.totalPrice.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Medicine Section - Different Styling */}
          {medicineItems.length > 0 && (
            <div className="mx-6 mb-4 bg-amber-50 border border-amber-200 rounded-lg p-4">
              <h3 className="text-[13px] font-bold text-amber-700 border-b-2 border-amber-200 pb-1 mb-2">💊 Prescription & Medicines</h3>
              <table className="w-full text-[11px]">
                <thead>
                  <tr className="bg-amber-600 text-white">
                    <th className="px-3 py-2 text-left uppercase text-[10px] tracking-wider">#</th>
                    <th className="px-3 py-2 text-left uppercase text-[10px] tracking-wider">Medicine</th>
                    <th className="px-3 py-2 text-right uppercase text-[10px] tracking-wider">Qty</th>
                    <th className="px-3 py-2 text-right uppercase text-[10px] tracking-wider">Unit Price</th>
                    <th className="px-3 py-2 text-right uppercase text-[10px] tracking-wider">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {medicineItems.map((item: any, i: number) => (
                    <tr key={i} className={i % 2 === 0 ? "" : "bg-amber-50"}>
                      <td className="px-3 py-2">{i + 1}</td>
                      <td className="px-3 py-2">{item.itemDescription}</td>
                      <td className="px-3 py-2 text-right">{item.quantity}</td>
                      <td className="px-3 py-2 text-right">₹{item.unitPrice.toFixed(2)}</td>
                      <td className="px-3 py-2 text-right font-medium">₹{item.totalPrice.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Summary */}
          <div className="flex justify-end px-6 mb-4">
            <div className="w-64 space-y-1 text-[11px]">
              <div className="flex justify-between border-b border-dashed border-gray-200 pb-1"><span className="text-gray-500">Subtotal</span><span className="font-medium">₹{data.bill.subtotalAmount.toFixed(2)}</span></div>
              <div className="flex justify-between border-b border-dashed border-gray-200 pb-1"><span className="text-gray-500">Tax</span><span className="font-medium">₹{data.bill.taxAmount.toFixed(2)}</span></div>
              <div className="flex justify-between border-b border-dashed border-gray-200 pb-1"><span className="text-gray-500">Discount</span><span className="font-medium text-green-600">- ₹{data.bill.discountAmount.toFixed(2)}</span></div>
              <div className="flex justify-between border-t-2 border-teal-700 pt-2 mt-1 text-[14px] font-extrabold text-teal-700"><span>Grand Total</span><span>₹{data.bill.totalAmount.toFixed(2)}</span></div>
              <div className="flex justify-between pt-1"><span className="text-gray-500">Amount Paid</span><span className="font-semibold text-green-600">₹{totalPaid.toFixed(2)}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Balance Due</span><span className={`font-semibold ${balance > 0 ? 'text-red-600' : 'text-green-600'}`}>₹{balance.toFixed(2)}</span></div>
            </div>
          </div>

          {/* Payment History */}
          {data.payments.length > 0 && (
            <div className="px-6 mb-4">
              <h3 className="text-[13px] font-bold text-teal-700 border-b-2 border-teal-200 pb-1 mb-2">💳 Payment History</h3>
              <table className="w-full text-[11px]">
                <thead>
                  <tr className="bg-teal-700 text-white">
                    <th className="px-3 py-2 text-left uppercase text-[10px]">#</th>
                    <th className="px-3 py-2 text-left uppercase text-[10px]">Date</th>
                    <th className="px-3 py-2 text-left uppercase text-[10px]">Mode</th>
                    <th className="px-3 py-2 text-left uppercase text-[10px]">Reference</th>
                    <th className="px-3 py-2 text-left uppercase text-[10px]">Status</th>
                    <th className="px-3 py-2 text-right uppercase text-[10px]">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {data.payments.map((p: any, i: number) => (
                    <tr key={i} className={i % 2 === 0 ? "" : "bg-gray-50"}>
                      <td className="px-3 py-2">{i + 1}</td>
                      <td className="px-3 py-2">{new Date(p.paymentDate).toLocaleDateString('en-IN')}</td>
                      <td className="px-3 py-2">{p.paymentMode}</td>
                      <td className="px-3 py-2 font-mono">{p.referenceNumber}</td>
                      <td className="px-3 py-2">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${p.paymentStatus === 'Success' ? 'bg-green-100 text-green-700' : p.paymentStatus === 'Pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                          {p.paymentStatus}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-right font-medium">₹{p.amountPaid.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Signature Area */}
          <div className="flex justify-between px-6 pb-4 pt-8">
            <div className="text-center text-[10px] text-gray-500 border-t border-gray-400 pt-1 min-w-[150px]">Patient / Attendant Signature</div>
            <div className="text-center text-[10px] text-gray-500 border-t border-gray-400 pt-1 min-w-[150px]">Authorized Signatory</div>
          </div>

          {/* Footer */}
          <div className="border-t-2 border-gray-200 px-6 py-3 text-center text-[9px] text-gray-400">
            <p>This is a computer-generated receipt. Thank you for choosing {data.hospital.name}.</p>
            <p>For queries, contact: {data.hospital.phone} | {data.hospital.email}</p>
          </div>
        </div>
      </div>
    </>
  );
}
