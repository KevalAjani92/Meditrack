import { apiClient } from "@/lib/axios";

const API = "/procedures";

export interface GetProceduresParams {
  page?: number;
  limit?: number;
  search?: string;
  type?: "Surgical" | "Non-Surgical";
}

export const procedureService = {
  async getProcedures(
    treatmentId: number,
    params: GetProceduresParams
  ) {
    const res = await apiClient.get(
      `${API}/superadmin/all/${treatmentId}`,
      { params }
    );
    
    return res.data;
  },

  async createProcedure(treatmentId: number, payload: any) {
    const res = await apiClient.post(
      `${API}/${treatmentId}`,
      payload
    );
    return res.data;
  },

  async updateProcedure(id: number, payload: any) {
    const res = await apiClient.patch(
      `${API}/${id}`,
      payload
    );
    return res.data;
  },

  async deleteProcedure(id: number) {
    const res = await apiClient.delete(`${API}/${id}`);
    return res.data;
  },

  getMasterProcedures: async (
    hospitalId: number,
    treatmentTypeId: number,
    params: { search?: string; type?: string }
  ) => {
    const res = await apiClient.get(
      `/procedures/master/${hospitalId}/${treatmentTypeId}`,
      { params }
    );

    return res.data;
  },

  getEnabledProcedures: async (
    hospitalId: number,
    treatmentTypeId: number,
    params: { search?: string; type?: string }
  ) => {
    const res = await apiClient.get(
      `/procedures/enabled/${hospitalId}/${treatmentTypeId}`,
      { params }
    );

    return res.data;
  },

  getProcedureStats: async (
    hospitalId: number,
    treatmentTypeId: number
  ) => {
    const res = await apiClient.get(
      `/procedures/stats/${hospitalId}/${treatmentTypeId}`
    );

    return res.data;
  },

  enableProcedure: async (payload: {
    hospitalId: number;
    procedure_id: number;
    price: number;
    isActive: boolean;
  }) => {
    const res = await apiClient.post(`/procedures/enable`, payload);

    return res.data;
  },

  updateProcedureDetail: async (
    hospitalProcedureId: number,
    payload: { price: number; isActive: boolean }
  ) => {
    const res = await apiClient.patch(
      `/procedures/update/${hospitalProcedureId}`,
      payload
    );

    return res.data;
  },

  getTreatmentDetail: async (treatmentTypeId: number) => {
    const res = await apiClient.get(
      `/procedures/treatment-detail/${treatmentTypeId}`
    );
    return res.data;
  },
};