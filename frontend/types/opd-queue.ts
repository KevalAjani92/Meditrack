export type VisitType = "Appointment" | "Walk-In" | "Emergency";
export type TokenStatus = "Waiting" | "In Progress" | "Completed" | "Skipped" | "No-Show";

export interface PatientMedicalInfo {
  bloodGroup: string;
  allergies: string;
  chronicConditions: string;
  lastVisit: string;
}

export interface OpdToken {
  id: string;
  tokenNo: string;
  opdId:number;
  patientName: string;
  age: number;
  gender: string;
  visitType: VisitType;
  apptNo?: string;
  chiefComplaint: string;
  issueTime: string; // e.g., "09:00 AM"
  waitTimeMins: number;
  status: TokenStatus;
  isEmergency: boolean;
  medicalInfo: PatientMedicalInfo;
}

export interface TimelineEvent {
  id: string;
  time: string;
  message: string;
  type: "Start" | "Complete" | "Skip" | "System";
}

// --- MOCK DATA ---
// export const mockQueue: OpdToken[] = [
//   {
//     id: "opd-001", tokenNo: "T-01", patientName: "Rahul Sharma", age: 45, gender: "Male", visitType: "Appointment", apptNo: "APT-8812",
//     chiefComplaint: "Follow-up for hypertension", issueTime: "08:45 AM", waitTimeMins: 45, status: "Completed", isEmergency: false,
//     medicalInfo: { bloodGroup: "O+", allergies: "None", chronicConditions: "Hypertension", lastVisit: "2026-02-15" }
//   },
//   {
//     id: "opd-002", tokenNo: "T-02", patientName: "Priya Patel", age: 32, gender: "Female", visitType: "Walk-In",
//     chiefComplaint: "Severe headache and nausea", issueTime: "09:10 AM", waitTimeMins: 20, status: "In Progress", isEmergency: false,
//     medicalInfo: { bloodGroup: "A-", allergies: "Penicillin", chronicConditions: "Migraine", lastVisit: "First Visit" }
//   },
//   {
//     id: "opd-003", tokenNo: "E-01", patientName: "Amit Kumar", age: 58, gender: "Male", visitType: "Emergency",
//     chiefComplaint: "Chest pain, shortness of breath", issueTime: "09:25 AM", waitTimeMins: 5, status: "Waiting", isEmergency: true,
//     medicalInfo: { bloodGroup: "B+", allergies: "Dust", chronicConditions: "Diabetes Type 2", lastVisit: "2025-11-10" }
//   },
//   {
//     id: "opd-004", tokenNo: "T-03", patientName: "Sneha Gupta", age: 28, gender: "Female", visitType: "Appointment", apptNo: "APT-8820",
//     chiefComplaint: "Routine checkup", issueTime: "09:15 AM", waitTimeMins: 15, status: "Waiting", isEmergency: false,
//     medicalInfo: { bloodGroup: "AB+", allergies: "None", chronicConditions: "None", lastVisit: "2025-08-22" }
//   },
//   {
//     id: "opd-005", tokenNo: "T-04", patientName: "Vikram Singh", age: 60, gender: "Male", visitType: "Walk-In",
//     chiefComplaint: "Joint pain", issueTime: "09:20 AM", waitTimeMins: 10, status: "Waiting", isEmergency: false,
//     medicalInfo: { bloodGroup: "O-", allergies: "Sulfa Drugs", chronicConditions: "Arthritis", lastVisit: "2026-01-30" }
//   },
// ];

export const mockTimelineEvents: TimelineEvent[] = [
  { id: "e1", time: "09:00 AM", message: "Queue Opened", type: "System" },
  { id: "e2", time: "09:05 AM", message: "Token T-01 Started", type: "Start" },
  { id: "e3", time: "09:20 AM", message: "Token T-01 Completed", type: "Complete" },
  { id: "e4", time: "09:22 AM", message: "Token T-02 Started", type: "Start" },
  { id: "e5", time: "09:25 AM", message: "Emergency E-01 Added", type: "System" },
];