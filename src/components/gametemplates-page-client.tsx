"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import GameTemplatesTable from "@/components/tables/gametemplates-table";
import { GameTemplatesTableSkeleton } from "@/components/ui/loading";
import { type GameTemplate } from "@/types";
import { HomeIcon, HistoryIcon } from "lucide-react";

export default function GameTemplatesPageClient() {
  const [isLoading, setIsLoading] = useState(true);
  const [templates, setTemplates] = useState<GameTemplate[]>([]);

  useEffect(() => {
    // Simular carga de datos
    const loadTemplates = async () => {
      setIsLoading(true);

      // Simular delay de carga
      await new Promise((resolve) => setTimeout(resolve, 800));

      try {
        const storedTemplates = localStorage.getItem("gameTemplates");
        const parsedTemplates = storedTemplates
          ? JSON.parse(storedTemplates)
          : [];
        setTemplates(parsedTemplates);
      } catch (error) {
        console.error("Error loading templates:", error);
        setTemplates([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadTemplates();
  }, []);

  return (
    <div className="w-full">
      {/* Header con navegación */}
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        {/* Botones de navegación */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => (window.location.href = "/")}
            className="flex items-center gap-2 border-slate-300 text-slate-600 hover:bg-slate-100 dark:border-slate-600 dark:text-slate-400 dark:hover:bg-slate-800"
            title="Ir al inicio"
          >
            <HomeIcon className="size-4" />
            <span className="hidden sm:inline">Inicio</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => (window.location.href = "/history")}
            className="flex items-center gap-2 border-slate-300 text-slate-600 hover:bg-slate-100 dark:border-slate-600 dark:text-slate-400 dark:hover:bg-slate-800"
            title="Ver historial"
          >
            <HistoryIcon className="size-4" />
            <span className="hidden sm:inline">Historial</span>
          </Button>
        </div>

        {/* Título */}
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-2xl font-bold sm:text-3xl">
            Plantillas de Torneo
          </h1>
          <p className="text-sm text-muted-foreground sm:text-base">
            Gestiona y crea plantillas para tus torneos
          </p>
        </div>

        {/* Espacio para futuros controles */}
        <div className="flex gap-2">
          {/* Aquí se pueden añadir más botones en el futuro */}
        </div>
      </div>

      {isLoading ? <GameTemplatesTableSkeleton /> : <GameTemplatesTable />}
    </div>
  );
}
