import React, { ReactNode, useState } from "react";
import { X, AlertCircle } from "lucide-react";

type GlobalErrorBoundaryProps = {
    children: ReactNode;
};

type GlobalErrorBoundaryState = {
    hasError: boolean;
    error: Error | null;
    errorInfo: React.ErrorInfo | null;
};

export class GlobalErrorBoundary extends React.Component<
GlobalErrorBoundaryProps,
GlobalErrorBoundaryState
> {
    constructor(props: GlobalErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }
    
    static getDerivedStateFromError(error: Error): Partial<GlobalErrorBoundaryState> {
        return { hasError: true, error };
    }
    
    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        // Loguea en consola para debugging
        console.error("❌ Error capturado por GlobalErrorBoundary:", error, errorInfo);
        
        // Actualiza el estado con la información completa del error
        this.setState({ errorInfo });
        
        // Opcional: Enviar a un servicio de monitoreo (Sentry, LogRocket, etc)
        // captureException(error);
    }
    
    resetError = () => {
        this.setState({ hasError: false, error: null, errorInfo: null });
    };
    
    render() {
        if (this.state.hasError && this.state.error) {
            return (
                <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="w-full max-w-md bg-white rounded-lg shadow-lg border border-red-200">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-red-100 bg-red-50">
                <div className="flex items-center gap-3">
                <AlertCircle className="h-6 w-6 text-red-600" />
                <h2 className="text-lg font-semibold text-red-900">Algo salió mal</h2>
                </div>
                <button
                onClick={this.resetError}
                className="text-red-500 hover:text-red-700 transition-colors"
                aria-label="Cerrar"
                >
                <X className="h-5 w-5" />
                </button>
                </div>
                
                {/* Content */}
                <div className="p-6 space-y-4">
                <div>
                <p className="text-sm text-gray-600 mb-2">
                Ha ocurrido un error inesperado en la aplicación.
                </p>
                <div className="bg-gray-100 rounded p-3 text-sm font-mono text-red-700 overflow-auto max-h-40">
                {this.state.error.message}
                </div>
                </div>
                
                {/* Stack trace en desarrollo */}
                {this.state.errorInfo && (
                    <details className="text-xs text-gray-600">
                    <summary className="cursor-pointer hover:text-gray-800 font-medium">
                    Detalles técnicos
                    </summary>
                    <pre className="mt-2 p-2 bg-gray-100 rounded overflow-auto max-h-32 text-red-600">
                    {this.state.errorInfo.componentStack}
                    </pre>
                    </details>
                )}
                
                {/* Sugerencias */}
                <div className="bg-blue-50 border border-blue-200 rounded p-3">
                <p className="text-sm text-blue-900">
                <strong>Qué puedes hacer:</strong>
                </p>
                <ul className="text-sm text-blue-800 mt-2 space-y-1">
                <li>• Intenta recargar la página</li>
                <li>• Limpia el caché del navegador</li>
                <li>• Contacta con soporte si el problema persiste</li>
                </ul>
                </div>
                </div>
                
                {/* Actions */}
                <div className="flex gap-3 p-6 border-t border-gray-200 bg-gray-50">
                <button
                onClick={this.resetError}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
                >
                Intentar de nuevo
                </button>
                <button
                onClick={() => window.location.href = "/"}
                className="flex-1 px-4 py-2 bg-gray-300 text-gray-900 rounded-md hover:bg-gray-400 transition-colors font-medium"
                >
                Ir al inicio
                </button>
                </div>
                </div>
                </div>
            );
        }
        
        return this.props.children;
    }
}
