import { useQuery } from "@tanstack/react-query";
import { groupAdminService } from "@/services/group-admin.service";

export const useGroupAdminStats = () => {
  return useQuery({
    queryKey: ["admin-stats"],
    queryFn: groupAdminService.getGroupAdminStats,
    staleTime: 1000 * 60 * 5, // 5 minutes cache
  });
};