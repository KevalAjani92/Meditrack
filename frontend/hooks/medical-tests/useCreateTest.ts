import { useMutation, useQueryClient } from "@tanstack/react-query";
import { medicalTestService } from "@/services/medical-test.service";

export const useCreateTest = () => {
  const queryClient = useQueryClient();

    return useMutation({
        mutationFn: medicalTestService.createMedicalTest,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["medical-tests"] });
        },
    });
}
