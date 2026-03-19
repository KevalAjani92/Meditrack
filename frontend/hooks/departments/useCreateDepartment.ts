import { useMutation, useQueryClient } from "@tanstack/react-query";
import { departmentService } from "@/services/department.service";

export const useCreateDepartment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: departmentService.createDepartment,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departments"] });
    },
  });
};