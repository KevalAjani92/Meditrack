import { GetMedicalTestsParams, medicalTestService } from "@/services/medical-test.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useTests = (params: GetMedicalTestsParams) => {
  return useQuery({
    queryKey: ["medical-tests", params],
    queryFn: () => medicalTestService.getMedicalTests(params),
    placeholderData: (previousData) => previousData,
  });
}

export const useMasterTests = (
  hospitalId: number,
  search: string,
  department: string
) => {
  return useQuery({
    queryKey: ["master-tests", hospitalId, search, department],
    queryFn: () =>
      medicalTestService.getMasterTests(hospitalId, {
        search,
        department_name: department === "All" ? undefined : department,
      }),
  });
};

export const useEnabledTests = (
  hospitalId: number,
  search: string,
  department: string
) => {
  return useQuery({
    queryKey: ["enabled-tests", hospitalId, search, department],
    queryFn: () =>
      medicalTestService.getEnabledTests(hospitalId, {
        search,
        department_name: department === "All" ? undefined : department,
      }),
  });
};

export const useTestStats = (hospitalId: number) => {
  return useQuery({
    queryKey: ["test-stats", hospitalId],
    queryFn: () => medicalTestService.getTestStats(hospitalId),
  });
};

export const useEnableTest = (hospitalId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: medicalTestService.enableTest,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["master-tests", hospitalId] });
      queryClient.invalidateQueries({ queryKey: ["enabled-tests", hospitalId] });
      queryClient.invalidateQueries({ queryKey: ["test-stats", hospitalId] });
    },
  });
};

export const useUpdateTestStatus = (hospitalId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      hospitalTestId,
      price,
      isActive,
    }: {
      hospitalTestId: number;
      price: number;
      isActive: boolean;
    }) =>
      medicalTestService.updateTestStatus(hospitalTestId, { price, isActive }),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["enabled-tests", hospitalId] });
      queryClient.invalidateQueries({ queryKey: ["test-stats", hospitalId] });
    },
  });
};