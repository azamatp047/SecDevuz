// src/services/team.ts
import { api } from "../api/api";

export interface TeamMember {
  id: number;
  full_name: string;
  email: string;
  role: string; // role_uz dan copy qilinadi
  role_uz: string;
  role_ru: string;
  role_en: string;
  description: string; // description_uz dan copy qilinadi
  description_uz: string;
  description_ru: string;
  description_en: string;
  linked_in_link?: string;
  telegram_username?: string;
  image?: string; // Bitta rasm URL
  created_at?: string;
}

export interface TeamMemberListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: TeamMember[];
}

// Frontenddan keladigan ma'lumotlar. FormData bilan yuborilishi kerak.
// Bu interface asosan form validate qilish uchun kerak bo'ladi.
// Haqiqiy API chaqiruvida FormData ishlatiladi.
export interface TeamMemberInput {
  full_name: string;
  email: string;
  role_uz: string;
  role_ru: string;
  role_en: string;
  description_uz: string;
  description_ru: string;
  description_en: string;
  linked_in_link?: string;
  telegram_username?: string;
  image?: File; // Bu yerda File tipida bo'ladi
}


export const getTeamMembers = async (): Promise<TeamMemberListResponse> => {
  const res = await api.get("/team/admin/");
  return res.data;
};

export const getTeamMemberById = async (id: string): Promise<TeamMember> => {
  const res = await api.get(`/team/admin/${id}/`);
  return res.data;
};

// Create va Update uchun FormData qabul qiladi
export const createTeamMember = async (data: FormData): Promise<TeamMember> => {
  const res = await api.post("/team/admin/", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const updateTeamMember = async (id: string, data: FormData): Promise<TeamMember> => {
  const res = await api.put(`/team/admin/${id}/`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const deleteTeamMember = async (id: string): Promise<void> => {
  await api.delete(`/team/admin/${id}/`);
};