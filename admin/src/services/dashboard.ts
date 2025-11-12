import { api } from "../api/api"

export interface ModelCount {
  model: string
  count: number
}

export const getModelCount = async (model: string): Promise<ModelCount> => {
  const res = await api.get(`/admin-dashboard/model-count/${model}/`)
  return res.data
}
