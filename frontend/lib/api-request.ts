import { apiClient } from "./axios";

export async function apiRequest(config:any) {
  try {
    const res = await apiClient(config);

    if (!res.data.success) {
      throw new Error(res.data.message || "Request failed");
    }

    return res.data;
  } catch (error: any) {
    const status = error?.response?.status;

    if (status === 401) {
      try {
        // attempt refresh
        await apiClient.post("/auth/refresh");

        // retry original request
        const retry = await apiClient(config);

        return retry.data;
      } catch {
        // refresh failed
        if (typeof window !== "undefined") {
          window.location.href = "/auth/login";
        }

        throw new Error("Session expired");
      }
    }

    throw error;
  }
}
