// src/hooks/useCertificate.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getCertificates,
  getCertificateById,
  createCertificate,
  updateCertificate,
  deleteCertificate,
} from "../services/certificate";
import toast from "react-hot-toast";

export const useCertificates = () => {
  return useQuery({
    queryKey: ["certificates"],
    queryFn: getCertificates,
  });
};

export const useCertificate = (id: string) => {
  return useQuery({
    queryKey: ["certificate", id],
    queryFn: () => getCertificateById(id),
    enabled: !!id,
  });
};

export const useCertificateMutations = () => {
  const queryClient = useQueryClient();

  const create = useMutation({
    mutationFn: createCertificate,
    onMutate: () => {
      toast.loading("Creating certificate...", { id: "createCertificate" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["certificates"] });
      toast.success("Certificate created successfully", { id: "createCertificate" });
    },
    onError: () => {
      toast.error("Failed to create certificate", { id: "createCertificate" });
    },
  });

  const update = useMutation({
    mutationFn: ({ id, data }: { id: string; data: FormData }) => updateCertificate(id, data),
    onMutate: () => {
      toast.loading("Updating certificate...", { id: "updateCertificate" });
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["certificates"] });
      queryClient.invalidateQueries({ queryKey: ["certificate", id] });
      toast.success("Certificate updated successfully", { id: "updateCertificate" });
    },
    onError: (error) => {
      toast.error("Failed to update certificate", { id: "updateCertificate" });
      console.error("Failed to update certificate:", error);
    },
  });

  const remove = useMutation({
    mutationFn: deleteCertificate,
    onMutate: () => {
      toast.loading("Deleting certificate...", { id: "deleteCertificate" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["certificates"] });
      toast.success("Certificate deleted successfully", { id: "deleteCertificate" });
    },
    onError: () => {
      toast.error("Failed to delete certificate", { id: "deleteCertificate" });
    },
  });

  return { create, update, remove };
};