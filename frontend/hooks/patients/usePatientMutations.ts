import { useMutation } from "@tanstack/react-query";
import { patientService } from "@/services/patient.service";

export const useRegisterPatient = () => {
  return useMutation({
    mutationFn: patientService.registerPatient,
  });
};
