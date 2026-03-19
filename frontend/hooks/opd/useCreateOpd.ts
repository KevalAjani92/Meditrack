import { useMutation } from "@tanstack/react-query";
import { opdService } from "@/services/opd.service";

export const useCreateOpd = () => {
  return useMutation({
    mutationFn: opdService.createOpdVisit,
  });
};
