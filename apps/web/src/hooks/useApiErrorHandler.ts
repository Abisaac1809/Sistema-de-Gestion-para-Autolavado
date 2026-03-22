import { useEffect } from "react";
import { toast } from "sonner";
import { api } from "@/services/axiosInstance";
import type { AxiosError } from "axios";

export function useApiErrorHandler() {
  useEffect(() => {
    const interceptor = api.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        let message = "Error desconocido";
        let isWarning = false;

        if (error.response) {
          const status = error.response.status;
          const data = error.response.data as { message?: string };

          switch (status) {
            case 400:
              message = data?.message ?? "Solicitud inválida";
              isWarning = true;
              break;
            case 404:
              message = data?.message ?? "El recurso que buscas no existe";
              break;
            case 409:
              message = data?.message ?? "El recurso ya existe";
              isWarning = true;
              break;
            case 422:
              message = data?.message ?? "Datos inválidos";
              isWarning = true;
              break;
            case 500:
              message = "Error interno. Consulta con el soporte";
              break;
            default:
              message = data?.message ?? `Error ${status}: ${error.message}`;
          }
        } else if (error.code === "ECONNABORTED") {
          message = "La solicitud tardó demasiado tiempo (timeout)";
          isWarning = true;
        } else if (error.message === "Network Error") {
          message = "No hay conexión con el servidor";
        } else if (error.message) {
          message = error.message;
        }

        if (isWarning) {
          toast.warning(message);
        } else {
          toast.error(message);
        }

        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.response.eject(interceptor);
    };
  }, []);
}
