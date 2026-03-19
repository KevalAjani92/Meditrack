import { apiClient } from "@/lib/axios";

const API = `/hospitals`;

export interface GetHospitalsParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}

export interface HospitalPayload {
  hospital_name: string;
  hospital_code: string;
  registration_validity_months?: number;
  receptionist_contact: string;
  opening_date: string;
  address: string;
  pincode: string;
  city_id?: number | null;
  state_id?: number | null;
  description?: string | null;
  registration_no?: string | null;
  license_no?: string | null;
  gst_no?: string | null;
  contact_phone?: string | null;
  contact_email?: string | null;
  opening_time?: string | null;
  closing_time?: string | null;
  is_24by7?: boolean;
}

export const hospitalService = {
  async getHospitals(params: GetHospitalsParams) {
    const res = await apiClient.get(`${API}/groupadmin/all`, { params });
    return res.data;
  },

  async getAllHospitals() {
    const res = await apiClient.get(`${API}`);
    return res.data;
  },

  async createHospital(payload: HospitalPayload) {
    const res = await apiClient.post(API, payload);
    return res.data;
  },

  async updateHospital(id: number, payload: HospitalPayload) {
    const res = await apiClient.patch(`${API}/${id}`, payload);
    return res.data;
  },

  async toggleStatus(id: number) {
    const res = await apiClient.patch(`${API}/${id}/toggle-status`);
    return res.data;
  },
};