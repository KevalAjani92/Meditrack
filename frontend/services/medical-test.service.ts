import {apiClient} from "@/lib/axios";

const API = "/medical-tests";

export interface GetMedicalTestsParams {
  page?: number;
  limit?: number;
  search?: string;
  department_id?: number;
  status?: "Active" | "Inactive";
}

export interface MedicalTestPayload {
  test_code: string;
  test_name: string;
  test_type: string;
  description?: string;
  department_id: number;
  is_active?: boolean;
}

export const medicalTestService = {
  async getMedicalTests(params: GetMedicalTestsParams) {
    const res = await apiClient.get(`${API}/superadmin/all`, { params });
    return res.data;
  },
  async createMedicalTest(payload: MedicalTestPayload) {
    const res = await apiClient.post(API, payload);
    return res.data;
  },

  async updateMedicalTest(
    id: number,
    payload: MedicalTestPayload) {
    const res = await apiClient.patch(`${API}/${id}`, payload);
    return res.data;
  },


  getMasterTests: async (
    hospitalId: number,
    params: { search?: string; department_name?: string }
  ) => {
    const res = await apiClient.get(`${API}/master/${hospitalId}`, { params });
    return res.data;
  },

  getEnabledTests: async (
    hospitalId: number,
    params: { search?: string; department_name?: string }
  ) => {
    const res = await apiClient.get(`${API}/enabled/${hospitalId}`, { params });
    return res.data;
  },

  getTestStats: async (hospitalId: number) => {
    const res = await apiClient.get(`${API}/stats/${hospitalId}`);
    return res.data;
  },

  enableTest: async (payload: {
    hospitalId: number;
    test_id: number;
    price: number;
    isActive: boolean;
  }) => {
    const res = await apiClient.post(`${API}/enable`, payload);
    return res.data;
  },

  updateTestStatus: async (
    hospitalTestId: number,
    payload: { price: number; isActive: boolean }
  ) => {
    const res = await apiClient.patch(
      `${API}/status/${hospitalTestId}`,
      payload
    );

    return res.data;
  },
};