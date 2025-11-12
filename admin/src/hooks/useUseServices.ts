import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getUseServices, getUseServiceById, deleteUseService } from "../services/service"
import toast from "react-hot-toast"

export const useUseServices = () => {
  return useQuery({
    queryKey: ["use-services"],
    queryFn: getUseServices,
  })
}

export const useUseService = (id: string) => {
  return useQuery({
    queryKey: ["use-service", id],
    queryFn: () => getUseServiceById(id),
    enabled: !!id,
  })
}

export const useUseServiceMutation = () => {
  const queryClient = useQueryClient()

  const remove = useMutation({
    mutationFn: deleteUseService,
    onMutate: () => toast.loading("O‘chirilmoqda...", { id: "deleteUseService" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["use-services"] })
      toast.success("Use service muvaffaqiyatli o‘chirildi", { id: "deleteUseService" })
    },
    onError: () => toast.error("O‘chirishda xatolik", { id: "deleteUseService" }),
  })

  return { remove }
}
