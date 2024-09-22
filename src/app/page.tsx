import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CircleAlertIcon } from "lucide-react";

export default function Home() {
  return (
    <main className="flex w-full flex-col items-start gap-8 text-left md:items-center md:justify-center">
      <h1 className="text-5xl font-bold md:text-7xl">Reloj de Poker</h1>
      <ol className="list-inside list-decimal text-left font-[family-name:var(--font-geist-mono)] sm:text-left md:text-center">
        <li className="mb-2">Empieza Creando una plantilla.</li>
        <li className="mb-2">Gestiona tus plantillas</li>
        <li>Empieza una partida</li>
      </ol>

      <div className="flex flex-col items-start gap-4 sm:flex-row md:items-center">
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

      <div className="mt-10 w-full md:w-1/2">
        <Alert>
          <CircleAlertIcon className="h-4 w-4" />
          <AlertTitle>Aviso</AlertTitle>
          <AlertDescription>
            Toda la información se guarda en el almacenamiento local de tu
            navegador, por lo que no se guarda en ningún servidor. Si borras los
            datos de tu navegador, se borrarán también los datos de la
            aplicación.
          </AlertDescription>
        </Alert>
      </div>
    </main>
  );
}
