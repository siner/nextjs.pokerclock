"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ExitConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

interface PlayPageClientProps {
  children: React.ReactNode;
}

export default function PlayPageClient({ children }: PlayPageClientProps) {
  const router = useRouter();
  const [hasActiveGame, setHasActiveGame] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const currentGame = localStorage.getItem("game");
      setHasActiveGame(!!currentGame && currentGame !== "{}");
    }
  }, []);

  const handleExit = () => {
    router.push("/gametemplates");
  };

  return (
    <main className="flex w-full flex-col items-start gap-4 sm:gap-8">
      <div className="flex flex-col items-start gap-2 sm:gap-4">
        {hasActiveGame ? (
          <ExitConfirmationDialog
            onConfirm={handleExit}
            hasUnsavedChanges={false}
          >
            <Button size="sm" variant="outline" className="sm:size-lg">
              Volver
            </Button>
          </ExitConfirmationDialog>
        ) : (
          <Button size="sm" variant="outline" className="sm:size-lg">
            <Link href="/gametemplates">Volver</Link>
          </Button>
        )}
      </div>
      {children}
    </main>
  );
}
