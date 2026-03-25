import { apiClient } from "@/lib/axios";

const API = "/receptionist/payments";

export interface GetPaymentsParams {
  page?: number;
  limit?: number;
  search?: string;
  fromDate?: string;
  toDate?: string;
  mode?: string;
  status?: string;
}

export interface RecordPaymentPayload {
  bill_id: number;
  payment_mode_id: number;
  amount_paid: number;
  reference_number?: string;
}

export const billingPaymentsService = {
  async getPaymentModes() {
    const res = await apiClient.get(`${API}/modes`);
    return res.data;
  },

  async getPayments(hospitalId: number, params: GetPaymentsParams) {
    const res = await apiClient.get(`${API}/${hospitalId}`, { params });
    return res.data;
  },

  async recordPayment(hospitalId: number, payload: RecordPaymentPayload) {
    const res = await apiClient.post(`${API}/${hospitalId}`, payload);
    return res.data;
  },

  async getPaymentDetail(hospitalId: number, paymentId: number) {
    const res = await apiClient.get(`${API}/${hospitalId}/${paymentId}`);
    return res.data;
  },

  async getReceiptPrintData(hospitalId: number, paymentId: number) {
    const res = await apiClient.get(
      `${API}/${hospitalId}/${paymentId}/print`
    );
    return res.data;
  },

  async downloadReceiptPdf(hospitalId: number, paymentId: number) {
    const res = await apiClient.get(`${API}/${hospitalId}/${paymentId}/pdf`, {
      responseType: "arraybuffer",
    });
    return res;
  },
};
