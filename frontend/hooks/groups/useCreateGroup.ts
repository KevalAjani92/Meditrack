import { useMutation, useQueryClient } from "@tanstack/react-query";
import { groupService, GroupPayload } from "@/services/group.service";

export const useCreateGroup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: GroupPayload) =>
      groupService.createGroup(payload),

    onSuccess: () => {
      // 🔥 Automatically refresh groups list
      queryClient.invalidateQueries({ queryKey: ["groups"] });
    },
  });
};