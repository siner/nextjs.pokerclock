"use client";

import { Button } from "@/components/ui/button";
import { ClockIcon, PauseIcon, PlayIcon } from "lucide-react";

interface TournamentTimerProps {
  clockDisplay: string;
  timer: number;
  playing: boolean;
  onTogglePlaying: () => void;
}

export function TournamentTimer({
  clockDisplay,
  timer,
  playing,
  onTogglePlaying,
}: TournamentTimerProps) {
  const isIdle = timer === 0;

  return (
    <div className="bg-surface flex flex-col items-center gap-4 rounded-3xl border border-border/60 p-6 shadow-[0_46px_160px_-90px_hsl(var(--shadow-strong))]">
      <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.22em] text-muted-foreground">
        <ClockIcon className="h-4 w-4" />
        {isIdle ? "Cronómetro" : "Tiempo transcurrido"}
      </div>

      <button
        type="button"
        onClick={onTogglePlaying}
        className="group flex flex-col items-center gap-3 focus-visible:outline-none"
        title={playing ? "Pausar" : "Reanudar"}
      >
        <span className="font-mono text-6xl font-semibold tracking-tight text-foreground sm:text-7xl md:text-8xl">
          {isIdle ? "00:00" : clockDisplay}
        </span>
        {!isIdle && (
          <span className="flex items-center gap-2 text-xs text-muted-foreground">
            {playing ? (
              <>
                <PauseIcon className="h-4 w-4" /> Pausar
              </>
            ) : (
              <>
                <PlayIcon className="h-4 w-4" /> Reanudar
              </>
            )}
          </span>
        )}
      </button>

      {isIdle && (
        <Button size="lg" onClick={onTogglePlaying} className="mt-2 gap-2">
          <PlayIcon className="h-4 w-4" />
          Iniciar torneo
        </Button>
      )}
    </div>
  );
}
