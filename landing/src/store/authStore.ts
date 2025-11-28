'use client'

import { create } from "zustand";
import api from "@/lib/api";

export interface UserProfile {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  phone: string | null;
}

interface AuthState {
  user: UserProfile | null;
  access: string | null;
  refresh: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;

  login: (email: string, password: string) => Promise<void>;
  signup: (data: { first_name: string; last_name: string; email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  loadUser: () => void;
  fetchUserProfile: () => Promise<void>;

  // ⭐️ YANGI GOOGLE LOGIN FUNKSIYA
  loginWithGoogle: (access: string, refresh: string) => Promise<void>;
}

// localStorage helpers
const getLocalStorage = (key: string): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(key);
};

const setLocalStorage = (key: string, value: string): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, value);
};

const removeLocalStorage = (key: string): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(key);
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  access: null,
  refresh: null,
  isAuthenticated: false,
  loading: false,
  error: null,

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const res = await api.post("/api/v1/auth/token/", { email, password });
      const { access, refresh } = res.data;

      setLocalStorage("access", access);
      setLocalStorage("refresh", refresh);

      api.defaults.headers.common["Authorization"] = `Bearer ${access}`;
      set({ access, refresh, isAuthenticated: true });

      await get().fetchUserProfile();

    } catch (err: any) {
      set({ error: err.response?.data?.detail || "Email yoki parol xato!" });
    } finally {
      set({ loading: false });
    }
  },

  // ⭐️⭐⭐️ GOOGLE LOGIN shu yerda
  loginWithGoogle: async (access, refresh) => {
    try {
      setLocalStorage("access", access);
      setLocalStorage("refresh", refresh);

      api.defaults.headers.common["Authorization"] = `Bearer ${access}`;
      set({ access, refresh, isAuthenticated: true });

      await get().fetchUserProfile();
    } catch (err: any) {
      console.error("Google login xatosi:", err);
      set({ error: "Google orqali tizimga kirishda xato" });
    }
  },

  signup: async (data) => {
    set({ loading: true, error: null });
    try {
      const res = await api.post("/api/v1/auth/signup/", data);
      const { tokens } = res.data;

      setLocalStorage("access", tokens.access);
      setLocalStorage("refresh", tokens.refresh);

      api.defaults.headers.common["Authorization"] = `Bearer ${tokens.access}`;
      set({ access: tokens.access, refresh: tokens.refresh, isAuthenticated: true });

      await get().fetchUserProfile();

    } catch (err: any) {
      set({ error: err.response?.data?.email?.[0] });
    } finally {
      set({ loading: false });
    }
  },

  logout: async () => {
    removeLocalStorage("access");
    removeLocalStorage("refresh");
    set({ user: null, access: null, refresh: null, isAuthenticated: false });
  },

  loadUser: () => {
    const access = getLocalStorage("access");
    const refresh = getLocalStorage("refresh");

    if (access && refresh) {
      api.defaults.headers.common["Authorization"] = `Bearer ${access}`;
      set({ access, refresh, isAuthenticated: true });

      get().fetchUserProfile().catch(() => get().logout());
    } else {
      set({ isAuthenticated: false });
    }
  },

  fetchUserProfile: async () => {
    try {
      const res = await api.get("/api/v1/auth/my-profile/");
      set({ user: res.data });
    } catch (err: any) {
      get().logout();
    }
  },
}));
