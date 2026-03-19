"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  diagnosisService,
  GetDiagnosesParams,
} from "@/services/diagnosis.service";

export const useDiagnoses = (params: GetDiagnosesParams) => {
  return useQuery({
    queryKey: ["diagnosis", params],
    queryFn: () => diagnosisService.getDiagnosis(params),
    placeholderData: (previousData) => previousData,
  });
};

export const useMasterDiagnoses = (
  hospitalId: number,
  search: string,
  department: string
) => {
  return useQuery({
    queryKey: ["master-diagnoses", hospitalId, search, department],
    queryFn: () =>
      diagnosisService.getMasterDiagnoses(hospitalId, {
        search,
        department_name: department === "All" ? undefined : department,
      }),
  });
};

export const useEnabledDiagnoses = (
  hospitalId: number,
  search: string,
  department: string
) => {
  return useQuery({
    queryKey: ["enabled-diagnoses", hospitalId, search, department],
    queryFn: () =>
      diagnosisService.getEnabledDiagnoses(hospitalId, {
        search,
        department_name: department === "All" ? undefined : department,
      }),
  });
};

export const useDiagnosisStats = (hospitalId: number) => {
  return useQuery({
    queryKey: ["diagnosis-stats", hospitalId],
    queryFn: () => diagnosisService.getDiagnosisStats(hospitalId),
  });
};

export const useEnableDiagnosis = (hospitalId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: diagnosisService.enableDiagnosis,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["master-diagnoses", hospitalId] });
      queryClient.invalidateQueries({ queryKey: ["enabled-diagnoses", hospitalId] });
      queryClient.invalidateQueries({ queryKey: ["diagnosis-stats", hospitalId] });
    },
  });
};

export const useUpdateDiagnosisStatus = (hospitalId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      hospitalDiagnosisId,
      isActive,
    }: {
      hospitalDiagnosisId: number;
      isActive: boolean;
    }) =>
      diagnosisService.updateDiagnosisStatus(hospitalDiagnosisId, { isActive }),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["enabled-diagnoses", hospitalId] });
      queryClient.invalidateQueries({ queryKey: ["diagnosis-stats", hospitalId] });
    },
  });
};
