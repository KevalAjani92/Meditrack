import { useMutation, useQueryClient } from "@tanstack/react-query";
import { departmentService } from "@/services/department.service";

export const useUpdateDepartment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number;
      payload: any;
    }) => departmentService.updateDepartment(id, payload),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departments"] });
    },
  });
};