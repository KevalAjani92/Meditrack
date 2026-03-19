import { useMutation, useQueryClient } from "@tanstack/react-query";
import { procedureService } from "@/services/procedure.service";

export const useUpdateProcedure = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: any }) =>
      procedureService.updateProcedure(id, payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["procedures"],
      });
    },
  });
};
