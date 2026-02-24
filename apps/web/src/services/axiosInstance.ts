import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

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
    console.error("Error de API:", {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });

    if (error.response?.status === 403) {
      console.warn("Acceso denegado");
    }

    if (error.response?.status === 404) {
      console.warn("Recurso no encontrado");
    }

    if (error.response?.status === 500) {
      console.error("Error interno del servidor");
    }

    if (error.code === "ECONNABORTED") {
      console.error("La solicitud tardó demasiado (timeout)");
    }

    if (error.message === "Network Error") {
      console.error("Error de conexión con el servidor");
    }

    return Promise.reject(error);
  }
);