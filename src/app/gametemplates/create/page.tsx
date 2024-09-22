import { Button } from "@/components/ui/button";
import GameTemplateForm from "../gametemplate-form";
import Link from "next/link";

export default function CreateGame() {
  return (
    <main className="flex w-full flex-col items-start gap-8 sm:items-start">
      <div className="mb-10 flex items-start gap-4">
        <Button size="lg" variant="outline">
          <Link href="/gametemplates">Volver</Link>
        </Button>
      </div>
      <h1 className="text-4xl font-bold">Crear Plantilla</h1>
      <GameTemplateForm />
    </main>
  );
}
