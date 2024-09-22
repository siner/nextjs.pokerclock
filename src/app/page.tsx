import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <main className="row-start-2 flex flex-col items-center gap-8 sm:items-start">
      <h1 className="text-4xl font-bold">Poker Clock</h1>
      <ol className="list-inside list-decimal text-center font-[family-name:var(--font-geist-mono)] text-sm sm:text-left">
        <li className="mb-2">Empieza Creando una plantilla.</li>
        <li className="mb-2">Gestiona tus plantillas</li>
        <li>Empieza una partida</li>
      </ol>

      <div className="flex flex-col items-center gap-4 sm:flex-row">
        <Button variant="outline" size="lg">
          <Link href="/gametemplates/create">Crear plantilla</Link>
        </Button>
        <Button variant="outline" size="lg">
          <Link href="/gametemplates">Gestionar plantillas</Link>
        </Button>
        <Button size="lg">
          <Link href="/play">Empezar partida</Link>
        </Button>
      </div>
    </main>
  );
}
