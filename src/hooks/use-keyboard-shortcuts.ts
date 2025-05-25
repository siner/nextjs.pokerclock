import { useEffect, useCallback } from "react";

interface KeyboardShortcuts {
  [key: string]: () => void;
}

interface UseKeyboardShortcutsOptions {
  enabled?: boolean;
  preventDefault?: boolean;
}

export function useKeyboardShortcuts(
  shortcuts: KeyboardShortcuts,
  options: UseKeyboardShortcutsOptions = {}
) {
  const { enabled = true, preventDefault = true } = options;

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      // No ejecutar si está deshabilitado
      if (!enabled) return;

      // No ejecutar si el usuario está escribiendo en un input
      const target = event.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.contentEditable === "true" ||
        target.closest('[role="dialog"]') // No ejecutar en diálogos
      ) {
        return;
      }

      // Crear la clave del shortcut
      const key = createShortcutKey(event);

      // Buscar y ejecutar el shortcut
      if (shortcuts[key]) {
        if (preventDefault) {
          event.preventDefault();
        }
        shortcuts[key]();
      }
    },
    [shortcuts, enabled, preventDefault]
  );

  useEffect(() => {
    if (enabled) {
      document.addEventListener("keydown", handleKeyDown);
      return () => {
        document.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [handleKeyDown, enabled]);
}

function createShortcutKey(event: KeyboardEvent): string {
  const parts: string[] = [];

  if (event.ctrlKey) parts.push("ctrl");
  if (event.altKey) parts.push("alt");
  if (event.shiftKey) parts.push("shift");
  if (event.metaKey) parts.push("meta");

  // Normalizar la tecla
  let key = event.key.toLowerCase();

  // Mapear teclas especiales
  const keyMap: { [key: string]: string } = {
    " ": "space",
    arrowup: "up",
    arrowdown: "down",
    arrowleft: "left",
    arrowright: "right",
    escape: "esc",
    "+": "plus",
    "-": "minus",
    "=": "equals",
  };

  key = keyMap[key] || key;
  parts.push(key);

  return parts.join("+");
}

// Hook específico para mostrar ayuda de atajos
export function useShortcutHelp() {
  const shortcuts = [
    { key: "Espacio", description: "Iniciar/Pausar cronómetro" },
    { key: "R", description: "Reset cronómetro" },
    { key: "N", description: "Siguiente nivel" },
    { key: "P", description: "Nivel anterior" },
    { key: "+", description: "Añadir jugador" },
    { key: "-", description: "Quitar jugador" },
    { key: "Ctrl + +", description: "Añadir entrada" },
    { key: "Ctrl + -", description: "Quitar entrada" },
    { key: "A", description: "Añadir addon" },
    { key: "Shift + A", description: "Añadir doble addon" },
    { key: "F", description: "Finalizar torneo" },
    { key: "Esc", description: "Cerrar diálogos" },
    { key: "?", description: "Mostrar esta ayuda" },
  ];

  return shortcuts;
}
