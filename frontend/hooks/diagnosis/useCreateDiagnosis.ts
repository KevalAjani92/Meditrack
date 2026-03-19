import { diagnosisService } from "@/services/diagnosis.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCreateDiagnosis = () => {
  const queryClient = useQueryClient();

  return useMutation({ 
    mutationFn: diagnosisService.createDiagnosis,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["diagnosis"] });
    },
  })
};