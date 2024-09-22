"use client";
export const runtime = "edge";
import PlayGame from "@/components/play-game";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Play(params: {
  searchParams: {
    template: string;
  };
}) {
  const { searchParams } = params;
  const { template } = searchParams;

  return (
    <main className="flex w-full flex-col items-start gap-8">
      <div className="flex flex-col items-start gap-4">
        <Button size="lg" variant="outline">
          <Link href="/gametemplates">Volver</Link>
        </Button>
      </div>
      <PlayGame template={template} />
    </main>
  );
}
