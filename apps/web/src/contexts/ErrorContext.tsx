import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { X, AlertCircle } from "lucide-react";

export enum ErrorNotificationType {
    ERROR = "error",
    WARNING = "warning",
    INFO = "info",
    SUCCESS = "success",
}

type ErrorNotification = {
    id: string;
    message: string;
    type: ErrorNotificationType;
    duration?: number;
};

type ErrorContextType = {
    errors: ErrorNotification[];
    addError: (message: string, type?: ErrorNotificationType, duration?: number) => void;
    removeError: (id: string) => void;
    clearErrors: () => void;
};

const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

export function ErrorProvider({ children }: { children: ReactNode }) {
    const [errors, setErrors] = useState<ErrorNotification[]>([]);
    
    const addError = useCallback(
        (message: string, type: ErrorNotificationType = ErrorNotificationType.ERROR, duration = 5000) => {
            const id = Date.now().toString();
            const notification: ErrorNotification = { id, message, type, duration };
            
            setErrors((prev) => [...prev, notification]);
            
            if (duration > 0) {
                setTimeout(() => removeError(id), duration);
            }
        },
        []
    );
    
    const removeError = useCallback((id: string) => {
        setErrors((prev) => prev.filter((err) => err.id !== id));
    }, []);
    
    const clearErrors = useCallback(() => {
        setErrors([]);
    }, []);
    
    return (
        <ErrorContext.Provider value={{ errors, addError, removeError, clearErrors }}>
        {children}
        <ErrorNotificationContainer />
        </ErrorContext.Provider>
    );
}

export function useError() {
    const context = useContext(ErrorContext);
    if (!context) {
        throw new Error("useError debe ser usado dentro de ErrorProvider");
    }
    return context;
}

function ErrorNotificationContainer() {
    const { errors, removeError } = useError();
    
    return (
        <div className="fixed bottom-4 right-4 z-50 space-y-2 max-w-md">
        {errors.map((error) => (
            <ErrorNotification
            key={error.id}
            notification={error}
            onClose={() => removeError(error.id)}
            />
        ))}
        </div>
    );
}

function ErrorNotification({
    notification,
    onClose,
}: {
    notification: ErrorNotification;
    onClose: () => void;
}) {
    const colors = {
        error: "bg-red-50 border-red-200 text-red-800",
        warning: "bg-yellow-50 border-yellow-200 text-yellow-800",
        info: "bg-blue-50 border-blue-200 text-blue-800",
        success: "bg-green-50 border-green-200 text-green-800",
    };
    
    const iconColors = {
        error: "text-red-600",
        warning: "text-yellow-600",
        info: "text-blue-600",
        success: "text-green-600",
    };
    
    return (
        <div className={`flex items-start gap-3 p-4 border rounded-lg ${colors[notification.type]} animate-slide-in`}>
        <AlertCircle className={`h-5 w-5 shrink-0 mt-0.5 ${iconColors[notification.type]}`} />
        <p className="flex-1 text-sm font-medium">{notification.message}</p>
        <button
        onClick={onClose}
        className="shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
        aria-label="Cerrar"
        >
        <X className="h-4 w-4" />
        </button>
        </div>
    );
}
