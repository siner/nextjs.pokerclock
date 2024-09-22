"use client";
export const runtime = "edge";
import { GameTemplate } from "@/types";
import GameTemplateForm from "../gametemplate-form";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function EditGame({ params }: { params: { id: string } }) {
  const gametemplate = JSON.parse(
    localStorage.getItem("gameTemplates") || "[]"
  ).find((gametemplate: GameTemplate) => gametemplate.id === Number(params.id));
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
