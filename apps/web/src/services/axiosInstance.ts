import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { toast } from "sonner";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3001",
  headers: { "Content-Type": "application/json" },
  timeout: 10_000,
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {  return config;},
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.code === "ECONNABORTED") {
      toast.warning("La solicitud tardó demasiado tiempo (timeout)");
    } else if (error.message === "Network Error") {
      toast.error("No hay conexión con el servidor");
    }

    return Promise.reject(error);
  }
);