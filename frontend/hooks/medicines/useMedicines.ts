import { GetMedicinesParams, medicineService } from "@/services/medicine.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useMedicines = (params: GetMedicinesParams) => {
  return useQuery({
    queryKey: ["medicines", params],
    queryFn: () => medicineService.getMedicines(params),
    placeholderData: (previousData) => previousData,
  });
}

export const useMasterMedicines = (
  hospitalId: number,
  search: string,
  type: string
) => {
  return useQuery({
    queryKey: ["master-medicines", hospitalId, search, type],

    queryFn: () =>
      medicineService.getMasterMedicines(hospitalId, {
        search,
        medicine_type: type === "All" ? undefined : type,
      }),
  });
};

export const useEnabledMedicines = (
  hospitalId: number,
  search: string,
  type: string
) => {
  return useQuery({
    queryKey: ["enabled-medicines", hospitalId, search, type],

    queryFn: () =>
      medicineService.getEnabledMedicines(hospitalId, {
        search,
        medicine_type: type === "All" ? undefined : type,
      }),
  });
};

export const useMedicineStats = (hospitalId: number) => {
  return useQuery({
    queryKey: ["medicine-stats", hospitalId],
    queryFn: () => medicineService.getMedicineStats(hospitalId),
  });
};

export const useEnableMedicine = (hospitalId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: medicineService.enableMedicine,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["master-medicines", hospitalId] });
      queryClient.invalidateQueries({ queryKey: ["enabled-medicines", hospitalId] });
      queryClient.invalidateQueries({ queryKey: ["medicine-stats", hospitalId] });
    },
  });
};

export const useUpdateMedicine = (hospitalId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      hospitalMedicineId,
      price,
      stock,
      isActive,
    }: {
      hospitalMedicineId: number;
      price: number;
      stock: number;
      isActive: boolean;
    }) =>
      medicineService.updateMedicineDetail(hospitalMedicineId, {
        price,
        stock,
        isActive,
      }),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["enabled-medicines", hospitalId] });
      queryClient.invalidateQueries({ queryKey: ["medicine-stats", hospitalId] });
    },
  });
};