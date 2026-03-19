export type PaymentStatus = "Success" | "Pending" | "Failed";
export type PaymentMode = "Cash" | "Card" | "UPI" | "Insurance" | "Online";

export interface Payment {
  id: string;
  paymentId: string;
  date: string; // YYYY-MM-DD
  time: string;
  billNumber: string;
  patientName: string;
  patientPhone: string;
  doctorName: string;
  mode: PaymentMode;
  referenceNumber: string;
  amount: number;
  status: PaymentStatus;
  receivedBy: string;
}

export const mockPayments: Payment[] = [
  {
    id: "p1", paymentId: "PAY-100234", date: new Date().toISOString().split('T')[0], time: "10:30 AM",
    billNumber: "INV-8821", patientName: "Rahul Sharma", patientPhone: "+91 9876543210",
    doctorName: "Dr. Alice Brown", mode: "UPI", referenceNumber: "UPI12390844", amount: 1500, status: "Success", receivedBy: "Jane Desk"
  },
  {
    id: "p2", paymentId: "PAY-100235", date: new Date().toISOString().split('T')[0], time: "11:15 AM",
    billNumber: "INV-8822", patientName: "Priya Patel", patientPhone: "+91 9988776655",
    doctorName: "Dr. Robert Fox", mode: "Card", referenceNumber: "TXN-CC-902", amount: 8500, status: "Success", receivedBy: "Jane Desk"
  },
  {
    id: "p3", paymentId: "PAY-100236", date: "2026-03-03", time: "02:45 PM",
    billNumber: "INV-8819", patientName: "Amit Kumar", patientPhone: "+91 9123456789",
    doctorName: "Dr. Emily Chen", mode: "Cash", referenceNumber: "-", amount: 500, status: "Pending", receivedBy: "Mike Front"
  },
  {
    id: "p4", paymentId: "PAY-100237", date: "2026-03-03", time: "04:00 PM",
    billNumber: "INV-8820", patientName: "Sneha Gupta", patientPhone: "+91 9876512345",
    doctorName: "Dr. Alice Brown", mode: "Online", referenceNumber: "PG-FAIL-88", amount: 12000, status: "Failed", receivedBy: "System"
  },
  {
    id: "p5", paymentId: "PAY-100238", date: "2026-03-02", time: "09:30 AM",
    billNumber: "INV-8810", patientName: "Vikram Singh", patientPhone: "+91 9000011111",
    doctorName: "Dr. James Wilson", mode: "Insurance", referenceNumber: "INS-APV-22", amount: 25000, status: "Success", receivedBy: "Jane Desk"
  }
];

export const getStatusStyles = (status: PaymentStatus) => {
  switch (status) {
    case "Success": return "bg-success/10 text-success border-success/20";
    case "Pending": return "bg-warning/10 text-warning-foreground border-warning/20";
    case "Failed": return "bg-destructive/10 text-destructive border-destructive/20";
    default: return "bg-muted text-muted-foreground border-border";
  }
};