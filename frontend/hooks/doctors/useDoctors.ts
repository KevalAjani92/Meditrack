import {
  DoctorAppointmentsParams,
  doctorService,
} from "@/services/doctor.service";
import { useQuery } from "@tanstack/react-query";

export const useOpdDoctors = (hospitalId: number, patientId: any) =>
  useQuery({
    queryKey: ["opd-doctors", hospitalId],
    queryFn: () =>
      doctorService.getOpdDoctors({
        hospitalId: hospitalId,
        // department_id: departmentId!,
      }),
    enabled: !!patientId,
  });

export const useDoctorQueueStatus = (doctorId?: number) =>
  useQuery({
    queryKey: ["doctor-queue-status", doctorId],
    queryFn: () => doctorService.getDoctorQueueStatus(doctorId!),
    enabled: !!doctorId,
    refetchInterval: 10000,
  });

export const useDoctorAppointments = (params: DoctorAppointmentsParams) => {
  return useQuery({
    queryKey: ["doctor-appointments", params],
    queryFn: () => doctorService.getDoctorAppointments(params),
    placeholderData: (previousData) => previousData,
  });
};

export const useDoctorWeekSummary = (weekStart: string) => {
  return useQuery({
    queryKey: ["doctor-week-summary", weekStart],
    queryFn: () => doctorService.getDoctorWeekSummary(weekStart),
    placeholderData: (previousData) => previousData,
  });
};

export const useDoctorQueue = (params: any) => {
  return useQuery({
    queryKey: ["doctor-opd-queue", params],
    queryFn: () => doctorService.getDoctorQueue(params),
    placeholderData: (previousData) => previousData,
  });
};

export const useDoctorPerformance = () => {
  return useQuery({
    queryKey: ["doctor-performance"],
    queryFn: doctorService.getDoctorPerformance,
  });
};
