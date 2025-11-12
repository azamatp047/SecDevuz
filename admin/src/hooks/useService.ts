import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getServices, getServiceById, createService, updateService, deleteService } from "../services/service"
import toast from "react-hot-toast"

export const useServices = () => {
  return useQuery({
    queryKey: ["services"],
    queryFn: getServices,
  })
}

export const useService = (id: string) => {
  return useQuery({
    queryKey: ["service", id],
    queryFn: () => getServiceById(id),
    enabled: !!id,
  })
}

export const useServiceMutations = () => {
  const queryClient = useQueryClient()

  const create = useMutation({
    mutationFn: createService,
    onMutate: () => toast.loading("Creating service...", { id: "createService" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] })
      toast.success("Service created successfully", { id: "createService" })
    },
    onError: () => toast.error("Failed to create service", { id: "createService" }),
  })

  const update = useMutation({
    mutationFn: ({ id, data }: { id: string; data: FormData }) => updateService(id, data),
    onMutate: () => toast.loading("Updating service...", { id: "updateService" }),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["services"] })
      queryClient.invalidateQueries({ queryKey: ["service", id] })
      toast.success("Service updated successfully", { id: "updateService" })
    },
    onError: () => toast.error("Failed to update service", { id: "updateService" }),
  })

  const remove = useMutation({
    mutationFn: deleteService,
    onMutate: () => toast.loading("Deleting service...", { id: "deleteService" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] })
      toast.success("Service deleted successfully", { id: "deleteService" })
    },
    onError: () => toast.error("Failed to delete service", { id: "deleteService" }),
  })

  return { create, update, remove }
}
