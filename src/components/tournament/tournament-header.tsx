"use client";

import { Button } from "@/components/ui/button";
import {
  ResetConfirmationDialog,
  ConfirmationDialog,
} from "@/components/ui/confirmation-dialog";
import {
  SquareIcon,
  RotateCcw,
  KeyboardIcon,
  ArrowLeftIcon,
  HomeIcon,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface TournamentHeaderProps {
  timer: number;
  players: number;
  onFinishTournament: () => void;
  onResetGame: () => void;
  onShowShortcutsHelp: () => void;
}

export function TournamentHeader({
  timer,
  players,
  onFinishTournament,
  onResetGame,
  onShowShortcutsHelp,
}: TournamentHeaderProps) {
  const router = useRouter();

  const elapsedMinutes = Math.floor(timer / 60);
  const elapsedHours = Math.floor(elapsedMinutes / 60);
  const formattedElapsed = (() => {
    if (elapsedMinutes === 0) return "Sin iniciar";
    if (elapsedHours > 0) {
      return `${elapsedHours}h ${String(elapsedMinutes % 60).padStart(2, "0")}m`;
    }
    return `${elapsedMinutes}m`;
  })();

  return (
    <div className="bg-surface flex flex-col gap-4 rounded-2xl border border-border/60 p-4 shadow-[0_28px_90px_-60px_hsl(var(--shadow-soft))] md:flex-row md:items-center md:justify-between">
      <div className="flex flex-1 flex-col gap-1">
        <span className="text-xs font-semibold uppercase tracking-[0.32em] text-muted-foreground">
          Torneo activo
        </span>
        <h2 className="text-xl font-semibold text-foreground md:text-2xl">
          Control del reloj y jugadores
        </h2>
        <p className="text-sm text-muted-foreground">
          Jugadores en mesa: {players} · Tiempo transcurrido: {formattedElapsed}
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-end gap-2">
        <Button asChild variant="ghost" size="sm" className="gap-2">
          <Link href="/gametemplates">
            <ArrowLeftIcon className="h-4 w-4" />
            Plantillas
          </Link>
        </Button>
        <Button asChild variant="ghost" size="sm" className="gap-2">
          <Link href="/">
            <HomeIcon className="h-4 w-4" />
            Inicio
          </Link>
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={onShowShortcutsHelp}
          className="gap-2"
          title="Ver atajos de teclado (presiona ?)"
        >
          <KeyboardIcon className="h-4 w-4" />
          Atajos
        </Button>

        <ResetConfirmationDialog onConfirm={onResetGame}>
          <Button
            variant="destructive"
            size="sm"
            className="gap-2 bg-red-500 hover:bg-red-600"
            title="Reiniciar torneo"
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>
        </ResetConfirmationDialog>

        {timer > 0 && players > 0 && (
          <ConfirmationDialog
            title="Finalizar torneo"
            description="¿Quieres finalizar el torneo y guardarlo en el historial?"
            onConfirm={() => {
              onFinishTournament();
              router.push("/history");
            }}
            variant="info"
            type="custom"
            confirmText="Finalizar"
          >
            <Button
              size="sm"
              className="gap-2 bg-[hsl(var(--accent))] text-[hsl(var(--banner-foreground))] hover:bg-[hsl(var(--accent))_/0.9]"
              title="Finalizar torneo"
            >
              <SquareIcon className="h-4 w-4" />
              Finalizar
            </Button>
          </ConfirmationDialog>
        )}
      </div>
    </div>
  );
}
