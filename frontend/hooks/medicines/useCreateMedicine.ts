import { useMutation, useQueryClient } from "@tanstack/react-query";
import { medicineService } from "@/services/medicine.service";

export const useCreateMedicine = () => {
  const queryClient = useQueryClient();

    return useMutation({
        mutationFn: medicineService.createMedicine,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["medicines"] });
        },
    });
}