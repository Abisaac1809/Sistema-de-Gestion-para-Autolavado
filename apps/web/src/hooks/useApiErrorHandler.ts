import { useEffect } from "react";
import { useError, ErrorNotificationType } from "@/contexts/ErrorContext";
import { api } from "@/services/axiosInstance";
import type { AxiosError } from "axios";

export function useApiErrorHandler() {
    const { addError } = useError();
    
    useEffect(() => {
        const interceptor = api.interceptors.response.use(
            (response) => response,
            (error: AxiosError) => {
                let message = "Error desconocido";
                let notificationType: ErrorNotificationType = ErrorNotificationType.ERROR;
                
                if (error.response) {
                    const status = error.response.status;
                    const data = error.response.data as any;
                    
                    switch (status) {
                        case 400:
                        message = data?.message || "Solicitud inválida";
                        notificationType = ErrorNotificationType.WARNING;
                        break;
                        case 404:
                        message = data?.message || "El recurso que buscas no existe";
                        break;
                        case 409:
                        message = data?.message || "El recurso ya existe";
                        notificationType = ErrorNotificationType.WARNING;
                        break;
                        case 422:
                        message = data?.message || "Datos inválidos";
                        notificationType = ErrorNotificationType.WARNING;
                        break;
                        case 500:
                        message = "Error interno. Consulta con el soporte";
                        break;
                        default:
                        message = data?.message || `Error ${status}: ${error.message}`;
                    }
                }
                else if (error.code === "ECONNABORTED") {
                    message = "La solicitud tardó demasiado tiempo (timeout)";
                    notificationType = ErrorNotificationType.WARNING;
                }
                else if (error.message === "Network Error") {
                    message = "No hay conexión con el servidor";
                }
                else if (error.message) {
                    message = error.message;
                }
                
                addError(message, notificationType);
                
                return Promise.reject(error);
            }
        );
        
        return () => {
            api.interceptors.response.eject(interceptor);
        };
    }, [addError]);
}