import { useMutation, useQueryClient } from "@tanstack/react-query";
import { treatmentService } from "@/services/treatment.service";
import { useToast } from "@/components/ui/toast";

export const useCreateTreatment = () => {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  return useMutation({
    mutationFn: treatmentService.createTreatment,

    onSuccess: () => {
      // 🔄 Refetch all treatment lists
      queryClient.invalidateQueries({
        queryKey: ["treatments"],
      });

    },
  });
};