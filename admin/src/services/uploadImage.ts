// src/services/upload.ts
import { api } from "../api/api";

export interface UploadImage {
  id: number;
  image: string;
}

// 🔹 GET — barcha rasmlarni olish
export const getImages = async (): Promise<UploadImage[]> => {
  const res = await api.get("/images/");
  // agar API to‘g‘ridan-to‘g‘ri massiv qaytarsa:
  if (Array.isArray(res.data)) return res.data;

  // agar API bitta object qaytarsa:
  if (res.data && res.data.id) return [res.data];

  // fallback
  return res.data?.results || [];
};

// 🔹 POST — yangi rasm yuklash
export const uploadImage = async (data: FormData): Promise<UploadImage> => {
  const res = await api.post("/images/upload-image/", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

// 🔹 DELETE — rasmni o‘chirish
export const deleteImage = async (id: number): Promise<void> => {
  await api.delete(`/images/delete/${id}/`);
};
