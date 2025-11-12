// src/hooks/useUpload.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getImages, uploadImage, deleteImage } from "../services/uploadImage";

export const useUploads = () => {
  return useQuery({
    queryKey: ["uploads"],
    queryFn: getImages,
  });
};

export const useUploadMutations = () => {
  const queryClient = useQueryClient();

  // 🔹 Upload qilish
  const create = useMutation({
    mutationFn: uploadImage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["uploads"] });
    },
  });

  // 🔹 O‘chirish
  const remove = useMutation({
    mutationFn: deleteImage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["uploads"] });
    },
  });

  return { create, remove };
};
