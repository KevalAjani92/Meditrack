// hooks/groups/useAssignGroupAdmin.ts

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { groupAdminService } from "@/services/group-admin.service";

export const useAssignGroupAdmin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      groupId,
      adminId,
    }: {
      groupId: number;
      adminId: number | null;
    }) => groupAdminService.assignAdmin(groupId, adminId),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groups"] });
      queryClient.invalidateQueries({ queryKey: ["group-admins"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
      queryClient.invalidateQueries({ queryKey: ["group-stats"] });
    },
  });
};