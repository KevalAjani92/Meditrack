import { apiClient } from "@/lib/axios";

export const opdService = {
  createOpdVisit: async (payload: any) => {
    const res = await apiClient.post("/opd-visits", payload);
    console.log(res.data);
    return res.data;
  },
};
