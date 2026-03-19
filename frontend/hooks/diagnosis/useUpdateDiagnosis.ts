import { diagnosisService } from "@/services/diagnosis.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useUpdateDiagnosis = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: any }) =>
      diagnosisService.updateDiagnosis(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["diagnosis"] });
    },
  });
};
