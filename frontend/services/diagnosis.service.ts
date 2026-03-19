import { apiClient } from "@/lib/axios";

const API = "/diagnosis";

export interface GetDiagnosesParams {
  page?: number;
  limit?: number;
  search?: string;
  department_id?: string;
}
export const diagnosisService = {
  async getDiagnosis(params: GetDiagnosesParams) {
    const res = await apiClient.get(`${API}/superadmin/all`, {
      params,
    });
    return res.data;
  },

  async createDiagnosis(payload: any) {
    const res = await apiClient.post(API, payload);
    return res.data;
  },
  async updateDiagnosis(id: number, payload: any) {
    const res = await apiClient.patch(`${API}/${id}`, payload);
    return res.data;
  },

  getMasterDiagnoses: async (
    hospitalId: number,
    params: { search?: string; department_name?: string },
  ) => {
    const res = await apiClient.get(`/diagnosis/master/${hospitalId}`, {
      params,
    });

    return res.data;
  },

  getEnabledDiagnoses: async (
    hospitalId: number,
    params: { search?: string; department_name?: string },
  ) => {
    const res = await apiClient.get(`/diagnosis/enabled/${hospitalId}`, {
      params,
    });

    return res.data;
  },

  getDiagnosisStats: async (hospitalId: number) => {
    const res = await apiClient.get(`/diagnosis/stats/${hospitalId}`);    
    return res.data;
  },

  enableDiagnosis: async (payload: {
    hospitalId: number;
    diagnosis_id: number;
    isActive: boolean;
  }) => {
    const res = await apiClient.post(`/diagnosis/enable`, payload);
    return res.data;
  },

  updateDiagnosisStatus: async (
    hospitalDiagnosisId: number,
    payload: { isActive: boolean },
  ) => {
    const res = await apiClient.patch(
      `/diagnosis/status/${hospitalDiagnosisId}`,
      payload,
    );

    return res.data;
  },
};
