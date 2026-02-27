import React, { ReactNode } from "react";

type ErrorBoundaryProps = {
    children: ReactNode;
    fallback?: (error: Error) => ReactNode;
};

type ErrorBoundaryState = {
    hasError: boolean;
    error: Error | null;
};

export class ErrorBoundary extends React.Component<
ErrorBoundaryProps,
ErrorBoundaryState
> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false, error: null };
    }
    
    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, error };
    }
    
    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error("Error capturado por ErrorBoundary:", error, errorInfo);
    }
    
    render() {
        if (this.state.hasError) {
            return (
                this.props.fallback?.(this.state.error!) || (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <h3 className="text-sm font-medium text-red-800">
                    Algo salió mal en este componente
                    </h3>
                    <p className="mt-1 text-sm text-red-700">
                    {this.state.error?.message || "Error desconocido"}
                    </p>
                    </div>
                )
            );
        }
        
        return this.props.children;
    }
}
