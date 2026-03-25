import { apiClient } from "@/lib/axios";

const API = "/doctor-opd";

export interface QueueQueryParams {
  search?: string;
  status?: string;
  type?: string;
  page?: number;
  limit?: number;
}

export const opdQueueService = {
  /** GET /doctor-opd/queue — Fetch today's queue with search, filter, pagination */
  async getQueue(params?: QueueQueryParams) {
    const res = await apiClient.get(`${API}/queue`, { params });
    return res.data;
  },

  /** GET /doctor-opd/stats — Queue insight stats */
  async getStats() {
    const res = await apiClient.get(`${API}/stats`);
    return res.data;
  },

  /** GET /doctor-opd/performance — Session performance metrics */
  async getPerformance() {
    const res = await apiClient.get(`${API}/performance`);
    return res.data;
  },

  /** GET /doctor-opd/timeline — Queue timeline events */
  async getTimeline() {
    const res = await apiClient.get(`${API}/timeline`);
    return res.data;
  },

  /** PATCH /doctor-opd/queue/:tokenId/call-next — Start consultation */
  async callNext(tokenId: number) {
    const res = await apiClient.patch(`${API}/queue/${tokenId}/call-next`);
    return res;
  },

  /** PATCH /doctor-opd/queue/:tokenId/skip — Skip a token */
  async skip(tokenId: number) {
    const res = await apiClient.patch(`${API}/queue/${tokenId}/skip`);
    return res;
  },

  /** PATCH /doctor-opd/queue/:tokenId/no-show — Mark token as No-Show */
  async noShow(tokenId: number) {
    const res = await apiClient.patch(`${API}/queue/${tokenId}/no-show`);
    return res;
  },
};
