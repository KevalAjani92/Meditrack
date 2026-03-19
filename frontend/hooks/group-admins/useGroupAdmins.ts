import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/components/ui/toast";
import {
  GetGroupAdminsParams,
  groupAdminService,
} from "@/services/group-admin.service";

export const useGroupAdmins = (params: GetGroupAdminsParams) => {
  const query = useQuery({
    queryKey: ["group-admins", params],
    queryFn: () => groupAdminService.getGroupAdmins(params),
    placeholderData: (previousData) => previousData,
  });

  return query;
};

export const useAllGroupAdmins = () => {
  const query = useQuery({
    queryKey: ["group-admins"],
    queryFn: () => groupAdminService.getAllGroupAdmins(),
  });

  return query;
};
