import { apiClient } from "@/lib/axios";
import { groupAdminSchema } from "@/schemas/groupAdminSchema";
import z from "zod";

const API = `/group-admins`;

export interface GetGroupAdminsParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}

export type GroupAdminPayload = z.infer<typeof groupAdminSchema>;

export const groupAdminService = {
  async getGroupAdmins(params: GetGroupAdminsParams) {
    const res = await apiClient.get(`${API}/superadmin/all`, {
      params,
    });
    return res.data;
  },

  async getGroupAdminStats() {
    const res = await apiClient.get(`${API}/stats`);
    return res.data;
  },

  async getAllGroupAdmins() {
    const res = await apiClient.get(`${API}`);
    return res.data;
  },

  async createGroupAdmin(payload: GroupAdminPayload) {
    const res = await apiClient.post(API, payload);
    return res.data;
  },
  async updateGroupAdmin(id: number, payload: GroupAdminPayload) {
    const res = await apiClient.patch(`${API}/${id}`, payload);
    return res.data;
  },
  assignAdmin: async (groupId: number, adminId: number | null) => {
    const res = await apiClient.patch(
      `${API}/${groupId}/assign-admin`,
      { adminId },
    );
    return res.data;
  },
};
