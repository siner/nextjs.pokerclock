import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Trash2, RotateCcw, Upload, LogOut } from "lucide-react";

export interface ConfirmationDialogProps {
  children: React.ReactNode; // Trigger element
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  variant?: "destructive" | "warning" | "info";
  type?: "delete" | "reset" | "import" | "exit" | "custom";
  isLoading?: boolean;
  disabled?: boolean;
}

const getVariantStyles = (variant: "destructive" | "warning" | "info") => {
  switch (variant) {
    case "destructive":
      return {
        buttonVariant: "destructive" as const,
        iconColor: "text-red-500",
        borderColor: "border-red-200 dark:border-red-800",
      };
    case "warning":
      return {
        buttonVariant: "default" as const,
        iconColor: "text-yellow-500",
        borderColor: "border-yellow-200 dark:border-yellow-800",
      };
    case "info":
      return {
        buttonVariant: "default" as const,
        iconColor: "text-blue-500",
        borderColor: "border-blue-200 dark:border-blue-800",
      };
  }
};

const getTypeIcon = (type: string) => {
  switch (type) {
    case "delete":
      return <Trash2 className="h-6 w-6" />;
    case "reset":
      return <RotateCcw className="h-6 w-6" />;
    case "import":
      return <Upload className="h-6 w-6" />;
    case "exit":
      return <LogOut className="h-6 w-6" />;
    default:
      return <AlertTriangle className="h-6 w-6" />;
  }
};

export function ConfirmationDialog({
  children,
  title,
  description,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  onConfirm,
  variant = "destructive",
  type = "custom",
  isLoading = false,
  disabled = false,
}: ConfirmationDialogProps) {
  const [open, setOpen] = React.useState(false);
  const styles = getVariantStyles(variant);
  const icon = getTypeIcon(type);

  const handleConfirm = () => {
    onConfirm();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild disabled={disabled}>
        {children}
      </DialogTrigger>
      <DialogContent className={`sm:max-w-md ${styles.borderColor} border-2`}>
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className={`${styles.iconColor}`}>{icon}</div>
            <DialogTitle className="text-lg font-semibold">{title}</DialogTitle>
          </div>
          <DialogDescription className="pt-2 text-left">
            {description}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-3 pt-4">
          {variant === "destructive" && (
            <div className="rounded-md border border-red-200 bg-red-50 p-3 dark:border-red-800 dark:bg-red-950/20">
              <p className="text-sm font-medium text-red-800 dark:text-red-200">
                ⚠️ Esta acción no se puede deshacer
              </p>
            </div>
          )}

          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isLoading}
              className="w-full sm:w-auto"
            >
              {cancelText}
            </Button>
            <Button
              variant={styles.buttonVariant}
              onClick={handleConfirm}
              disabled={isLoading}
              className="w-full sm:w-auto"
            >
              {isLoading ? "Procesando..." : confirmText}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Componentes especializados para casos comunes
export function DeleteConfirmationDialog({
  children,
  itemName,
  onConfirm,
  isLoading = false,
}: {
  children: React.ReactNode;
  itemName: string;
  onConfirm: () => void;
  isLoading?: boolean;
}) {
  return (
    <ConfirmationDialog
      type="delete"
      variant="destructive"
      title={`¿Eliminar ${itemName}?`}
      description={`Esta acción eliminará permanentemente "${itemName}". No podrás recuperarlo después.`}
      confirmText="Eliminar"
      onConfirm={onConfirm}
      isLoading={isLoading}
    >
      {children}
    </ConfirmationDialog>
  );
}

export function ResetConfirmationDialog({
  children,
  onConfirm,
  isLoading = false,
}: {
  children: React.ReactNode;
  onConfirm: () => void;
  isLoading?: boolean;
}) {
  return (
    <ConfirmationDialog
      type="reset"
      variant="destructive"
      title="¿Reiniciar partida?"
      description="Se perderá todo el progreso actual del torneo, incluyendo el tiempo transcurrido, nivel actual y estadísticas de jugadores."
      confirmText="Reiniciar"
      onConfirm={onConfirm}
      isLoading={isLoading}
    >
      {children}
    </ConfirmationDialog>
  );
}

export function ImportConfirmationDialog({
  children,
  onConfirm,
  isLoading = false,
}: {
  children: React.ReactNode;
  onConfirm: () => void;
  isLoading?: boolean;
}) {
  return (
    <ConfirmationDialog
      type="import"
      variant="warning"
      title="¿Importar plantillas?"
      description="Esta acción reemplazará todas tus plantillas actuales con las del archivo seleccionado. Se recomienda hacer una copia de seguridad antes."
      confirmText="Importar"
      onConfirm={onConfirm}
      isLoading={isLoading}
    >
      {children}
    </ConfirmationDialog>
  );
}

export function ExitConfirmationDialog({
  children,
  onConfirm,
  hasUnsavedChanges = false,
}: {
  children: React.ReactNode;
  onConfirm: () => void;
  hasUnsavedChanges?: boolean;
}) {
  return (
    <ConfirmationDialog
      type="exit"
      variant={hasUnsavedChanges ? "warning" : "info"}
      title={hasUnsavedChanges ? "¿Salir sin guardar?" : "¿Salir?"}
      description={
        hasUnsavedChanges
          ? "Tienes cambios sin guardar que se perderán si sales ahora. ¿Estás seguro de que quieres continuar?"
          : "¿Estás seguro de que quieres salir?"
      }
      confirmText="Salir"
      onConfirm={onConfirm}
    >
      {children}
    </ConfirmationDialog>
  );
}
