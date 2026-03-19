import { apiClient } from "@/lib/axios";

const API = `/hospital-admins`;

export interface GetHospitalAdminsParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}

export const hospitalAdminService = {
  async getHospitalAdmins(params: GetHospitalAdminsParams) {
    const res = await apiClient.get(`${API}/groupadmin/all`, {
      params,
    });
    return res.data;
  },
  async getAllHospitalAdmins() {
    const res = await apiClient.get(`${API}`);
    return res.data;
  },
  async create(payload:any){
    const res = await apiClient.post(API,payload);
    return res.data;
  },
  async update(id:number,payload:any){
    const res = await apiClient.patch(`${API}/${id}`, payload);
    return res.data;
  },
  async toggleStatus(id: number) {
    const res = await apiClient.patch(`${API}/${id}/status`);
    return res.data.data;
  },
};
