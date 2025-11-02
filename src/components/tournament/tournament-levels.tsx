"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FastForward, TrophyIcon, ClockIcon } from "lucide-react";
import { Level } from "@/types";

interface TournamentLevelsProps {
  currentLevel: Level | null;
  nextLevel: Level | null;
  levelIndex: number;
  onJumpToNextLevel: () => void;
}

export function TournamentLevels({
  currentLevel,
  nextLevel,
  levelIndex,
  onJumpToNextLevel,
}: TournamentLevelsProps) {
  return (
    <div className="space-y-4">
      {currentLevel && (
        <div className="bg-surface rounded-3xl border border-border/60 p-6 text-center shadow-[0_46px_160px_-90px_hsl(var(--shadow-strong))]">
          <div className="mb-3 flex items-center justify-center gap-2 text-sm font-semibold uppercase tracking-[0.3em] text-muted-foreground">
            <TrophyIcon className="h-4 w-4" /> Nivel actual
            <span className="bg-surface-muted rounded-full px-2 py-0.5 text-xs text-foreground">
              #{levelIndex + 1}
            </span>
          </div>
          <div className="font-mono text-5xl font-semibold text-foreground sm:text-6xl lg:text-7xl">
            {currentLevel.sb} / {currentLevel.bb}
            {currentLevel.ante > 0 && (
              <span className="text-[hsl(var(--accent))]">
                {" "}
                / {currentLevel.ante}
              </span>
            )}
          </div>
          <Badge variant="secondary" className="mt-4 gap-2 px-4 py-1 text-sm">
            <ClockIcon className="h-4 w-4" /> {currentLevel.time} minutos
          </Badge>
        </div>
      )}

      {currentLevel && nextLevel && (
        <div className="bg-surface-muted/60 rounded-2xl border border-border/60 p-5 text-center shadow-[0_30px_100px_-80px_hsl(var(--shadow-soft))]">
          <div className="mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
            Próximo nivel #{levelIndex + 2}
          </div>
          <div className="text-2xl font-semibold text-foreground sm:text-3xl">
            {nextLevel.sb} / {nextLevel.bb}
            {nextLevel.ante > 0 && <span> / {nextLevel.ante}</span>}
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Duración {nextLevel.time} minutos
          </p>
          <Button
            variant="ghost"
            className="mt-3 inline-flex items-center gap-2 text-sm"
            onClick={onJumpToNextLevel}
          >
            <FastForward className="h-4 w-4" />
            Saltar al siguiente nivel
          </Button>
        </div>
      )}
    </div>
  );
}
