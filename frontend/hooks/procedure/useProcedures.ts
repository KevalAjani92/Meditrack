import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  procedureService,
  GetProceduresParams,
} from "@/services/procedure.service";

export const useProcedures = (
  treatmentId: number,
  params: GetProceduresParams,
) => {
  return useQuery({
    queryKey: ["procedures", treatmentId, params],
    queryFn: () => procedureService.getProcedures(treatmentId, params),
    enabled: !!treatmentId,
    placeholderData: (prev) => prev,
  });
};

export const useMasterProcedures = (
  hospitalId: number,
  treatmentTypeId: number,
  search: string,
  type: string
) => {
  return useQuery({
    queryKey: [
      "master-procedures",
      hospitalId,
      treatmentTypeId,
      search,
      type,
    ],

    queryFn: () =>
      procedureService.getMasterProcedures(hospitalId, treatmentTypeId, {
        search,
        type: type === "All" ? undefined : type,
      }),
  });
};

export const useEnabledProcedures = (
  hospitalId: number,
  treatmentTypeId: number,
  search: string,
  type: string
) => {
  return useQuery({
    queryKey: [
      "enabled-procedures",
      hospitalId,
      treatmentTypeId,
      search,
      type,
    ],

    queryFn: () =>
      procedureService.getEnabledProcedures(hospitalId, treatmentTypeId, {
        search,
        type: type === "All" ? undefined : type,
      }),
  });
};

export const useProcedureStats = (
  hospitalId: number,
  treatmentTypeId: number
) => {
  return useQuery({
    queryKey: ["procedure-stats", hospitalId, treatmentTypeId],

    queryFn: () =>
      procedureService.getProcedureStats(hospitalId, treatmentTypeId),
  });
};

export const useTreatmentDetail = (treatmentTypeId: number) => {
  return useQuery({
    queryKey: ["treatment-detail", treatmentTypeId],

    queryFn: () => procedureService.getTreatmentDetail(treatmentTypeId),
  });
};

export const useEnableProcedure = (
  hospitalId: number,
  treatmentTypeId: number
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: procedureService.enableProcedure,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["master-procedures", hospitalId, treatmentTypeId],
      });

      queryClient.invalidateQueries({
        queryKey: ["enabled-procedures", hospitalId, treatmentTypeId],
      });

      queryClient.invalidateQueries({
        queryKey: ["procedure-stats", hospitalId, treatmentTypeId],
      });
    },
  });
};

export const useUpdateProcedureDetail = (
  hospitalId: number,
  treatmentTypeId: number
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      hospitalProcedureId,
      price,
      isActive,
    }: {
      hospitalProcedureId: number;
      price: number;
      isActive: boolean;
    }) =>
      procedureService.updateProcedureDetail(hospitalProcedureId, {
        price,
        isActive,
      }),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["enabled-procedures", hospitalId, treatmentTypeId],
      });

      queryClient.invalidateQueries({
        queryKey: ["procedure-stats", hospitalId, treatmentTypeId],
      });
    },
  });
};