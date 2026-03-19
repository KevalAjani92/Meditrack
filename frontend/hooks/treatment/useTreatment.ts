import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { treatmentService, GetTreatmentsParams } from "@/services/treatment.service";

export const useTreatments = (params: GetTreatmentsParams) => {
  return useQuery({
    queryKey: ["treatments", params],
    queryFn: () => treatmentService.getTreatments(params),
    placeholderData: (prev) => prev,
  });
};

export const useMasterTreatments = (
  hospitalId: number,
  search: string,
  department: string
) => {
  return useQuery({
    queryKey: ["master-treatments", hospitalId, search, department],
    queryFn: () =>
      treatmentService.getMasterTreatments(hospitalId, {
        search,
        department_name: department === "All" ? undefined : department,
      }),
  });
};

export const useEnabledTreatments = (
  hospitalId: number,
  search: string,
  department: string
) => {
  return useQuery({
    queryKey: ["enabled-treatments", hospitalId, search, department],
    queryFn: () =>
      treatmentService.getEnabledTreatments(hospitalId, {
        search,
        department_name: department === "All" ? undefined : department,
      }),
  });
};

export const useTreatmentStats = (hospitalId: number) => {
  return useQuery({
    queryKey: ["treatment-stats", hospitalId],
    queryFn: () => treatmentService.getTreatmentStats(hospitalId),
  });
};

export const useEnableTreatment = (hospitalId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: treatmentService.enableTreatment,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["master-treatments", hospitalId] });
      queryClient.invalidateQueries({ queryKey: ["enabled-treatments", hospitalId] });
      queryClient.invalidateQueries({ queryKey: ["treatment-stats", hospitalId] });
    },
  });
};

export const useUpdateTreatmentStatus = (hospitalId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      hospitalTreatmentId,
      isActive,
    }: {
      hospitalTreatmentId: number;
      isActive: boolean;
    }) =>
      treatmentService.updateTreatmentStatus(hospitalTreatmentId, { isActive }),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["enabled-treatments", hospitalId] });
      queryClient.invalidateQueries({ queryKey: ["treatment-stats", hospitalId] });
    },
  });
};