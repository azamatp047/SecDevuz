import { api } from "../api/api";

interface Vakancy {
  id: number;
  title: string;
}

export interface Application {
  id: number;
  name: string;
  phone: string;
  email: string;
  resume: string; // Fayl URL
  vacancy: Vakancy; 
}

export interface ApplicationListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Application[];
}

export const getApplications = async (): Promise<ApplicationListResponse> => {
  const res = await api.get("/applications/admin/");
  return res.data;
};

export const getApplicationById = async (id: string): Promise<Application> => {
  const res = await api.get(`/applications/admin/${id}/`);
  return res.data;
};

export const deleteApplication = async (id: string): Promise<void> => {
  await api.delete(`/applications/admin/${id}/`);
};