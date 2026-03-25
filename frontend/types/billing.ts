export type BillStatus = "Draft" | "Finalized" | "Cancelled";

export interface OpdVisit {
  opdId: number;
  opdNo: string;
  patientId: string;
  patientName: string;
  age: number;
  gender: string;
  phone: string;
  doctorId: number;
  doctorName: string;
  department: string;
  visitDate: string;
  chiefComplaint: string;
  indicators: {
    diagnosisAdded: boolean;
    testsOrdered: boolean;
    proceduresDone: boolean;
    prescriptionGenerated: boolean;
  };
  status: "Pending Bill" | "Billed";
  billId: number | null;
}

export interface BillItem {
  billItemId?: number;
  itemType: "Consultation" | "Test" | "Procedure" | "Medicine" | "Other";
  referenceId?: number | null;
  itemDescription: string;
  quantity: number;
  unitPrice: number;
  totalPrice?: number;
}

export interface MedicineItem {
  itemType: "Medicine";
  referenceId?: number;
  itemDescription: string;
  medicineCode: string;
  medicineType: string;
  strength: string;
  manufacturer: string;
  dosage: string;
  durationDays: number;
  quantity: number;
  unitPrice: number;
}

export interface PaymentEntry {
  paymentId: number;
  paymentDate: string;
  amountPaid: number;
  paymentMode: string;
  paymentModeId: number;
  referenceNumber: string;
  paymentStatus: "Success" | "Failed" | "Pending";
  receivedBy?: string;
}

export interface PaymentMode {
  paymentModeId: number;
  paymentModeName: string;
  requiresReference: boolean;
}

export interface ExistingBill {
  billId: number;
  billNumber: string;
  billDate: string;
  billingStatus: string;
  paymentStatus: string;
  subtotalAmount: number;
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
  billItems: BillItem[];
  payments: PaymentEntry[];
}