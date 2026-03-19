import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { departmentService } from "@/services/department.service";

export const useDepartments = (params: any) => {
  return useQuery({
    queryKey: ["departments", params],
    queryFn: () => departmentService.getDepartments(params),
    placeholderData: (previousData) => previousData,
  });
};

export const useAllDepartments = () => {
  return useQuery({
    queryKey: ["departments"],
    queryFn: () => departmentService.getAllDepartments(),
    placeholderData: (previousData) => previousData,
  });
};

export const useMasterDepartments = (hospitalId: number, search: string) => {
  return useQuery({
    queryKey: ["master-departments", hospitalId, search],
    queryFn: () =>
      departmentService.getMasterDepartments(hospitalId, { search }),
  });
};

export const useEnabledDepartments = (hospitalId: number, search: string) => {
  return useQuery({
    queryKey: ["enabled-departments", hospitalId, search],
    queryFn: () =>
      departmentService.getEnabledDepartments(hospitalId, { search }),
  });
};

export const useDepartmentStats = (hospitalId: number) => {
  return useQuery({
    queryKey: ["department-stats", hospitalId],
    queryFn: () => departmentService.getDepartmentStats(hospitalId),
  });
};

export const useEnableDepartment = (hospitalId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: departmentService.enableDepartment,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["master-departments", hospitalId] });
      queryClient.invalidateQueries({ queryKey: ["enabled-departments", hospitalId] });
      queryClient.invalidateQueries({ queryKey: ["department-stats", hospitalId] });
    },
  });
};

export const useUpdateDepartmentStatus = (hospitalId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      hospitalDepartmentId,
      isActive,
    }: {
      hospitalDepartmentId: number;
      isActive: boolean;
    }) =>
      departmentService.updateDepartmentStatus(hospitalDepartmentId, { isActive }),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["enabled-departments", hospitalId] });
      queryClient.invalidateQueries({ queryKey: ["department-stats", hospitalId] });
    },
  });
};