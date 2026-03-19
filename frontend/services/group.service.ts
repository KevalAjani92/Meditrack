import { apiClient } from "@/lib/axios";

const API = `/groups`;

export interface GetGroupsParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  subscription?: string;
}

export interface GroupPayload {
  group_name: string;
  group_code: string;
  registration_no?: string;
  contact_phone?: string;
  contact_email?: string;
  description?: string;
}

export const groupService = {
  getGroups: async (params: GetGroupsParams) => {
    const res = await apiClient.get(`${API}/superadmin/all`, {
      params,
    });
    return res.data;
  },

  getAllGroups: async () => {
    const res = await apiClient.get(`${API}/all`);
    return res.data;
  },

  async getGroupStats() {
    const response = await apiClient.get(`${API}/stats`);

    return response.data;
  },

  async createGroup(payload: GroupPayload) {
    const response = await apiClient.post(API, payload);
    return response.data;
  },

  async updateGroup(id: string, payload: GroupPayload) {
    const response = await apiClient.patch(`${API}/${id}`, payload);
    return response.data;
  },

  
};
