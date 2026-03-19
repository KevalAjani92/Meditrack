export interface Diagnosis {
  diagnosis_id: number;
  diagnosis_code: string;
  diagnosis_name: string;
  description: string;
  department_id: number;
  department_name: string;
  status: "Active" | "Archived";
  created_at: string;
  updated_at: string;
}

export interface HospitalDiagnosis extends Diagnosis{
  hospital_diagnosis_id:number;
  isActive: boolean;
}

export interface Department {
  id: number;
  name: string;
}

export const mockDepartments: Department[] = [
  { id: 1, name: "Cardiology" },
  { id: 2, name: "Neurology" },
  { id: 3, name: "Pediatrics" },
  { id: 4, name: "Orthopedics" },
];

export const mockDiagnoses: Diagnosis[] = [
  {
    diagnosis_id: 1,
    diagnosis_code: "I10",
    diagnosis_name: "Essential (primary) hypertension",
    description: "High blood pressure without a known secondary cause.",
    department_id: 1,
    department_name: "Cardiology",
    status: "Active",
    created_at: "2023-01-15",
    updated_at: "2023-06-20",
  },
  {
    diagnosis_id: 2,
    diagnosis_code: "G43.9",
    diagnosis_name: "Migraine, unspecified",
    description: "Recurrent throbbing headache usually affecting one side of the head.",
    department_id: 2,
    department_name: "Neurology",
    status: "Active",
    created_at: "2023-02-10",
    updated_at: "2023-08-05",
  },
  {
    diagnosis_id: 3,
    diagnosis_code: "J00",
    diagnosis_name: "Acute nasopharyngitis",
    description: "Common cold affecting the upper respiratory tract.",
    department_id: 3,
    department_name: "Pediatrics",
    status: "Active",
    created_at: "2023-03-12",
    updated_at: "2023-03-12",
  },
  {
    diagnosis_id: 4,
    diagnosis_code: "I20.9",
    diagnosis_name: "Angina pectoris",
    description: "Chest pain caused by reduced blood flow to the heart.",
    department_id: 1,
    department_name: "Cardiology",
    status: "Active",
    created_at: "2023-04-01",
    updated_at: "2023-11-15",
  },
  {
    diagnosis_id: 5,
    diagnosis_code: "E11",
    diagnosis_name: "Type 2 diabetes mellitus",
    description: "Chronic condition affecting the way the body processes blood sugar.",
    department_id: 4,
    department_name: "Endocrinology",
    status: "Active",
    created_at: "2023-05-01",
    updated_at: "2023-05-01",
  },
  {
    diagnosis_id: 6,
    diagnosis_code: "J45",
    diagnosis_name: "Asthma",
    description: "Inflammatory disease of the airways causing breathing difficulty.",
    department_id: 5,
    department_name: "Pulmonology",
    status: "Active",
    created_at: "2023-05-15",
    updated_at: "2023-05-20",
  },
  {
    diagnosis_id: 7,
    diagnosis_code: "K21.9",
    diagnosis_name: "Gastro-esophageal reflux disease",
    description: "Digestive disorder where stomach acid irritates the esophagus.",
    department_id: 6,
    department_name: "Gastroenterology",
    status: "Active",
    created_at: "2023-06-01",
    updated_at: "2023-06-01",
  },
  {
    diagnosis_id: 8,
    diagnosis_code: "M54.5",
    diagnosis_name: "Low back pain",
    description: "Pain in the lower back region.",
    department_id: 7,
    department_name: "Orthopedics",
    status: "Active",
    created_at: "2023-06-10",
    updated_at: "2023-06-12",
  },
  {
    diagnosis_id: 9,
    diagnosis_code: "F32",
    diagnosis_name: "Major depressive disorder",
    description: "Mental health disorder characterized by persistent sadness.",
    department_id: 8,
    department_name: "Psychiatry",
    status: "Active",
    created_at: "2023-06-20",
    updated_at: "2023-07-01",
  },
  {
    diagnosis_id: 10,
    diagnosis_code: "H10.9",
    diagnosis_name: "Conjunctivitis",
    description: "Inflammation or infection of the outer membrane of the eyeball.",
    department_id: 9,
    department_name: "Ophthalmology",
    status: "Active",
    created_at: "2023-07-01",
    updated_at: "2023-07-01",
  },
  {
    diagnosis_id: 11,
    diagnosis_code: "N39.0",
    diagnosis_name: "Urinary tract infection",
    description: "Infection in any part of the urinary system.",
    department_id: 10,
    department_name: "Urology",
    status: "Active",
    created_at: "2023-07-10",
    updated_at: "2023-07-12",
  },
  {
    diagnosis_id: 12,
    diagnosis_code: "L20",
    diagnosis_name: "Atopic dermatitis",
    description: "Chronic inflammatory skin condition causing itchy skin.",
    department_id: 11,
    department_name: "Dermatology",
    status: "Active",
    created_at: "2023-07-20",
    updated_at: "2023-07-22",
  },
  {
    diagnosis_id: 13,
    diagnosis_code: "A09",
    diagnosis_name: "Infectious gastroenteritis",
    description: "Diarrheal disease caused by infection.",
    department_id: 6,
    department_name: "Gastroenterology",
    status: "Active",
    created_at: "2023-08-01",
    updated_at: "2023-08-01",
  },
  {
    diagnosis_id: 14,
    diagnosis_code: "I50",
    diagnosis_name: "Heart failure",
    description: "Chronic condition where the heart cannot pump blood efficiently.",
    department_id: 1,
    department_name: "Cardiology",
    status: "Active",
    created_at: "2023-08-10",
    updated_at: "2023-08-12",
  },
  {
    diagnosis_id: 15,
    diagnosis_code: "M17",
    diagnosis_name: "Osteoarthritis of knee",
    description: "Degenerative joint disease affecting the knee.",
    department_id: 7,
    department_name: "Orthopedics",
    status: "Active",
    created_at: "2023-08-20",
    updated_at: "2023-08-20",
  },
  {
    diagnosis_id: 16,
    diagnosis_code: "E03.9",
    diagnosis_name: "Hypothyroidism",
    description: "Condition where the thyroid gland does not produce enough hormones.",
    department_id: 4,
    department_name: "Endocrinology",
    status: "Active",
    created_at: "2023-09-01",
    updated_at: "2023-09-01",
  },
  {
    diagnosis_id: 17,
    diagnosis_code: "H66.9",
    diagnosis_name: "Otitis media",
    description: "Middle ear infection common in children.",
    department_id: 12,
    department_name: "ENT",
    status: "Active",
    created_at: "2023-09-10",
    updated_at: "2023-09-12",
  },
  {
    diagnosis_id: 18,
    diagnosis_code: "R51",
    diagnosis_name: "Headache",
    description: "Pain in any region of the head.",
    department_id: 2,
    department_name: "Neurology",
    status: "Active",
    created_at: "2023-09-20",
    updated_at: "2023-09-20",
  },
  {
    diagnosis_id: 19,
    diagnosis_code: "J18.9",
    diagnosis_name: "Pneumonia",
    description: "Infection causing inflammation in the air sacs of the lungs.",
    department_id: 5,
    department_name: "Pulmonology",
    status: "Active",
    created_at: "2023-10-01",
    updated_at: "2023-10-03",
  },
  {
    diagnosis_id: 20,
    diagnosis_code: "R10.9",
    diagnosis_name: "Abdominal pain",
    description: "Pain occurring anywhere in the abdominal region.",
    department_id: 6,
    department_name: "Gastroenterology",
    status: "Active",
    created_at: "2023-10-10",
    updated_at: "2023-10-10",
  },
];

export const mockEnabledDiagnoses: HospitalDiagnosis[] = [
  { ...mockDiagnoses[0], isActive: true },  // Hypertension
  { ...mockDiagnoses[1], isActive: true },  // Diabetes
  { ...mockDiagnoses[3], isActive: false }, // Migraine (Inactive)
  { ...mockDiagnoses[2], isActive: true },  // Hypertension
  { ...mockDiagnoses[5], isActive: true },  // Diabetes
  { ...mockDiagnoses[4], isActive: false }, // Migraine (Inactive)
  { ...mockDiagnoses[10], isActive: true },  // Hypertension
  { ...mockDiagnoses[14], isActive: true },  // Diabetes
  { ...mockDiagnoses[18], isActive: false }, // Migraine (Inactive)
  { ...mockDiagnoses[12], isActive: true },  // Hypertension
  { ...mockDiagnoses[11], isActive: true },  // Diabetes
  { ...mockDiagnoses[16], isActive: false }, // Migraine (Inactive)
];

export const extractUniqueDepartments = (diagnoses: Diagnosis[]): string[] => {
  return Array.from(new Set(diagnoses.map(d => d.department_name))).sort();
};