// lib/api.ts
import axios from "axios";

// BASE_URL ni faqat asosiy domen qilib belgilaymiz
const BASE_URL = "https://secdevuz.pythonanywhere.com"; 

const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Refresh token avtomatik yangilanishi uchun interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Access token muddati tugasa
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refresh = localStorage.getItem("refresh");
        if (!refresh) throw new Error("No refresh token");

        // Token refresh endpointini to'g'ri belgilaymiz
        const res = await axios.post(`${BASE_URL}/api/v1/auth/token-refresh/`, { 
          refresh,
        });

        const newAccess = res.data.access;
        localStorage.setItem("access", newAccess);

        api.defaults.headers.common["Authorization"] = `Bearer ${newAccess}`;
        originalRequest.headers["Authorization"] = `Bearer ${newAccess}`;

        return api(originalRequest);
      } catch (err) {
        console.error("Token refresh failed:", err);
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
      }
    }

    return Promise.reject(error);
  }
);

export default api;