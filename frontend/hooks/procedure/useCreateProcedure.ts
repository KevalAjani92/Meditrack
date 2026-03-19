import { useMutation, useQueryClient } from "@tanstack/react-query";
import { procedureService } from "@/services/procedure.service";

export const useCreateProcedure = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      treatmentId,
      payload,
    }: {
      treatmentId: number;
      payload: any;
    }) => procedureService.createProcedure(treatmentId, payload),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["procedures", variables.treatmentId],
      });
    },
  });
};
