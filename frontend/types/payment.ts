export type PaymentStatus = "Success" | "Pending" | "Failed";

export interface Payment {
  id: number;
  paymentId: string;
  date: string;
  time: string;
  billId: number;
  billNumber: string;
  patientName: string;
  patientPhone: string;
  doctorName: string;
  mode: string;
  referenceNumber: string;
  amount: number;
  status: PaymentStatus;
  receivedBy: string;
}

export interface PaymentStats {
  todaysRevenue: number;
  todaysPayments: number;
  pending: number;
  success: number;
  failed: number;
}

export const getStatusStyles = (status: PaymentStatus) => {
  switch (status) {
    case "Success": return "bg-success/10 text-success border-success/20";
    case "Pending": return "bg-warning/10 text-warning-foreground border-warning/20";
    case "Failed": return "bg-destructive/10 text-destructive border-destructive/20";
    default: return "bg-muted text-muted-foreground border-border";
  }
};