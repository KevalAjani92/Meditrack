export interface ReportFilters {
  dateRange: "today" | "yesterday" | "this-week" | "this-month" | "last-month" | "custom";
  hospitalId: string; // 'all' or specific ID
  departmentId: string; // 'all' or specific ID
  compareMode: boolean;
}

export interface KpiData {
  appointments: { value: number; delta: number };
  patients: { value: number; delta: number };
  activeDoctors: { value: number; delta: number };
  revenue: { value: string; delta: number };
  avgDailyAppointments: { value: number; delta: number };
  noShowRate: { value: string; delta: number };
  avgWaitTime: { value: string; delta: number };
}

export interface HospitalSummary {
  id: string;
  name: string;
  appointments: number;
  doctors: number;
  patients: number;
  revenue: string;
  noShowRate: string;
  status: "Active" | "Inactive";
}

export interface ChartDataPoint {
  name: string; // Date or Category
  value: number;
  compareValue?: number; // For comparison mode
}

// --- Mock Data ---
export const mockKpiData: KpiData = {
  appointments: { value: 12450, delta: 12.5 },
  patients: { value: 8320, delta: 8.4 },
  activeDoctors: { value: 145, delta: 2.1 },
  revenue: { value: "$452,000", delta: 15.3 },
  avgDailyAppointments: { value: 415, delta: 5.2 },
  noShowRate: { value: "4.2%", delta: -1.5 }, // Negative delta is good here
  avgWaitTime: { value: "14m", delta: -2.0 },
};

export const mockHospitalSummary: HospitalSummary[] = [
  { id: "h1", name: "Apex Heart Institute", appointments: 4500, doctors: 45, patients: 3200, revenue: "$180,000", noShowRate: "3.5%", status: "Active" },
  { id: "h2", name: "City West Clinic", appointments: 3200, doctors: 30, patients: 2100, revenue: "$120,000", noShowRate: "5.1%", status: "Active" },
  { id: "h3", name: "North General", appointments: 2800, doctors: 28, patients: 1800, revenue: "$95,000", noShowRate: "4.8%", status: "Active" },
  { id: "h4", name: "Southside OPD", appointments: 1950, doctors: 22, patients: 1220, revenue: "$57,000", noShowRate: "6.2%", status: "Inactive" },
];

export const mockTrendData: ChartDataPoint[] = [
  { name: "Week 1", value: 400, compareValue: 350 },
  { name: "Week 2", value: 450, compareValue: 380 },
  { name: "Week 3", value: 420, compareValue: 400 },
  { name: "Week 4", value: 500, compareValue: 410 },
];