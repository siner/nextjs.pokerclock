"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw, Home, Bug } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Error Boundary caught an error:", error, errorInfo);

    // Log error to external service (could be Sentry, LogRocket, etc.)
    this.logErrorToService(error, errorInfo);

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    this.setState({
      error,
      errorInfo,
    });
  }

  private logErrorToService(error: Error, errorInfo: ErrorInfo) {
    // In a real app, you would send this to an error tracking service
    const errorData = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
    };

    // Store in localStorage for now (in production, send to error service)
    try {
      const existingErrors = JSON.parse(
        localStorage.getItem("errorLogs") || "[]"
      );
      existingErrors.push(errorData);

      // Keep only last 10 errors to avoid storage bloat
      if (existingErrors.length > 10) {
        existingErrors.splice(0, existingErrors.length - 10);
      }

      localStorage.setItem("errorLogs", JSON.stringify(existingErrors));
    } catch (e) {
      console.error("Failed to log error to localStorage:", e);
    }
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  private handleGoHome = () => {
    window.location.href = "/";
  };

  private handleReportError = () => {
    const { error, errorInfo } = this.state;
    const errorReport = {
      error: error?.message,
      stack: error?.stack,
      componentStack: errorInfo?.componentStack,
      timestamp: new Date().toISOString(),
    };

    // Create a mailto link with error details
    const subject = encodeURIComponent("Error Report - Poker Clock");
    const body = encodeURIComponent(
      `Error Details:\n\n${JSON.stringify(errorReport, null, 2)}\n\nPlease describe what you were doing when this error occurred:`
    );

    window.open(`mailto:support@example.com?subject=${subject}&body=${body}`);
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div className="flex min-h-screen items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
                <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <CardTitle className="text-xl">¡Oops! Algo salió mal</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-center text-muted-foreground">
                Se ha producido un error inesperado. Puedes intentar recargar la
                página o volver al inicio.
              </p>

              {process.env.NODE_ENV === "development" && this.state.error && (
                <details className="rounded border p-2 text-xs">
                  <summary className="cursor-pointer font-medium">
                    Detalles del error (desarrollo)
                  </summary>
                  <pre className="mt-2 whitespace-pre-wrap break-words">
                    {this.state.error.message}
                    {"\n\n"}
                    {this.state.error.stack}
                  </pre>
                </details>
              )}

              <div className="flex flex-col gap-2">
                <Button onClick={this.handleRetry} className="w-full">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Intentar de nuevo
                </Button>

                <Button
                  variant="outline"
                  onClick={this.handleGoHome}
                  className="w-full"
                >
                  <Home className="mr-2 h-4 w-4" />
                  Ir al inicio
                </Button>

                <Button
                  variant="ghost"
                  onClick={this.handleReportError}
                  className="w-full"
                >
                  <Bug className="mr-2 h-4 w-4" />
                  Reportar error
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

// Hook para usar Error Boundary con componentes funcionales
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: ReactNode,
  onError?: (error: Error, errorInfo: ErrorInfo) => void
) {
  return function WrappedComponent(props: P) {
    return (
      <ErrorBoundary fallback={fallback} onError={onError}>
        <Component {...props} />
      </ErrorBoundary>
    );
  };
}

// Componente de error simple para casos específicos
export function ErrorFallback({
  error,
  resetError,
  title = "Error",
}: {
  error?: Error;
  resetError?: () => void;
  title?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <AlertTriangle className="mb-4 h-12 w-12 text-red-500" />
      <h2 className="mb-2 text-lg font-semibold">{title}</h2>
      <p className="mb-4 text-muted-foreground">
        {error?.message || "Ha ocurrido un error inesperado"}
      </p>
      {resetError && (
        <Button onClick={resetError}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Intentar de nuevo
        </Button>
      )}
    </div>
  );
}
