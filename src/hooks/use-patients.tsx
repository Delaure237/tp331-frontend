import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getPatientsApi,
  getPatientStatsApi,
  deletePatientApi
} from "@/api/patient-api";
import { PatientPeriod } from "@/types/patient";
import { toast } from "react-hot-toast";

export function usePatients(options: { page?: number; limit?: number; search?: string; status?: string }) {
  return useQuery({
    queryKey: ["patients", options],
    queryFn: () => getPatientsApi(options),
    placeholderData: (previousData) => previousData,
  });
}

export function usePatientStats(period: PatientPeriod = "thisMonth") {
  return useQuery({
    queryKey: ["patient-stats", period],
    queryFn: () => getPatientStatsApi(period),
  });
}

export function useDeletePatient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deletePatientApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patients"] });
      queryClient.invalidateQueries({ queryKey: ["patient-stats"] });
      toast.success("Patient supprimé avec succès.");
    },
    onError: () => {
      toast.error("Erreur lors de la suppression.");
    }
  });
}