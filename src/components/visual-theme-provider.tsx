"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type VisualTheme = "corporate" | "midnight" | "emerald";

interface VisualThemeOption {
  id: VisualTheme;
  name: string;
  description: string;
  accentClass: string;
}

interface VisualThemeContextValue {
  theme: VisualTheme;
  setTheme: (theme: VisualTheme) => void;
  options: VisualThemeOption[];
}

const VISUAL_THEME_STORAGE_KEY = "pokerclock-visual-theme";

const VisualThemeContext = createContext<VisualThemeContextValue | undefined>(
  undefined
);

const DEFAULT_THEME: VisualTheme = "corporate";

const VISUAL_THEME_OPTIONS: VisualThemeOption[] = [
  {
    id: "corporate",
    name: "Corporate",
    description: "Azules profesionales con acentos dorados",
    accentClass:
      "from-blue-500/70 via-blue-600/80 to-slate-900 border-blue-500/50",
  },
  {
    id: "midnight",
    name: "Midnight",
    description: "Gradientes índigo con brillos violeta",
    accentClass:
      "from-indigo-500/70 via-purple-500/60 to-slate-900 border-indigo-500/40",
  },
  {
    id: "emerald",
    name: "Emerald",
    description: "Verdes tipo tapete con detalles cálidos",
    accentClass:
      "from-emerald-500/80 via-emerald-600/70 to-slate-900 border-emerald-500/40",
  },
];

function applyVisualTheme(theme: VisualTheme) {
  if (typeof window === "undefined") return;

  document.documentElement.dataset.visualTheme = theme;
}

export function VisualThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [theme, setThemeState] = useState<VisualTheme>(DEFAULT_THEME);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const storedTheme = window.localStorage.getItem(
      VISUAL_THEME_STORAGE_KEY
    ) as VisualTheme | null;

    if (storedTheme && storedTheme !== theme) {
      setThemeState(storedTheme);
      applyVisualTheme(storedTheme);
    } else {
      applyVisualTheme(theme);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    applyVisualTheme(theme);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(VISUAL_THEME_STORAGE_KEY, theme);
    }
  }, [theme]);

  const setTheme = useCallback((nextTheme: VisualTheme) => {
    setThemeState(nextTheme);
  }, []);

  const value = useMemo<VisualThemeContextValue>(
    () => ({ theme, setTheme, options: VISUAL_THEME_OPTIONS }),
    [theme, setTheme]
  );

  return (
    <VisualThemeContext.Provider value={value}>
      {children}
    </VisualThemeContext.Provider>
  );
}

export function useVisualTheme() {
  const context = useContext(VisualThemeContext);

  if (!context) {
    throw new Error(
      "useVisualTheme debe usarse dentro de un VisualThemeProvider"
    );
  }

  return context;
}

export function getVisualThemeOptions() {
  return VISUAL_THEME_OPTIONS;
}
