// src/services/products.ts
import { api } from "../api/api";

export interface ProductCategory {
  id: number;
  name_uz: string;
  name_ru: string;
  name_en: string;
}

export interface Product {
  id: number;
  image?: string; // Bitta rasm URL
  category: ProductCategory; // Category is an object on read
  title_uz?: string;
  title_ru?: string;
  title_en?: string;
  description_uz?: string;
  description_ru?: string;
  description_en?: string;
  price: string; // string($decimal)
}

export interface ProductListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Product[];
}

// Frontenddan keladigan ma'lumotlar. FormData bilan yuborilishi kerak.
// Category will be sent as flattened fields (category.name_uz, etc.)
export interface ProductInput {
  // category is not a single field here, but its properties are flattened
  title_uz?: string;
  title_ru?: string;
  title_en?: string;
  description_uz?: string;
  description_ru?: string;
  description_en?: string;
  price: string;
  image?: File; // Bu yerda File tipida bo'ladi
  // Backend expects category names directly in FormData:
  "category.name_uz"?: string;
  "category.name_ru"?: string;
  "category.name_en"?: string;
}

// Buy Products

export interface BuyProduct {
  id: number
  phone_number: string
  status: "rejected" | "waiting" | "success"
  rejected_reason?: string | null
  file_link?: string | null
  secret_key?: string | null
  created_at: string
  updated_at: string
  product: number
  user: number
}

export interface BuyProductListResponse {
  count: number
  next: string | null
  previous: string | null
  results: BuyProduct[]
}



// Product APIs
export const getProducts = async (): Promise<ProductListResponse> => {
  const res = await api.get("/products/admin/");
  return res.data;
};

export const getProductById = async (id: string): Promise<Product> => {
  const res = await api.get(`/products/admin/${id}/`);
  return res.data;
};

export const createProduct = async (data: FormData): Promise<Product> => {
  const res = await api.post("/products/admin/", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const updateProduct = async (id: string, data: FormData): Promise<Product> => {
  const res = await api.put(`/products/admin/${id}/`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const deleteProduct = async (id: string): Promise<void> => {
  await api.delete(`/products/admin/${id}/`);
};

// --- CRUD: BUY PRODUCTS --- //
export const getBuyProducts = async (): Promise<BuyProduct[]> => {
  const res = await api.get("/products/buy-products/admin/")
  return res.data.results
}

export const getBuyProductById = async (id: string): Promise<BuyProduct> => {
  const res = await api.get(`/products/buy-products/admin/${id}/`)
  return res.data
}

export const deleteBuyProduct = async (id: string): Promise<void> => {
  await api.delete(`/products/buy-products/admin/${id}/`)
}
