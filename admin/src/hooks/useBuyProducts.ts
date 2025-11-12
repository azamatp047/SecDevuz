import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import toast from "react-hot-toast"
import { deleteBuyProduct, getBuyProductById, getBuyProducts } from "../services/products"

export const useBuyProducts = () => {
  return useQuery({
    queryKey: ["buy-products"],
    queryFn: getBuyProducts,
  })
}

export const useBuyProduct = (id: string) => {
  return useQuery({
    queryKey: ["buy-product", id],
    queryFn: () => getBuyProductById(id),
    enabled: !!id,
  })
}

export const useBuyProductMutation = () => {
  const queryClient = useQueryClient()

  const remove = useMutation({
    mutationFn: deleteBuyProduct,
    onMutate: () => toast.loading("O‘chirilmoqda...", { id: "deleteBuyProduct" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["buy-products"] })
      toast.success("Buy product muvaffaqiyatli o‘chirildi", { id: "deleteBuyProduct" })
    },
    onError: () => toast.error("O‘chirishda xatolik", { id: "deleteBuyProduct" }),
  })

  return { remove }
}
