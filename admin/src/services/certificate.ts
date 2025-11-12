// src/services/certificate.ts
import { api } from "../api/api";

export interface Certificate {
  id: number;
  name: string;
  issued_date: string;
  valid_until?: string; // Optional maydon
  summary?: string; // Optional maydon
  image?: string; // Bitta rasm URL
  created_at?: string;
}

export interface CertificateListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Certificate[];
}

// Frontenddan keladigan ma'lumotlar. FormData bilan yuborilishi kerak.
export interface CertificateInput {
  name: string;
  issued_date: string;
  valid_until?: string;
  summary?: string;
  image?: File; // Bu yerda File tipida bo'ladi
}

export const getCertificates = async (): Promise<CertificateListResponse> => {
  const res = await api.get("/certificates/admin/");
  return res.data;
};

export const getCertificateById = async (id: string): Promise<Certificate> => {
  const res = await api.get(`/certificates/admin/${id}/`);
  return res.data;
};

// Create va Update uchun FormData qabul qiladi
export const createCertificate = async (data: FormData): Promise<Certificate> => {
  const res = await api.post("/certificates/admin/", data, {
    headers: { "Content-Type": "multipart/form-type" },
  });
  return res.data;
};

export const updateCertificate = async (id: string, data: FormData): Promise<Certificate> => {
  const res = await api.put(`/certificates/admin/${id}/`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const deleteCertificate = async (id: string): Promise<void> => {
  await api.delete(`/certificates/admin/${id}/`);
};