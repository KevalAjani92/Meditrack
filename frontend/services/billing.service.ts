import { apiClient } from "@/lib/axios";

const API = "/receptionist/billing";

export interface SearchVisitsParams {
  search?: string;
  status?: string;
}

export interface CreateBillPayload {
  visit_id: number;
  bill_items: {
    item_type: string;
    reference_id?: number;
    item_description: string;
    quantity: number;
    unit_price: number;
  }[];
  tax_amount: number;
  discount_amount: number;
  payment_mode_id?: number;
  payment_amount?: number;
  payment_reference?: string;
}

export const billingService = {
  async searchVisits(hospitalId: number, params: SearchVisitsParams) {
    const res = await apiClient.get(`${API}/${hospitalId}/visits`, { params });
    return res.data;
  },

  async getVisitDetails(hospitalId: number, visitId: number) {
    const res = await apiClient.get(`${API}/${hospitalId}/visits/${visitId}`);
    return res.data;
  },

  async createBill(hospitalId: number, payload: CreateBillPayload) {
    const res = await apiClient.post(`${API}/${hospitalId}`, payload);
    return res.data;
  },

  async finalizeBill(hospitalId: number, billId: number) {
    const res = await apiClient.patch(
      `${API}/${hospitalId}/${billId}/finalize`
    );
    return res.data;
  },

  async getBill(hospitalId: number, billId: number) {
    const res = await apiClient.get(`${API}/${hospitalId}/${billId}`);
    return res.data;
  },

  async getBillByVisit(hospitalId: number, visitId: number) {
    const res = await apiClient.get(
      `${API}/${hospitalId}/by-visit/${visitId}`
    );
    return res.data;
  },

  async getBillPrintData(hospitalId: number, billId: number) {
    const res = await apiClient.get(`${API}/${hospitalId}/${billId}/print`);
    return res.data;
  },

  async downloadBillPdf(hospitalId: number, billId: number) {
    const res = await apiClient.get(`${API}/${hospitalId}/${billId}/pdf`, {
      responseType: "arraybuffer",
    });
    return res;
  },
};
