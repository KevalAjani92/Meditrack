import { apiClient } from "@/lib/axios";

const API = "/medicines";

export interface GetMedicinesParams {
  page?: number;
  limit?: number;
  search?: string;
  type?: string;
  status?: "Active" | "Inactive";
}

export interface MedicinePayload {
  medicine_code: string;
  medicine_name: string;
  medicine_type: string;
  manufacturer: string;
  description?: string;
  is_active?: boolean;
}

export const medicineService = {
  async getMedicines(params: GetMedicinesParams) {
    const res = await apiClient.get(`${API}/superadmin/all`, { params });
    return res.data;
  },
  async createMedicine(payload: MedicinePayload) {
    const res = await apiClient.post(API, payload);
    return res.data;
  },

  async updateMedicine(id: number, payload: MedicinePayload) {
    const res = await apiClient.patch(`${API}/${id}`, payload);
    return res.data;
  },

  getMasterMedicines: async (
    hospitalId: number,
    params: { search?: string; medicine_type?: string }
  ) => {
    const res = await apiClient.get(`/medicines/master/${hospitalId}`, {
      params,
    });

    return res.data;
  },

  getEnabledMedicines: async (
    hospitalId: number,
    params: { search?: string; medicine_type?: string }
  ) => {
    const res = await apiClient.get(`/medicines/enabled/${hospitalId}`, {
      params,
    });

    return res.data;
  },

  getMedicineStats: async (hospitalId: number) => {
    const res = await apiClient.get(`/medicines/stats/${hospitalId}`);
    return res.data;
  },

  enableMedicine: async (payload: {
    hospitalId: number;
    medicine_id: number;
    price: number;
    stock: number;
    isActive: boolean;
  }) => {
    const res = await apiClient.post(`/medicines/enable`, payload);
    return res.data;
  },

  updateMedicineDetail: async (
    hospitalMedicineId: number,
    payload: { price: number; stock: number; isActive: boolean }
  ) => {
    const res = await apiClient.patch(
      `/medicines/update/${hospitalMedicineId}`,
      payload
    );

    return res.data;
  },
};
