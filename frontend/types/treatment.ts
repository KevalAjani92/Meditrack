export interface Department {
  id: string;
  name: string;
}

export interface TreatmentType {
  treatment_type_id: number;
  treatment_code: string;
  treatment_name: string;
  description: string;
  department_id: number;
  department_name: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface HospitalTreatment extends TreatmentType {
  hospital_treatment_id:number;
  isActive: boolean;
}

export const mockDepartments: Department[] = [
  { id: "dept-1", name: "Cardiology" },
  { id: "dept-2", name: "Orthopedics" },
  { id: "dept-3", name: "Dermatology" },
  { id: "dept-4", name: "General Surgery" },
];

export const mockTreatments: TreatmentType[] = [
  {
    treatment_type_id: "TX-001",
    treatment_code: "CABG",
    treatment_name: "Coronary Artery Bypass Graft",
    description: "Surgical procedure to restore blood flow to blocked coronary arteries.",
    department_id: "dept-1",
    department_name: "Cardiology",
    is_active: true,
    created_at: "2023-01-10",
    updated_at: "2023-10-15",
  },
  {
    treatment_type_id: "TX-002",
    treatment_code: "THR",
    treatment_name: "Total Hip Replacement",
    description: "Replacement of hip joint with prosthetic implant.",
    department_id: "dept-2",
    department_name: "Orthopedics",
    is_active: true,
    created_at: "2023-02-15",
    updated_at: "2023-11-20",
  },
  {
    treatment_type_id: "TX-003",
    treatment_code: "MOHS",
    treatment_name: "Mohs Micrographic Surgery",
    description: "Surgical technique used to treat skin cancer precisely.",
    department_id: "dept-3",
    department_name: "Dermatology",
    is_active: false,
    created_at: "2023-03-01",
    updated_at: "2023-08-05",
  },
  {
    treatment_type_id: "TX-004",
    treatment_code: "ECHO",
    treatment_name: "Echocardiogram",
    description: "Ultrasound imaging test for heart function.",
    department_id: "dept-1",
    department_name: "Cardiology",
    is_active: true,
    created_at: "2023-03-15",
    updated_at: "2024-01-10",
  },
  {
    treatment_type_id: "TX-005",
    treatment_code: "ANGIO",
    treatment_name: "Coronary Angiography",
    description: "Imaging technique to visualize coronary arteries.",
    department_id: "dept-1",
    department_name: "Cardiology",
    is_active: true,
    created_at: "2023-04-01",
    updated_at: "2023-09-12",
  },
  {
    treatment_type_id: "TX-006",
    treatment_code: "KNEE-ARTH",
    treatment_name: "Knee Arthroscopy",
    description: "Minimally invasive surgery to diagnose and treat knee problems.",
    department_id: "dept-2",
    department_name: "Orthopedics",
    is_active: true,
    created_at: "2023-04-20",
    updated_at: "2023-10-05",
  },
  {
    treatment_type_id: "TX-007",
    treatment_code: "CHEMO",
    treatment_name: "Chemotherapy",
    description: "Drug treatment used to destroy cancer cells.",
    department_id: "dept-4",
    department_name: "Oncology",
    is_active: true,
    created_at: "2023-05-05",
    updated_at: "2023-12-10",
  },
  {
    treatment_type_id: "TX-008",
    treatment_code: "RADI",
    treatment_name: "Radiation Therapy",
    description: "Treatment using radiation to kill cancer cells.",
    department_id: "dept-4",
    department_name: "Oncology",
    is_active: true,
    created_at: "2023-05-15",
    updated_at: "2023-11-25",
  },
  {
    treatment_type_id: "TX-009",
    treatment_code: "PHYSIO",
    treatment_name: "Physiotherapy",
    description: "Therapy to restore movement and function.",
    department_id: "dept-5",
    department_name: "Physiotherapy",
    is_active: true,
    created_at: "2023-06-01",
    updated_at: "2023-09-01",
  },
  {
    treatment_type_id: "TX-010",
    treatment_code: "APPEN",
    treatment_name: "Appendectomy",
    description: "Surgical removal of the appendix.",
    department_id: "dept-6",
    department_name: "General Surgery",
    is_active: true,
    created_at: "2023-06-15",
    updated_at: "2023-10-18",
  },
  {
    treatment_type_id: "TX-011",
    treatment_code: "COLON",
    treatment_name: "Colonoscopy",
    description: "Procedure to examine the colon and rectum.",
    department_id: "dept-7",
    department_name: "Gastroenterology",
    is_active: true,
    created_at: "2023-07-01",
    updated_at: "2023-11-05",
  },
  {
    treatment_type_id: "TX-012",
    treatment_code: "ENDOS",
    treatment_name: "Endoscopy",
    description: "Procedure to view digestive tract using a flexible tube.",
    department_id: "dept-7",
    department_name: "Gastroenterology",
    is_active: true,
    created_at: "2023-07-10",
    updated_at: "2023-12-01",
  },
  {
    treatment_type_id: "TX-013",
    treatment_code: "LASIK",
    treatment_name: "LASIK Eye Surgery",
    description: "Laser surgery to correct vision problems.",
    department_id: "dept-8",
    department_name: "Ophthalmology",
    is_active: true,
    created_at: "2023-07-25",
    updated_at: "2023-12-12",
  },
  {
    treatment_type_id: "TX-014",
    treatment_code: "DIAL",
    treatment_name: "Dialysis",
    description: "Procedure to remove waste products from blood when kidneys fail.",
    department_id: "dept-9",
    department_name: "Nephrology",
    is_active: true,
    created_at: "2023-08-05",
    updated_at: "2024-01-05",
  },
  {
    treatment_type_id: "TX-015",
    treatment_code: "CSEC",
    treatment_name: "Cesarean Section",
    description: "Surgical procedure to deliver a baby.",
    department_id: "dept-10",
    department_name: "Gynecology",
    is_active: true,
    created_at: "2023-08-20",
    updated_at: "2023-12-20",
  },
  {
    treatment_type_id: "TX-016",
    treatment_code: "VACC",
    treatment_name: "Vaccination",
    description: "Administration of vaccine to help develop immunity.",
    department_id: "dept-11",
    department_name: "General Medicine",
    is_active: true,
    created_at: "2023-09-01",
    updated_at: "2023-09-20",
  },
  {
    treatment_type_id: "TX-017",
    treatment_code: "ECG",
    treatment_name: "Electrocardiogram",
    description: "Test to measure electrical activity of the heart.",
    department_id: "dept-1",
    department_name: "Cardiology",
    is_active: true,
    created_at: "2023-09-15",
    updated_at: "2024-01-02",
  },
  {
    treatment_type_id: "TX-018",
    treatment_code: "ENT-SURG",
    treatment_name: "Tonsillectomy",
    description: "Surgical removal of tonsils.",
    department_id: "dept-12",
    department_name: "ENT",
    is_active: true,
    created_at: "2023-10-01",
    updated_at: "2023-12-30",
  },
  {
    treatment_type_id: "TX-019",
    treatment_code: "SKIN-BIO",
    treatment_name: "Skin Biopsy",
    description: "Procedure to remove skin sample for testing.",
    department_id: "dept-3",
    department_name: "Dermatology",
    is_active: true,
    created_at: "2023-10-10",
    updated_at: "2023-12-15",
  },
  {
    treatment_type_id: "TX-020",
    treatment_code: "BLOOD-T",
    treatment_name: "Blood Transfusion",
    description: "Transfer of blood into bloodstream via IV.",
    department_id: "dept-11",
    department_name: "General Medicine",
    is_active: true,
    created_at: "2023-10-25",
    updated_at: "2024-01-15",
  },
];

export const mockEnabledTreatments: HospitalTreatment[] = [
  { ...mockTreatments[0], isActive: true },  // CABG
  { ...mockTreatments[2], isActive: true },  // Knee Replacement
  { ...mockTreatments[4], isActive: false }, // EEG (Inactive)
  { ...mockTreatments[1], isActive: true },  // CABG
  { ...mockTreatments[3], isActive: true },  // Knee Replacement
  { ...mockTreatments[14], isActive: false }, // EEG (Inactive)
  { ...mockTreatments[10], isActive: true },  // CABG
  { ...mockTreatments[12], isActive: true },  // Knee Replacement
  { ...mockTreatments[11], isActive: false }, // EEG (Inactive)
  { ...mockTreatments[15], isActive: true },  // CABG
  { ...mockTreatments[7], isActive: true },  // Knee Replacement
  { ...mockTreatments[9], isActive: false }, // EEG (Inactive)
];

export const extractUniqueDepartments = (treatments: TreatmentType[]): string[] => {
  return Array.from(new Set(treatments.map(t => t.department_name))).sort();
};