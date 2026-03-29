import axios from "axios";
import { useAuthStore } from "@/store/authStore";

export const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
});

instance.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

instance.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  },
);
