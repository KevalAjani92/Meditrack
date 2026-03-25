import { apiClient } from "@/lib/axios";

const API = "/opd-consultation";

export interface AddDiagnosisPayload {
  diagnosis_id: number;
  is_primary?: boolean;
  remarks?: string;
}

export interface AddProcedurePayload {
  procedure_id: number;
  procedure_date: string;
  remarks?: string;
}

export interface PrescriptionItemPayload {
  medicine_id: number;
  dosage: string;
  quantity: number;
  duration_days: number;
  instructions?: string;
}

export interface AddPrescriptionPayload {
  notes?: string;
  items: PrescriptionItemPayload[];
}

export interface AddTestPayload {
  test_id: number;
  remarks?: string;
}

export interface AddFollowupPayload {
  recommended_date: string;
  reason: string;
}

export const opdConsultationService = {
  /** GET /opd-consultation/:opdId — Full visit details with patient EMR */
  async getVisitDetails(opdId: number) {
    const res = await apiClient.get(`${API}/${opdId}`);
    return res.data;
  },

  /** GET /opd-consultation/:opdId/past-visits — Patient's previous visits */
  async getPastVisits(opdId: number) {
    const res = await apiClient.get(`${API}/${opdId}/past-visits`);
    return res.data;
  },

  /** PATCH /opd-consultation/:opdId — Update chief_complaint, clinical_notes */
  async updateVisit(
    opdId: number,
    data: { chief_complaint?: string; clinical_notes?: string }
  ) {
    const res = await apiClient.patch(`${API}/${opdId}`, data);
    return res;
  },

  /** POST /opd-consultation/:opdId/diagnoses */
  async addDiagnosis(opdId: number, data: AddDiagnosisPayload) {
    const res = await apiClient.post(`${API}/${opdId}/diagnoses`, data);
    return res.data;
  },

  /** DELETE /opd-consultation/:opdId/diagnoses/:diagId */
  async removeDiagnosis(opdId: number, diagId: number) {
    const res = await apiClient.delete(`${API}/${opdId}/diagnoses/${diagId}`);
    return res;
  },

  /** POST /opd-consultation/:opdId/procedures */
  async addProcedure(opdId: number, data: AddProcedurePayload) {
    const res = await apiClient.post(`${API}/${opdId}/procedures`, data);
    return res.data;
  },

  /** DELETE /opd-consultation/:opdId/procedures/:procId */
  async removeProcedure(opdId: number, procId: number) {
    const res = await apiClient.delete(`${API}/${opdId}/procedures/${procId}`);
    return res;
  },

  /** POST /opd-consultation/:opdId/prescriptions */
  async savePrescription(opdId: number, data: AddPrescriptionPayload) {
    const res = await apiClient.post(`${API}/${opdId}/prescriptions`, data);
    return res.data;
  },

  /** POST /opd-consultation/:opdId/tests */
  async orderTest(opdId: number, data: AddTestPayload) {
    const res = await apiClient.post(`${API}/${opdId}/tests`, data);
    return res.data;
  },

  /** DELETE /opd-consultation/:opdId/tests/:testId */
  async removeTest(opdId: number, testId: number) {
    const res = await apiClient.delete(`${API}/${opdId}/tests/${testId}`);
    return res;
  },

  /** POST /opd-consultation/:opdId/followups */
  async scheduleFollowup(opdId: number, data: AddFollowupPayload) {
    const res = await apiClient.post(`${API}/${opdId}/followups`, data);
    return res.data;
  },

  /** DELETE /opd-consultation/:opdId/followups/:followupId */
  async removeFollowup(opdId: number, followupId: number) {
    const res = await apiClient.delete(
      `${API}/${opdId}/followups/${followupId}`
    );
    return res;
  },

  /** PATCH /opd-consultation/:opdId/complete */
  async completeConsultation(opdId: number) {
    const res = await apiClient.patch(`${API}/${opdId}/complete`);
    return res;
  },

  // ─── Lookups (for Dropdown SearchableSelects) ─────────────

  /** GET /opd-consultation/lookup/diagnoses?search=... */
  async lookupDiagnoses(search?: string) {
    const res = await apiClient.get(`${API}/lookup/diagnoses`, {
      params: { search },
    });
    return res.data;
  },

  /** GET /opd-consultation/lookup/procedures?search=... */
  async lookupProcedures(search?: string) {
    const res = await apiClient.get(`${API}/lookup/procedures`, {
      params: { search },
    });
    return res.data;
  },

  /** GET /opd-consultation/lookup/medicines?search=... */
  async lookupMedicines(search?: string) {
    const res = await apiClient.get(`${API}/lookup/medicines`, {
      params: { search },
    });
    return res.data;
  },

  /** GET /opd-consultation/lookup/tests?search=... */
  async lookupTests(search?: string) {
    const res = await apiClient.get(`${API}/lookup/tests`, {
      params: { search },
    });
    return res.data;
  },
};
