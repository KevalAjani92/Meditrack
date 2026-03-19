import { useMutation, useQueryClient } from "@tanstack/react-query";
import { treatmentService } from "@/services/treatment.service";
import { useToast } from "@/components/ui/toast";

export const useUpdateTreatment = () => {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: any }) =>
      treatmentService.updateTreatment(id, payload),

    onSuccess: () => {
      // 🔄 Refetch all treatment lists
      queryClient.invalidateQueries({
        queryKey: ["treatments"],
      });
    },
  });
};
