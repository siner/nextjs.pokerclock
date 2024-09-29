import { Button } from "@/components/ui/button";

import Link from "next/link";
import GameTemplatesTable from "@/components/tables/gametemplates-table";

export default async function AllGameTemplates() {
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
      <GameTemplatesTable />
    </div>
  );
}
