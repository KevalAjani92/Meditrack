import {apiClient} from "@/lib/axios";

const API = "/treatment-types";

export interface GetTreatmentsParams {
  page?: number;
  limit?: number;
  search?: string;
  department_id?: number;
  status?: "Active" | "Inactive";
}
export interface TreatmentPayload {
  treatment_code: string;
  treatment_name: string;
  description?: string;
  department_id: number;
  is_active?: boolean;
}

export const treatmentService = {
  async getTreatments(params: GetTreatmentsParams) {
    const res = await apiClient.get(`${API}/superadmin/all`, { params });
    return res.data;
  },
  async createTreatment(payload: TreatmentPayload) {
    const res = await apiClient.post(API, payload);
    return res.data;
  },

  async updateTreatment(
    id: number,
    payload: TreatmentPayload
  ) {
    const res = await apiClient.patch(`${API}/${id}`, payload);
    return res.data;
  },

  getMasterTreatments: async (
    hospitalId: number,
    params: { search?: string; department_name?: string }
  ) => {
    const res = await apiClient.get(
      `/treatment-types/master/${hospitalId}`,
      { params }
    );

    return res.data;
  },

  getEnabledTreatments: async (
    hospitalId: number,
    params: { search?: string; department_name?: string }
  ) => {
    const res = await apiClient.get(
      `/treatment-types/enabled/${hospitalId}`,
      { params }
    );

    return res.data;
  },

  getTreatmentStats: async (hospitalId: number) => {
    const res = await apiClient.get(`/treatment-types/stats/${hospitalId}`);
    return res.data;
  },

  enableTreatment: async (payload: {
    hospitalId: number;
    treatment_type_id: number;
    isActive: boolean;
  }) => {
    const res = await apiClient.post(`/treatment-types/enable`, payload);
    return res.data;
  },

  updateTreatmentStatus: async (
    hospitalTreatmentId: number,
    payload: { isActive: boolean }
  ) => {
    const res = await apiClient.patch(
      `/treatment-types/status/${hospitalTreatmentId}`,
      payload
    );

    return res.data;
  },
};