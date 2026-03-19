import { useMutation, useQueryClient } from "@tanstack/react-query";
import { groupAdminService } from "@/services/group-admin.service";

export const useCreateGroupAdmin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: groupAdminService.createGroupAdmin,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["group-admins"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
    },
  });
};