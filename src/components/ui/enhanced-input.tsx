import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { HelpCircle, AlertCircle, CheckCircle2 } from "lucide-react";
import { forwardRef, ReactNode } from "react";

interface EnhancedInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  description?: string;
  tooltip?: string;
  required?: boolean;
  error?: string;
  warning?: string;
  success?: boolean;
  icon?: ReactNode;
  suffix?: ReactNode;
  onValueChange?: (value: string) => void;
}

export const EnhancedInput = forwardRef<HTMLInputElement, EnhancedInputProps>(
  (
    {
      label,
      description,
      tooltip,
      required = false,
      error,
      warning,
      success = false,
      icon,
      suffix,
      className,
      onValueChange,
      onChange,
      ...props
    },
    ref
  ) => {
    const hasError = !!error;
    const hasWarning = !!warning && !hasError;
    const hasSuccess = success && !hasError && !hasWarning;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.(e);
      onValueChange?.(e.target.value);
    };

    const inputClasses = cn(
      "transition-all duration-200",
      hasError && "border-destructive focus:border-destructive",
      hasWarning && "border-yellow-500 focus:border-yellow-500",
      hasSuccess && "border-green-500 focus:border-green-500",
      icon && "pl-10",
      suffix && "pr-10",
      className
    );

    const StatusIcon = hasError
      ? AlertCircle
      : hasWarning
        ? AlertCircle
        : hasSuccess
          ? CheckCircle2
          : null;

    const statusIconColor = hasError
      ? "text-destructive"
      : hasWarning
        ? "text-yellow-500"
        : "text-green-500";

    return (
      <div className="space-y-2">
        {label && (
          <div className="flex items-center gap-2">
            <Label className="flex items-center gap-1 text-sm font-medium">
              {label}
              {required && <span className="text-destructive">*</span>}
            </Label>
            {tooltip && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="h-4 w-4 cursor-help text-muted-foreground transition-colors hover:text-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">{tooltip}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        )}

        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}

        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 transform text-muted-foreground">
              {icon}
            </div>
          )}

          <Input
            ref={ref}
            className={inputClasses}
            onChange={handleChange}
            {...props}
          />

          {(suffix || StatusIcon) && (
            <div className="absolute right-3 top-1/2 flex -translate-y-1/2 transform items-center gap-2">
              {suffix}
              {StatusIcon && (
                <StatusIcon className={cn("h-4 w-4", statusIconColor)} />
              )}
            </div>
          )}
        </div>

        {error && (
          <p className="flex items-center gap-1 text-xs text-destructive duration-200 animate-in slide-in-from-top-1">
            <span className="h-1 w-1 rounded-full bg-destructive"></span>
            {error}
          </p>
        )}

        {warning && !error && (
          <p className="flex items-center gap-1 text-xs text-yellow-600 duration-200 animate-in slide-in-from-top-1 dark:text-yellow-400">
            <span className="h-1 w-1 rounded-full bg-yellow-600 dark:bg-yellow-400"></span>
            {warning}
          </p>
        )}
      </div>
    );
  }
);

EnhancedInput.displayName = "EnhancedInput";

// Componente específico para inputs monetarios
interface MoneyInputProps extends Omit<EnhancedInputProps, "type" | "suffix"> {
  currency?: string;
}

export function MoneyInput({ currency = "€", ...props }: MoneyInputProps) {
  return (
    <EnhancedInput
      type="number"
      step="0.01"
      min="0"
      suffix={<span className="text-sm text-muted-foreground">{currency}</span>}
      {...props}
    />
  );
}

// Componente específico para inputs de porcentaje
interface PercentageInputProps
  extends Omit<EnhancedInputProps, "type" | "suffix"> {}

export function PercentageInput(props: PercentageInputProps) {
  return (
    <EnhancedInput
      type="number"
      step="0.01"
      min="0"
      max="100"
      suffix={<span className="text-sm text-muted-foreground">%</span>}
      {...props}
    />
  );
}

// Componente específico para inputs de tiempo
interface TimeInputProps extends Omit<EnhancedInputProps, "type" | "suffix"> {}

export function TimeInput(props: TimeInputProps) {
  return (
    <EnhancedInput
      type="number"
      min="1"
      max="180"
      suffix={<span className="text-sm text-muted-foreground">min</span>}
      {...props}
    />
  );
}
