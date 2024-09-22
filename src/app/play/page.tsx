"use client";
import PlayGame from "@/components/play-game";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Play() {
  return (
    <main className="flex w-full flex-col items-start gap-8">
      <div className="flex flex-col items-start gap-4">
        <Button size="lg" variant="outline">
          <Link href="/gametemplates">Volver</Link>
        </Button>
      </div>
      <PlayGame />
    </main>
  );
}
