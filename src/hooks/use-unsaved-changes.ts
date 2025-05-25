import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";

export function useUnsavedChanges(hasUnsavedChanges: boolean) {
  const router = useRouter();
  const [showExitConfirmation, setShowExitConfirmation] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(
    null
  );

  // Interceptar navegación del navegador (back/forward/refresh)
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue =
          "Tienes cambios sin guardar. ¿Estás seguro de que quieres salir?";
        return e.returnValue;
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasUnsavedChanges]);

  // Función para manejar navegación programática
  const handleNavigation = useCallback(
    (url: string) => {
      if (hasUnsavedChanges) {
        setPendingNavigation(url);
        setShowExitConfirmation(true);
      } else {
        router.push(url);
      }
    },
    [hasUnsavedChanges, router]
  );

  // Confirmar salida
  const confirmExit = useCallback(() => {
    if (pendingNavigation) {
      router.push(pendingNavigation);
    }
    setShowExitConfirmation(false);
    setPendingNavigation(null);
  }, [pendingNavigation, router]);

  // Cancelar salida
  const cancelExit = useCallback(() => {
    setShowExitConfirmation(false);
    setPendingNavigation(null);
  }, []);

  return {
    showExitConfirmation,
    handleNavigation,
    confirmExit,
    cancelExit,
  };
}
