import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface FormSectionProps {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
  icon?: ReactNode;
  collapsible?: boolean;
  defaultOpen?: boolean;
}

export function FormSection({
  title,
  description,
  children,
  className,
  icon,
  collapsible = false,
  defaultOpen = true,
}: FormSectionProps) {
  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center space-x-3 border-b border-border pb-3">
        {icon && <div className="text-primary">{icon}</div>}
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-foreground">{title}</h3>
          {description && (
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          )}
        </div>
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

interface FormFieldProps {
  label: string;
  description?: string;
  required?: boolean;
  children: ReactNode;
  error?: string;
  warning?: string;
  className?: string;
}

export function FormField({
  label,
  description,
  required = false,
  children,
  error,
  warning,
  className,
}: FormFieldProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <div className="space-y-1">
        <label className="flex items-center gap-1 text-sm font-medium text-foreground">
          {label}
          {required && <span className="text-destructive">*</span>}
        </label>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </div>
      {children}
      {error && (
        <p className="flex items-center gap-1 text-xs text-destructive">
          <span className="h-1 w-1 rounded-full bg-destructive"></span>
          {error}
        </p>
      )}
      {warning && !error && (
        <p className="flex items-center gap-1 text-xs text-yellow-600 dark:text-yellow-400">
          <span className="h-1 w-1 rounded-full bg-yellow-600 dark:bg-yellow-400"></span>
          {warning}
        </p>
      )}
    </div>
  );
}

interface FormGridProps {
  children: ReactNode;
  columns?: 1 | 2 | 3 | 4 | 5;
  className?: string;
}

export function FormGrid({ children, columns = 2, className }: FormGridProps) {
  const gridClasses = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
    5: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5",
  };

  return (
    <div className={cn("grid gap-4", gridClasses[columns], className)}>
      {children}
    </div>
  );
}
