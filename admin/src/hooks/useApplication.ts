// src/hooks/useApplication.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getApplications, getApplicationById, deleteApplication } from "../services/application";
import toast from "react-hot-toast";

export const useApplications = () => {
  return useQuery({
    queryKey: ["applications"],
    queryFn: getApplications,
  });
};

export const useApplication = (id: string) => {
  return useQuery({
    queryKey: ["application", id],
    queryFn: () => getApplicationById(id),
    enabled: !!id, // ID mavjud bo'lsa so'rov yuboradi
  });
};

export const useApplicationMutations = () => {
  const queryClient = useQueryClient();

  const remove = useMutation({
    mutationFn: deleteApplication,
    onMutate: () => {
      toast.loading("Deleting application...", { id: "deleteApplication" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications"] });
      toast.success("Application deleted successfully", { id: "deleteApplication" });
    },
    onError: (error) => {
      toast.error("Failed to delete application", { id: "deleteApplication" });
      console.error("Failed to delete application:", error);
    },
  });

  return { remove };
};