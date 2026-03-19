import { apiClient } from "@/lib/axios";

const API = `/hospital-admin/receptionists`;

export interface GetReceptionistsParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}

export interface CreateReceptionistPayload {
  full_name: string;
  email: string;
  phone_number: string;
  is_active?: boolean;
}

export interface UpdateReceptionistPayload
  extends Partial<CreateReceptionistPayload> {}

export const receptionistService = {
  async getReceptionists(hospitalId: number, params: GetReceptionistsParams) {
    const res = await apiClient.get(`${API}/${hospitalId}`, { params });
    return res.data;
  },

  async createReceptionist(
    hospitalId: number,
    payload: CreateReceptionistPayload
  ) {
    const res = await apiClient.post(`${API}/${hospitalId}`, payload);
    return res.data;
  },

  async updateReceptionist(
    userId: number,
    payload: UpdateReceptionistPayload
  ) {
    const res = await apiClient.patch(`${API}/${userId}`, payload);
    return res.data;
  },

  async toggleStatus(userId: number) {
    const res = await apiClient.patch(`${API}/${userId}/status`);
    return res.data;
  },

  async resetPassword(userId: number) {
    const res = await apiClient.patch(`${API}/${userId}/reset-password`);
    return res.data;
  },
};
