import { appointmentService } from "@/services/appointment.service";
import { useQuery } from "@tanstack/react-query";

export const useTodayAppointments = (hospitalId: number) =>
  useQuery({
    queryKey: ["today-appointments", hospitalId],
    queryFn: () => appointmentService.getTodayAppointments(hospitalId),
  });

export const useAppointmentDetails = (appointmentId?: number) =>
  useQuery({
    queryKey: ["appointment-detail", appointmentId],
    queryFn: () => appointmentService.getAppointmentDetails(appointmentId!),
    enabled: !!appointmentId,
  });