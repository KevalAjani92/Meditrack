import { useQuery } from "@tanstack/react-query";
import { GetGroupsParams, groupService } from "@/services/group.service";
import { useToast } from "@/components/ui/toast";

export const useGroups = (params: GetGroupsParams) => {
  const { addToast } = useToast();

  const query = useQuery({
    queryKey: ["groups", params],
    queryFn: () => groupService.getGroups(params),
    placeholderData: (previousData) => previousData,
  });

  if (query.isError) {
    addToast(query.error?.message || "Failed to fetch groups", "error");
  }

  return query;
};
