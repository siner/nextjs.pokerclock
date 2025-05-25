"use client";

import { useState, useEffect } from "react";
import { GameTemplate } from "@/types";
import GameTemplateForm from "@/app/gametemplates/gametemplate-form";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface EditTemplateClientProps {
  templateId: string;
}

export default function EditTemplateClient({
  templateId,
}: EditTemplateClientProps) {
  const [gametemplate, setGametemplate] = useState<GameTemplate | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const templates = JSON.parse(
          localStorage.getItem("gameTemplates") || "[]"
        );
        const template = templates.find(
          (template: GameTemplate) => template.id === Number(templateId)
        );
        setGametemplate(template || null);
      } catch (error) {
        console.error("Error loading template:", error);
        setGametemplate(null);
      } finally {
        setLoading(false);
      }
    }
  }, [templateId]);

  if (loading) {
    return (
      <main className="flex flex-col items-start gap-8 sm:items-start">
        <div className="mb-10 flex flex-col items-start gap-4">
          <Button size="lg" variant="outline">
            <Link href="/gametemplates">Volver</Link>
          </Button>
        </div>
        <h1 className="text-4xl font-bold">Editar Plantilla</h1>
        <div className="flex items-center justify-center p-8">
          <p>Cargando plantilla...</p>
        </div>
      </main>
    );
  }

  if (!gametemplate) {
    return (
      <main className="flex flex-col items-start gap-8 sm:items-start">
        <div className="mb-10 flex flex-col items-start gap-4">
          <Button size="lg" variant="outline">
            <Link href="/gametemplates">Volver</Link>
          </Button>
        </div>
        <h1 className="text-4xl font-bold">Editar Plantilla</h1>
        <div className="flex items-center justify-center p-8">
          <p>Plantilla no encontrada</p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex flex-col items-start gap-8 sm:items-start">
      <div className="mb-10 flex flex-col items-start gap-4">
        <Button size="lg" variant="outline">
          <Link href="/gametemplates">Volver</Link>
        </Button>
      </div>
      <h1 className="text-4xl font-bold">Editar Plantilla</h1>
      <GameTemplateForm gametemplate={gametemplate} />
    </main>
  );
}
