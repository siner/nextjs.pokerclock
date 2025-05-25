import { AlertCircle, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ValidationMessageProps {
  message?: string;
  type?: "error" | "warning";
  className?: string;
}

export function ValidationMessage({
  message,
  type = "error",
  className,
}: ValidationMessageProps) {
  if (!message) return null;

  const isError = type === "error";

  return (
    <div
      className={cn(
        "mt-1 flex items-center gap-2 text-sm",
        isError ? "text-red-600" : "text-amber-600",
        className
      )}
    >
      {isError ? (
        <AlertCircle className="h-4 w-4 flex-shrink-0" />
      ) : (
        <AlertTriangle className="h-4 w-4 flex-shrink-0" />
      )}
      <span>{message}</span>
    </div>
  );
}

interface ValidationSummaryProps {
  errors: Array<{ field: string; message: string; type: "error" | "warning" }>;
  className?: string;
}

export function ValidationSummary({
  errors,
  className,
}: ValidationSummaryProps) {
  if (!errors || errors.length === 0) return null;

  const errorCount = errors.filter((e) => e.type === "error").length;
  const warningCount = errors.filter((e) => e.type === "warning").length;

  return (
    <div className={cn("space-y-3 rounded-lg border p-4", className)}>
      <div className="flex items-center gap-2">
        <AlertCircle className="h-5 w-5 text-red-600" />
        <h3 className="font-semibold text-red-900">
          Problemas de validación encontrados
        </h3>
      </div>

      {errorCount > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-red-800">
            Errores ({errorCount}):
          </h4>
          <ul className="space-y-1">
            {errors
              .filter((e) => e.type === "error")
              .map((error, index) => (
                <li
                  key={index}
                  className="flex items-start gap-2 text-sm text-red-700"
                >
                  <span className="mt-0.5 text-red-500">•</span>
                  <span>{error.message}</span>
                </li>
              ))}
          </ul>
        </div>
      )}

      {warningCount > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-amber-800">
            Advertencias ({warningCount}):
          </h4>
          <ul className="space-y-1">
            {errors
              .filter((e) => e.type === "warning")
              .map((warning, index) => (
                <li
                  key={index}
                  className="flex items-start gap-2 text-sm text-amber-700"
                >
                  <span className="mt-0.5 text-amber-500">•</span>
                  <span>{warning.message}</span>
                </li>
              ))}
          </ul>
        </div>
      )}
    </div>
  );
}
