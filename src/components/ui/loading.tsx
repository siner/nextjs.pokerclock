import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

// Spinner básico
export function Spinner({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex items-center justify-center", className)}
      {...props}
    >
      <Loader2 className="h-4 w-4 animate-spin" />
    </div>
  );
}

// Spinner con texto
interface SpinnerWithTextProps extends React.HTMLAttributes<HTMLDivElement> {
  text?: string;
  size?: "sm" | "md" | "lg";
}

export function SpinnerWithText({
  text = "Cargando...",
  size = "md",
  className,
  ...props
}: SpinnerWithTextProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
  };

  const textSizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  };

  return (
    <div
      className={cn("flex items-center justify-center gap-2", className)}
      {...props}
    >
      <Loader2 className={cn("animate-spin", sizeClasses[size])} />
      <span className={cn("text-muted-foreground", textSizeClasses[size])}>
        {text}
      </span>
    </div>
  );
}

// Skeleton para texto
export function TextSkeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("h-4 animate-pulse rounded bg-muted", className)}
      {...props}
    />
  );
}

// Skeleton para tarjetas
export function CardSkeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("space-y-3 rounded-lg border p-4", className)}
      {...props}
    >
      <TextSkeleton className="h-6 w-3/4" />
      <TextSkeleton className="h-4 w-1/2" />
      <TextSkeleton className="h-4 w-2/3" />
    </div>
  );
}

// Skeleton para tabla
export function TableSkeleton({
  rows = 5,
  columns = 4,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  rows?: number;
  columns?: number;
}) {
  return (
    <div className={cn("space-y-3", className)} {...props}>
      {/* Header skeleton */}
      <div className="flex gap-4 border-b pb-2">
        {Array.from({ length: columns }).map((_, i) => (
          <TextSkeleton key={i} className="h-5 flex-1" />
        ))}
      </div>

      {/* Rows skeleton */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex gap-4 py-2">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <TextSkeleton key={colIndex} className="h-4 flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
}

// Indicador de progreso
interface ProgressIndicatorProps {
  progress: number; // 0-100
  text?: string;
  className?: string;
}

export function ProgressIndicator({
  progress,
  text,
  className,
}: ProgressIndicatorProps) {
  return (
    <div className={cn("space-y-2", className)}>
      {text && (
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">{text}</span>
          <span className="font-medium">{Math.round(progress)}%</span>
        </div>
      )}
      <div className="h-2 w-full rounded-full bg-muted">
        <div
          className="h-2 rounded-full bg-primary transition-all duration-300 ease-out"
          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        />
      </div>
    </div>
  );
}

// Loading overlay para cubrir contenido
interface LoadingOverlayProps {
  isLoading: boolean;
  text?: string;
  children: React.ReactNode;
  className?: string;
}

export function LoadingOverlay({
  isLoading,
  text = "Cargando...",
  children,
  className,
}: LoadingOverlayProps) {
  return (
    <div className={cn("relative w-full", className)}>
      {children}
      {isLoading && (
        <div className="absolute inset-0 z-50 flex items-center justify-center rounded-lg bg-background/80 backdrop-blur-sm">
          <SpinnerWithText text={text} size="lg" />
        </div>
      )}
    </div>
  );
}

// Estados de botón con loading
interface ButtonLoadingProps {
  isLoading: boolean;
  loadingText?: string;
  children: React.ReactNode;
}

export function ButtonLoading({
  isLoading,
  loadingText,
  children,
}: ButtonLoadingProps) {
  if (isLoading) {
    return (
      <div className="flex items-center gap-2">
        <Loader2 className="h-4 w-4 animate-spin" />
        {loadingText || children}
      </div>
    );
  }

  return <>{children}</>;
}

// Skeleton específico para la tabla de plantillas
export function GameTemplatesTableSkeleton() {
  return (
    <div className="space-y-6">
      {/* Dashboard skeleton */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>

      {/* Controls skeleton */}
      <div className="flex items-center justify-between">
        <TextSkeleton className="h-4 w-32" />
        <div className="flex gap-2">
          <TextSkeleton className="h-9 w-20" />
          <TextSkeleton className="h-9 w-20" />
        </div>
      </div>

      {/* Table skeleton */}
      <div className="rounded-lg border p-4">
        <TableSkeleton rows={5} columns={6} />
      </div>
    </div>
  );
}
