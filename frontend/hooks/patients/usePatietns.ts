import { patientService } from "@/services/patient.service";
import { useQuery } from "@tanstack/react-query";

export const useSearchPatients = (search: string) =>
  useQuery({
    queryKey: ["patients-search", search],
    queryFn: () => patientService.searchPatients({ search }),
    // enabled: !!search,
  });

export const usePatientSummary = (patientId?: number) =>
  useQuery({
    queryKey: ["patient-summary", patientId],
    queryFn: () => patientService.getPatientSummary(patientId!),
    enabled: !!patientId,
  });

export const usePatientOpdHistory = (patientId?: number) =>
  useQuery({
    queryKey: ["patient-opd-history", patientId],
    queryFn: () => patientService.getPatientOpdHistory(patientId!),
    enabled: !!patientId,
  });