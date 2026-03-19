export type AppointmentStatus = "Scheduled" | "Checked-In" | "Completed" | "Cancelled" | "Rescheduled" | "No-Show";

export interface Appointment {
  appointment_id: number;
  appointmentNo: string;
  doctorName: string;
  specialization: string;
  hospitalName: string;
  department: string;
  date: string;
  time: string;
  status: AppointmentStatus;
  symptoms: string;
  bookingDate: string;
  canCancel: boolean;
  isToday: boolean;
  timelineText?: string;
}

export const getStatusStyles = (status: AppointmentStatus) => {
  switch (status) {
    case "Scheduled": return "bg-primary/10 text-primary border-primary/20";
    case "Checked-In": return "bg-accent text-accent-foreground border-accent";
    case "Completed": return "bg-success/10 text-success border-success/20";
    case "Cancelled": return "bg-destructive/10 text-destructive border-destructive/20";
    case "Rescheduled": return "bg-warning/10 text-warning-foreground border-warning/20";
    case "No-Show": return "bg-muted text-muted-foreground border-border";
    default: return "bg-muted text-muted-foreground border-border";
  }
};