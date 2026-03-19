import { useMutation, useQueryClient } from "@tanstack/react-query";
import { medicineService } from "@/services/medicine.service";

export const useUpdateMedicine = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id?: number; payload: any }) =>
      medicineService.updateMedicine(id!, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["medicines"] });
    },
  });
};
