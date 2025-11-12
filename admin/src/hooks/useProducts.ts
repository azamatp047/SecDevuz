// src/hooks/useProducts.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../services/products";
import toast from "react-hot-toast";

export const useProducts = () => {
  return useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  });
};

export const useProduct = (id: string) => {
  return useQuery({
    queryKey: ["product", id],
    queryFn: () => getProductById(id),
    enabled: !!id,
  });
};

// Removed useProductCategories as categories are now created by name directly in the form

export const useProductMutations = () => {
  const queryClient = useQueryClient();

  const create = useMutation({
    mutationFn: createProduct,
    onMutate: () => {
      toast.loading("Creating product...", { id: "createProduct" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product created successfully", { id: "createProduct" });
    },
    onError: (error) => {
      toast.error("Failed to create product", { id: "createProduct" });
      console.error("Failed to create product:", error);
    },
  });

  const update = useMutation({
    mutationFn: ({ id, data }: { id: string; data: FormData }) => updateProduct(id, data),
    onMutate: () => {
      toast.loading("Updating product...", { id: "updateProduct" });
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["product", id] });
      toast.success("Product updated successfully", { id: "updateProduct" });
    },
    onError: (error) => {
      toast.error("Failed to update product", { id: "updateProduct" });
      console.error("Failed to update product:", error);
    },
  });

  const remove = useMutation({
    mutationFn: deleteProduct,
    onMutate: () => {
      toast.loading("Deleting product...", { id: "deleteProduct" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product deleted successfully", { id: "deleteProduct" });
    },
    onError: () => {
      toast.error("Failed to delete product", { id: "deleteProduct" });
    },
  });

  return { create, update, remove };
};