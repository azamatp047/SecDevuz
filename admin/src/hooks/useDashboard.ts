
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { getModelCount } from "../services/dashboard"
const MODELS = ["User", "Vacancy", "Application", "Image", "BlogPost", "TeamMember", "UseService", "Service", "ProductFile", "Comment", "Certificate", "Product", "BuyProduct"] as const

export const useDashboard = () => {
  return useQuery({
    queryKey: ["dashboard-counts"],
    queryFn: async () => {
      const responses = await Promise.all(
        MODELS.map((m) => getModelCount(m))
      )
      return responses
    },
  })
}

export const useDashboardRefresh = () => {
  const queryClient = useQueryClient()
  return () => queryClient.invalidateQueries({ queryKey: ["dashboard-counts"] })
}
