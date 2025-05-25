"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import GameTemplatesTable from "@/components/tables/gametemplates-table";
import { GameTemplatesTableSkeleton } from "@/components/ui/loading";
import { type GameTemplate } from "@/types";

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
      <div className="mb-10 flex flex-col items-start gap-4">
        <Button size="lg" variant="outline">
          <Link href="/">Volver</Link>
        </Button>
      </div>

      <div className="mb-4 flex flex-row items-center justify-between space-x-4">
        <h1 className="text-3xl font-bold">Plantillas</h1>
      </div>

      {isLoading ? <GameTemplatesTableSkeleton /> : <GameTemplatesTable />}
    </div>
  );
}
