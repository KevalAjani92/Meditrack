import { apiClient } from "@/lib/axios";
import { PatientRegistrationData } from "@/types/patient-registration";

const API = `/patients`;

export interface UpdatePersonalPayload {
  full_name?: string;
  gender?: string;
  dob?: string;
}

export interface UpdateContactPayload {
  email?: string;
  phone_number?: string;
  address?: string;
  city_id?: number | null;
  state_id?: number | null;
  pincode?: string;
}

export interface UpdateMedicalPayload {
  blood_group_id?: number | null;
  allergies?: string;
  chronic_conditions?: string;
  current_medications?: string;
}

export interface EmergencyContactPayload {
  contact_name: string;
  contact_number: string;
  relation?: string;
  is_primary?: boolean;
}

export const patientService = {
  /** Get full patient profile */
  async getMyProfile() {
    const res = await apiClient.get(`${API}/me`);
    return res.data;
  },

  /** Update personal info */
  async updatePersonal(payload: UpdatePersonalPayload) {
    const res = await apiClient.patch(`${API}/me/personal`, payload);
    return res;
  },

  /** Update contact details */
  async updateContact(payload: UpdateContactPayload) {
    const res = await apiClient.patch(`${API}/me/contact`, payload);
    return res;
  },

  /** Update medical details */
  async updateMedical(payload: UpdateMedicalPayload) {
    const res = await apiClient.patch(`${API}/me/medical`, payload);
    return res;
  },

  /** Get emergency contacts */
  async getEmergencyContacts() {
    const res = await apiClient.get(`${API}/me/emergency-contacts`);
    return res.data;
  },

  /** Add emergency contact */
  async createEmergencyContact(payload: EmergencyContactPayload) {
    const res = await apiClient.post(`${API}/me/emergency-contacts`, payload);
    return res;
  },

  /** Update emergency contact */
  async updateEmergencyContact(id: number, payload: Partial<EmergencyContactPayload>) {
    const res = await apiClient.patch(`${API}/me/emergency-contacts/${id}`, payload);
    return res;
  },

  /** Delete emergency contact */
  async deleteEmergencyContact(id: number) {
    const res = await apiClient.delete(`${API}/me/emergency-contacts/${id}`);
    return res;
  },

  registerPatient: async (data: PatientRegistrationData) => {
    const res = await apiClient.post(
      "/patients/reception/register",
      data
    );

    return res.data;
  },

  searchPatients: async (params: { search: string }) => {
    const res = await apiClient.get("/patients/search", { params });
    return res.data;
  },

  getPatientSummary: async (patientId: number) => {
    const res = await apiClient.get(`/patients/${patientId}/summary`);
    return res.data;
  },

  getPatientOpdHistory: async (patientId: number) => {
    const res = await apiClient.get(`/patients/${patientId}/opd-history`);
    return res.data;
  },
};
