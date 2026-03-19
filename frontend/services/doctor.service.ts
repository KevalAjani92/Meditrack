import { apiClient } from "@/lib/axios";

const API = `/hospital-admin/doctors`;

export interface GetDoctorsParams {
  page?: number;
  limit?: number;
  search?: string;
  department_id?: number;
  status?: string;
}

export interface CreateDoctorPayload {
  full_name: string;
  email: string;
  phone_number: string;
  department_id: number;
  specialization_id: number;
  gender: string;
  qualification: string;
  experience_years: number;
  consultation_fees: number;
  medical_license_no: string;
  is_available?: boolean;
  is_active?: boolean;
  description?: string;
}

export interface DoctorAppointmentsParams {
  date: string;
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  time?: string;
}

export interface UpdateDoctorPayload extends Partial<CreateDoctorPayload> {}

export const doctorService = {
  async getDoctors(hospitalId: number, params: GetDoctorsParams) {
    const res = await apiClient.get(`${API}/${hospitalId}`, { params });
    return res.data;
  },

  async createDoctor(hospitalId: number, payload: CreateDoctorPayload) {
    const res = await apiClient.post(`${API}/${hospitalId}`, payload);
    return res.data;
  },

  async updateDoctor(doctorId: number, payload: UpdateDoctorPayload) {
    const res = await apiClient.patch(`${API}/${doctorId}`, payload);
    return res.data;
  },

  async toggleStatus(doctorId: number) {
    const res = await apiClient.patch(`${API}/${doctorId}/status`);
    return res.data;
  },

  async resetPassword(doctorId: number) {
    const res = await apiClient.patch(`${API}/${doctorId}/reset-password`);
    return res.data;
  },

  async getDepartmentDropdown(hospitalId: number) {
    const res = await apiClient.get(`${API}/departments/${hospitalId}`);
    return res.data;
  },

  async getSpecializations() {
    const res = await apiClient.get(`${API}/specializations`);
    return res.data;
  },

  getOpdDoctors: async (params: {
    hospitalId: number;
    // department_id: number;
  }) => {
    const res = await apiClient.get(`/doctor/opd-list`, { params });
    return res.data;
  },

  getDoctorQueueStatus: async (doctorId: number) => {
    const res = await apiClient.get(`/doctor/queue/doctor-status/${doctorId}`);
    return res.data;
  },

  getDoctorAppointments: async (params: DoctorAppointmentsParams) => {
    const res = await apiClient.get(`/doctor/appointments`, { params });
    return res.data;
  },
  getDoctorWeekSummary: async (weekStart: string) => {
    const res = await apiClient.get("/doctor/appointments/week-summary", {
      params: {
        weekStart,
      },
    });
    // console.log(res.data)
    return res.data;
  },

  getDoctorQueue: async (params: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    type?: string;
  }) => {
    const { data } = await apiClient.get("/doctor/opd-queue", {
      params,
    });
    return data;
  },
  getDoctorPerformance: async () => {
    const { data } = await apiClient.get("/doctor/opd-performance");

    return data;
  },
};
