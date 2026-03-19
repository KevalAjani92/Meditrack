import { useMutation, useQueryClient } from "@tanstack/react-query";
import { groupService, GroupPayload } from "@/services/group.service";

export const useUpdateGroup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: GroupPayload;
    }) => groupService.updateGroup(id, payload),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groups"] });
    },
  });
};