import { useMutation, useQueryClient } from "@tanstack/react-query";
import { groupAdminService } from "@/services/group-admin.service";

export const useUpdateGroupAdmin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      payload,
    }: {
      userId: number;
      payload: any;
    }) =>
      groupAdminService.updateGroupAdmin(userId, payload),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["group-admins"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
    },
  });
};