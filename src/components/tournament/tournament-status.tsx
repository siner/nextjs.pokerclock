"use client";

import { PauseIcon } from "lucide-react";
import { Game } from "@/types";

interface TournamentStatusProps {
  playing: boolean;
  timer: number;
  game: Game;
  entriesStatus: {
    closed: boolean;
    lastLevel: number | null;
    currentLevel: number;
    message: string;
  };
}

export function TournamentStatus({
  playing,
  timer,
  game,
  entriesStatus,
}: TournamentStatusProps) {
  const showPauseAlert = !playing && timer > 0;
  const showEntries = Boolean(game.last_entry_level);

  return (
    <div className="space-y-3">
      {showPauseAlert && (
        <div className="flex items-center justify-center gap-3 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm font-semibold text-red-600 shadow-[0_20px_60px_-55px_rgba(248,113,113,0.7)] dark:border-red-400/40 dark:bg-red-500/15 dark:text-red-200">
          <PauseIcon className="h-4 w-4" />
          Torneo en pausa
        </div>
      )}

      {showEntries && (
        <div className="bg-surface rounded-2xl border border-border/60 p-4 shadow-[0_26px_90px_-70px_hsl(var(--shadow-soft))]">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                Estado de entradas
              </p>
              <h3 className="mt-1 text-lg font-semibold text-foreground">
                {entriesStatus.closed
                  ? "Entradas cerradas"
                  : "Entradas abiertas"}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {entriesStatus.message}
              </p>
            </div>
            <span className="text-2xl" aria-hidden>
              {entriesStatus.closed ? "🔒" : "🚪"}
            </span>
          </div>
          {!entriesStatus.closed && entriesStatus.lastLevel !== null && (
            <p className="mt-3 text-xs text-[hsl(var(--accent))]">
              Las entradas se cerrarán al final del nivel{" "}
              {entriesStatus.lastLevel + 1}.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
