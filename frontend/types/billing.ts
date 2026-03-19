export type BillStatus = "Draft" | "Finalized" | "Cancelled";
export type PaymentMode = "Cash" | "Card" | "UPI" | "Insurance" | "Other";

export interface OpdVisit {
  opdNo: string;
  patientId: string;
  patientName: string;
  age: number;
  gender: string;
  phone: string;
  doctorId: string;
  doctorName: string;
  visitDate: string;
  chiefComplaint: string;
  indicators: {
    diagnosisAdded: boolean;
    testsOrdered: boolean;
    proceduresDone: boolean;
    prescriptionGenerated: boolean;
  };
  status: "Pending Bill" | "Billed";
}

export interface BillItem {
  id: string;
  type: "Consultation" | "Test" | "Procedure" | "Medicine" | "Other";
  description: string;
  quantity: number;
  unitPrice: number;
}

export interface MedicineItem {
  id: string;
  code: string;
  name: string;
  type: string;
  strength: string;
  manufacturer: string;
  dosage: string;
  durationDays: number;
  quantity: number;
  unitPrice: number;
}

export interface PaymentEntry {
  id: string;
  date: string;
  mode: PaymentMode;
  amount: number;
  referenceNumber: string;
  status: "Success" | "Failed";
}

// --- EXPANDED MOCK DATA ---
export const mockOpdVisits: OpdVisit[] = [
  // 🔴 Pending Bills
  {
    opdNo: "OPD-88902", patientId: "PT-1001", patientName: "John Doe", age: 45, gender: "Male", phone: "+1 555-0100",
    doctorId: "DOC-01", doctorName: "Dr. Alice Brown", visitDate: new Date().toISOString().split('T')[0],
    chiefComplaint: "Severe chest pain",
    indicators: { diagnosisAdded: true, testsOrdered: true, proceduresDone: false, prescriptionGenerated: true },
    status: "Pending Bill"
  },
  {
    opdNo: "OPD-88905", patientId: "PT-1002", patientName: "Jane Smith", age: 32, gender: "Female", phone: "+1 555-0101",
    doctorId: "DOC-02", doctorName: "Dr. Robert Fox", visitDate: "2026-03-03",
    chiefComplaint: "Viral fever",
    indicators: { diagnosisAdded: true, testsOrdered: false, proceduresDone: false, prescriptionGenerated: true },
    status: "Pending Bill"
  },
  // 🟢 Already Billed
  {
    opdNo: "OPD-88910", patientId: "PT-1003", patientName: "Michael Johnson", age: 58, gender: "Male", phone: "+1 555-0102",
    doctorId: "DOC-04", doctorName: "Dr. James Wilson", visitDate: "2026-03-01",
    chiefComplaint: "Migraine follow-up",
    indicators: { diagnosisAdded: true, testsOrdered: false, proceduresDone: false, prescriptionGenerated: false },
    status: "Billed"
  },
  {
    opdNo: "OPD-88915", patientId: "PT-1004", patientName: "Emily Davis", age: 28, gender: "Female", phone: "+1 555-0103",
    doctorId: "DOC-05", doctorName: "Dr. Sarah Smith", visitDate: "2026-02-28",
    chiefComplaint: "Routine Checkup",
    indicators: { diagnosisAdded: true, testsOrdered: true, proceduresDone: true, prescriptionGenerated: true },
    status: "Billed"
  }
];

// Mock Items for a "Billed" visit
export const mockBilledItems: BillItem[] = [
  { id: "item-10", type: "Consultation", description: "Neurology Consultation", quantity: 1, unitPrice: 200 },
  { id: "item-11", type: "Test", description: "MRI Scan", quantity: 1, unitPrice: 450 },
];

export const mockBilledPayments: PaymentEntry[] = [
  { id: "pay-001", date: "2026-03-01", mode: "Card", amount: 682.50, referenceNumber: "TXN-99882211", status: "Success" }
];

export const mockInitialBillItems: BillItem[] = [
  { id: "item-1", type: "Consultation", description: "Specialist Consultation", quantity: 1, unitPrice: 150 },
  { id: "item-2", type: "Test", description: "Blood Test", quantity: 1, unitPrice: 75 },
];

export const mockInitialMedicines: MedicineItem[] = [
  { id: "med-1", code: "MED-092", name: "Aspirin", type: "Tablet", strength: "75mg", manufacturer: "PharmaCo", dosage: "1-0-0", durationDays: 30, quantity: 30, unitPrice: 0.5 },
];