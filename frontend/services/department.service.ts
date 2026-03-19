import { apiClient } from "@/lib/axios";

const API = "/departments";

export interface GetDepartmentsParams {
  page: number;
  limit: number;
  search?: string;
}
export interface DepartmentPayload {
  department_code: string;
  department_name: string;
  description?: string;
}
export interface DepartmentQuery {
  search?: string;
}

export const departmentService = {
  async getDepartments(params: GetDepartmentsParams) {
    const res = await apiClient.get(`${API}/superadmin/all`, {
      params,
    });

    return res.data;
  },
  async getAllDepartments() {
    const res = await apiClient.get(`${API}`);
    return res.data;
  },

  async createDepartment(payload: DepartmentPayload) {
    const res = await apiClient.post(API, payload);
    return res.data;
  },

  async updateDepartment(id: number, payload: DepartmentPayload) {
    const res = await apiClient.patch(`${API}/${id}`, payload);
    return res.data;
  },

  // ==============Hospitl-Admin============
  getMasterDepartments: async (hospitalId: number, params: DepartmentQuery) => {
    const res = await apiClient.get(
      `/departments/hospital-admin/master/${hospitalId}`,
      { params }
    );
    return res.data;
  },

  getEnabledDepartments: async (hospitalId: number, params: DepartmentQuery) => {
    const res = await apiClient.get(
      `/departments/hospital-admin/enabled/${hospitalId}`,
      { params }
    );
    return res.data;
  },

  getDepartmentStats: async (hospitalId: number) => {
    const res = await apiClient.get(
      `/departments/hospital-admin/stats/${hospitalId}`
    );
    return res.data;
  },

  enableDepartment: async (payload: {
    hospitalId: number;
    department_id: number;
    isActive: boolean;
  }) => {
    const res = await apiClient.post(`/departments/hospital-admin/enable-department`, payload);
    return res.data.data;
  },

  updateDepartmentStatus: async (
    hospitalDepartmentId: number,
    payload: { isActive: boolean }
  ) => {
    const res = await apiClient.patch(
      `/departments/hospital-admin/status/${hospitalDepartmentId}`,
      payload
    );
    return res.data.data;
  },
};
