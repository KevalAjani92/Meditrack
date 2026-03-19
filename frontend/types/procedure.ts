export interface Procedure {
  procedure_id: number;
  procedure_code: string;
  procedure_name: string;
  description: string;
  treatment_type_id: number;
  is_surgical: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface HospitalProcedure extends Procedure {
  hospital_procedure_id:number;
  isActive: boolean;
  price: number;
}

export interface TreatmentDetail {
  treatment_type_id: number;
  treatment_code: string;
  treatment_name: string;
  description: string;
  department_name: string;
  is_active: boolean;
  updated_at: string;
}

export const mockTreatment: TreatmentDetail = {
  treatment_type_id: "TX-002",
  treatment_code: "THR",
  treatment_name: "Total Hip Replacement",
  description: "Surgical replacement of the hip joint with an artificial prosthesis. Covers both partial and total replacement protocols.",
  department_name: "Orthopedics",
  is_active: true,
  updated_at: "2023-11-20",
};

export const mockProcedures: Procedure[] = [
  {
    procedure_id: "PR-101",
    procedure_code: "THR-PRE",
    procedure_name: "Pre-operative Assessment",
    description: "Initial consultation, medical history review, blood tests, and cardiac clearance before surgery.",
    treatment_type_id: "TX-002",
    is_surgical: false,
    is_active: true,
    created_at: "2023-01-10",
    updated_at: "2023-01-10",
  },
  {
    procedure_id: "PR-102",
    procedure_code: "THR-IMG",
    procedure_name: "Pre-Surgical Imaging",
    description: "X-ray or MRI imaging to evaluate hip joint damage and surgical planning.",
    treatment_type_id: "TX-002",
    is_surgical: false,
    is_active: true,
    created_at: "2023-01-11",
    updated_at: "2023-01-11",
  },
  {
    procedure_id: "PR-103",
    procedure_code: "THR-ANES",
    procedure_name: "Anesthesia Preparation",
    description: "Administration and monitoring of anesthesia prior to surgery.",
    treatment_type_id: "TX-002",
    is_surgical: false,
    is_active: true,
    created_at: "2023-01-12",
    updated_at: "2023-01-12",
  },
  {
    procedure_id: "PR-104",
    procedure_code: "THR-SURG",
    procedure_name: "Total Hip Arthroplasty",
    description: "Primary surgical procedure where the damaged hip joint is replaced with an artificial prosthesis.",
    treatment_type_id: "TX-002",
    is_surgical: true,
    is_active: true,
    created_at: "2023-01-12",
    updated_at: "2023-06-15",
  },
  {
    procedure_id: "PR-105",
    procedure_code: "THR-MON",
    procedure_name: "Post-Surgical Monitoring",
    description: "Immediate monitoring in the recovery unit for vital signs and surgical complications.",
    treatment_type_id: "TX-002",
    is_surgical: false,
    is_active: true,
    created_at: "2023-01-13",
    updated_at: "2023-01-13",
  },
  {
    procedure_id: "PR-106",
    procedure_code: "THR-PAIN",
    procedure_name: "Pain Management Protocol",
    description: "Administration of analgesics and monitoring of pain levels after surgery.",
    treatment_type_id: "TX-002",
    is_surgical: false,
    is_active: true,
    created_at: "2023-01-14",
    updated_at: "2023-01-14",
  },
  {
    procedure_id: "PR-107",
    procedure_code: "THR-REHAB",
    procedure_name: "Physiotherapy Rehabilitation",
    description: "Structured physiotherapy sessions to restore hip mobility and strength.",
    treatment_type_id: "TX-002",
    is_surgical: false,
    is_active: true,
    created_at: "2023-01-15",
    updated_at: "2023-01-15",
  },
  {
    procedure_id: "PR-108",
    procedure_code: "THR-FUP",
    procedure_name: "Follow-up Consultation",
    description: "Scheduled post-operative checkups to monitor healing and implant performance.",
    treatment_type_id: "TX-002",
    is_surgical: false,
    is_active: true,
    created_at: "2023-01-20",
    updated_at: "2023-01-20",
  },
];

export const mockEnabledProcedures: HospitalProcedure[] = [
  { ...mockProcedures[1], isActive: true, price: 15000 },  // Incision
  { ...mockProcedures[2], isActive: true, price: 25000 },  // Resection
  { ...mockProcedures[5], isActive: false, price: 1200 },  // PT (Inactive)
];