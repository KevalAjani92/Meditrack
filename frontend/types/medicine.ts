export interface Medicine {
  medicine_id: number;
  medicine_code: string;
  medicine_name: string;
  medicine_type: string;
  strength: string;
  manufacturer: string;
  is_active: boolean;
  created_at: string;
  modified_at: string;
}

export interface HospitalMedicine extends Medicine {
  hospital_medicine_id:number;
  isActive: boolean;
  price: number;
  stock: number;
}

export const mockMasterMedicines: Medicine[] = [
  { medicine_id: "med-01", medicine_name: "Paracetamol", medicine_code: "PARA-500", medicine_type: "Tablet", strength: "500mg", manufacturer: "PharmaCorp", description: "Mild analgesic and antipyretic.", created_at: "2023-01-10" },
  { medicine_id: "med-02", medicine_name: "Amoxicillin", medicine_code: "AMOX-250", medicine_type: "Capsule", strength: "250mg", manufacturer: "BioHeal", description: "Penicillin antibiotic used to treat bacterial infections.", created_at: "2023-01-15" },
  { medicine_id: "med-03", medicine_name: "Ibuprofen", medicine_code: "IBU-400", medicine_type: "Tablet", strength: "400mg", manufacturer: "MedLife", description: "NSAID for pain and inflammation.", created_at: "2023-02-05" },
  { medicine_id: "med-04", medicine_name: "Cough Syrup (Dextromethorphan)", medicine_code: "SYR-DX", medicine_type: "Syrup", strength: "10mg/5ml", manufacturer: "LiquidCare", description: "Cough suppressant.", created_at: "2023-02-20" },
  { medicine_id: "med-05", medicine_name: "Insulin Glargine", medicine_code: "INJ-GL", medicine_type: "Injection", strength: "100 IU/ml", manufacturer: "DiabeTech", description: "Long acting insulin.", created_at: "2023-03-12" },
  { medicine_id: "med-06", medicine_name: "Aspirin", medicine_code: "ASP-75", medicine_type: "Tablet", strength: "75mg", manufacturer: "CardioPharma", description: "Low dose aspirin for heart protection.", created_at: "2023-04-18" },
  { medicine_id: "med-07", medicine_name: "Diclofenac Gel", medicine_code: "OINT-DC", medicine_type: "Ointment", strength: "1%", manufacturer: "DermaMed", description: "Topical NSAID for pain relief.", created_at: "2023-05-05" },
  { medicine_id: "med-08", medicine_name: "Ceftriaxone", medicine_code: "INJ-CEF", medicine_type: "Injection", strength: "1g", manufacturer: "BioHeal", description: "Broad spectrum antibiotic.", created_at: "2023-06-22" },
  { medicine_id: "med-09", medicine_name: "Omeprazole", medicine_code: "OMEP-20", medicine_type: "Capsule", strength: "20mg", manufacturer: "GastroCare", description: "Acid reflux treatment.", created_at: "2023-07-11" },
  { medicine_id: "med-10", medicine_name: "Cetirizine", medicine_code: "CET-10", medicine_type: "Tablet", strength: "10mg", manufacturer: "AllergyMeds", description: "Antihistamine for allergies.", created_at: "2023-08-30" },
  { medicine_id: "med-11", medicine_name: "Metformin", medicine_code: "MET-500", medicine_type: "Tablet", strength: "500mg", manufacturer: "DiabeCare", description: "Used to treat type 2 diabetes.", created_at: "2023-09-02" },
  { medicine_id: "med-12", medicine_name: "Azithromycin", medicine_code: "AZI-500", medicine_type: "Tablet", strength: "500mg", manufacturer: "BioHeal", description: "Macrolide antibiotic.", created_at: "2023-09-15" },
  { medicine_id: "med-13", medicine_name: "Pantoprazole", medicine_code: "PANTO-40", medicine_type: "Tablet", strength: "40mg", manufacturer: "GastroCare", description: "Proton pump inhibitor.", created_at: "2023-09-22" },
  { medicine_id: "med-14", medicine_name: "Salbutamol Inhaler", medicine_code: "SAL-INH", medicine_type: "Inhaler", strength: "100mcg", manufacturer: "RespiraMed", description: "Bronchodilator for asthma.", created_at: "2023-10-01" },
  { medicine_id: "med-15", medicine_name: "Vitamin D3", medicine_code: "VITD-60K", medicine_type: "Capsule", strength: "60000 IU", manufacturer: "NutriLife", description: "Vitamin D supplement.", created_at: "2023-10-10" },
  { medicine_id: "med-16", medicine_name: "Calcium Carbonate", medicine_code: "CAL-500", medicine_type: "Tablet", strength: "500mg", manufacturer: "NutriLife", description: "Calcium supplement.", created_at: "2023-10-20" },
  { medicine_id: "med-17", medicine_name: "Losartan", medicine_code: "LOS-50", medicine_type: "Tablet", strength: "50mg", manufacturer: "CardioPharma", description: "Treats high blood pressure.", created_at: "2023-11-05" },
  { medicine_id: "med-18", medicine_name: "Atorvastatin", medicine_code: "ATOR-10", medicine_type: "Tablet", strength: "10mg", manufacturer: "CardioPharma", description: "Lowers cholesterol.", created_at: "2023-11-15" },
  { medicine_id: "med-19", medicine_name: "Levothyroxine", medicine_code: "LEVO-50", medicine_type: "Tablet", strength: "50mcg", manufacturer: "EndoCare", description: "Treats hypothyroidism.", created_at: "2023-11-25" },
  { medicine_id: "med-20", medicine_name: "Ranitidine", medicine_code: "RAN-150", medicine_type: "Tablet", strength: "150mg", manufacturer: "GastroCare", description: "Reduces stomach acid.", created_at: "2023-12-05" },
];

export const mockEnabledMedicines: HospitalMedicine[] = [
  { ...mockMasterMedicines[0], isActive: true, price: 45, stock: 120 },
  { ...mockMasterMedicines[1], isActive: true, price: 120, stock: 5 },
  { ...mockMasterMedicines[2], isActive: true, price: 60, stock: 80 },
  { ...mockMasterMedicines[3], isActive: true, price: 95, stock: 40 },
  { ...mockMasterMedicines[4], isActive: false, price: 850, stock: 50 },
  { ...mockMasterMedicines[5], isActive: true, price: 30, stock: 200 },
  { ...mockMasterMedicines[8], isActive: true, price: 110, stock: 70 },
  { ...mockMasterMedicines[10], isActive: true, price: 75, stock: 150 },
  { ...mockMasterMedicines[14], isActive: true, price: 95, stock: 20 },
  { ...mockMasterMedicines[17], isActive: true, price: 180, stock: 60 },
];

export const extractUniqueTypes = (medicines: Medicine[]): string[] => {
  return Array.from(new Set(medicines.map(m => m.medicine_type))).sort();
};