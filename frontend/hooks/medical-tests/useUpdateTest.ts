import { useMutation, useQueryClient } from "@tanstack/react-query";
import { medicalTestService } from "@/services/medical-test.service";

export const useUpdateTest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: any }) =>
      medicalTestService.updateMedicalTest(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["medical-tests"] });
    },
  });
};
