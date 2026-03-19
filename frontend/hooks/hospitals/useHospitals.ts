import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { hospitalService, GetHospitalsParams, HospitalPayload } from "@/services/hospital.service";

export const useHospitals = (params: GetHospitalsParams) => {
  return useQuery({
    queryKey: ["hospitals", params],
    queryFn: () => hospitalService.getHospitals(params),
    placeholderData: (previousData) => previousData,
  });
};

export const useCreateHospital = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: HospitalPayload) =>
      hospitalService.createHospital(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hospitals"] });
    },
  });
};

export const useUpdateHospital = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: HospitalPayload }) =>
      hospitalService.updateHospital(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hospitals"] });
    },
  });
};