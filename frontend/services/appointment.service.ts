import { apiClient } from "@/lib/axios";

const API = `/appointments`;

/** Payload for booking an appointment */
export interface BookAppointmentPayload {
  hospital_id: number;
  doctor_id: number;
  appointment_date: string; // YYYY-MM-DD
  appointment_time: string; // HH:mm
  remarks?: string;
}

export const appointmentService = {
  /**
   * Step 1 — List active hospitals for selection.
   */
  async getHospitals() {
    const res = await apiClient.get(`${API}/hospitals`);
    return res.data;
  },

  /**
   * Step 2 — List departments for a specific hospital.
   */
  async getDepartmentsByHospital(hospitalId: number) {
    const res = await apiClient.get(
      `${API}/hospitals/${hospitalId}/departments`
    );
    return res.data;
  },

  /**
   * Step 3 — List doctors in a department for a hospital.
   */
  async getDoctorsByDepartment(departmentId: number, hospitalId: number) {
    const res = await apiClient.get(
      `${API}/departments/${departmentId}/doctors`,
      { params: { hospitalId } }
    );
    return res.data;
  },

  /**
   * Step 4 — Get available time slots for a doctor on a date.
   */
  async getDoctorAvailability(doctorId: number, date: string) {
    const res = await apiClient.get(
      `${API}/doctors/${doctorId}/availability`,
      { params: { date } }
    );
    return res.data;
  },

  /**
   * Step 6 — Book an appointment.
   */
  async bookAppointment(payload: BookAppointmentPayload) {
    const res = await apiClient.post(`${API}/book`, payload);
    return res;
  },

  /**
   * Get all appointments for the logged-in patient.
   */
  async getMyAppointments() {
    const res = await apiClient.get(`${API}/my`);
    return res.data;
  },

  /** Cancel an appointment */
  async cancelAppointment(appointmentId: number) {
    const res = await apiClient.patch(`${API}/${appointmentId}/cancel`);
    return res;
  },

  /** Reschedule an appointment */
  async rescheduleAppointment(
    appointmentId: number,
    payload: { appointment_date: string; appointment_time: string }
  ) {
    const res = await apiClient.patch(
      `${API}/${appointmentId}/reschedule`,
      payload
    );
    return res;
  },

  getTodayAppointments: async (hospitalId: number) => {
    const res = await apiClient.get(`/appointments/today/?hospitalId=${hospitalId}`);
    return res.data;
  },

  getAppointmentDetails: async (appointmentId: number) => {
    const res = await apiClient.get(`/appointments/${appointmentId}`);
    return res.data;
  },
};
