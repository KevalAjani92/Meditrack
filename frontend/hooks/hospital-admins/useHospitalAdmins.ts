import { GetHospitalAdminsParams, hospitalAdminService } from "@/services/hospital-admin.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useHospitalAdmins = (params: GetHospitalAdminsParams) => {
    const query = useQuery({
    queryKey: ["hospital-admins", params],
    queryFn: () => hospitalAdminService.getHospitalAdmins(params),
    placeholderData: (previousData) => previousData,
  });

  return query;
}

export const useAllHospitalAdmins = () => {
  const query = useQuery({
    queryKey: ["hospital-admins"],
    queryFn: () => hospitalAdminService.getAllHospitalAdmins(),
  });

  return query;
};

export const useCreateHospitalAdmin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: hospitalAdminService.create,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hospital-admins"] ,
        exact:false,});
    },
  });
}

export const useUpdateHospitalAdmin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      payload,
    }: {
      userId: number;
      payload: any;
    }) =>
      hospitalAdminService.update(userId, payload),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hospital-admins"],
        exact:false, });
    },
  });
};

export const useToggleHospitalAdminStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) =>
      hospitalAdminService.toggleStatus(id),

    onSuccess: () => {
      // 🔥 Refetch hospital admins list
      queryClient.invalidateQueries({
        queryKey: ["hospital-admins"],
        exact:false,
      });

    },
  });
};