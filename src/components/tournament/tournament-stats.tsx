"use client";

import { Level } from "@/types";
import { CoinsIcon, TrendingUpIcon, UsersIcon } from "lucide-react";

interface TournamentStatsProps {
  currentLevel: Level;
  players: number;
  totalPlayers: number;
  totalChips: number;
  punctualityBonusPlayers: number;
  punctualityBonus?: number;
}

export function TournamentStats({
  currentLevel,
  players,
  totalPlayers,
  totalChips,
  punctualityBonusPlayers,
  punctualityBonus,
}: TournamentStatsProps) {
  const stackPromedio = players > 0 ? Math.round(totalChips / players) : 0;

  const statItems = [
    {
      icon: UsersIcon,
      label: "Jugadores activos",
      value: `${players}`,
      helper: totalPlayers ? `Capacidad ${totalPlayers}` : undefined,
    },
    {
      icon: CoinsIcon,
      label: "Total de fichas",
      value: totalChips.toLocaleString("es-ES"),
      helper:
        punctualityBonusPlayers > 0 && punctualityBonus
          ? `+${(punctualityBonusPlayers * punctualityBonus).toLocaleString(
              "es-ES"
            )} bono`
          : undefined,
    },
    {
      icon: TrendingUpIcon,
      label: "Stack promedio",
      value: stackPromedio.toLocaleString("es-ES"),
      helper: currentLevel
        ? `${(stackPromedio / currentLevel.bb).toFixed(0)}BB`
        : undefined,
    },
  ];

  return (
    <div className="grid gap-3 md:gap-4">
      {statItems.map(({ icon: Icon, label, value, helper }) => (
        <div
          key={label}
          className="bg-surface flex items-center gap-3 rounded-2xl border border-border/60 p-4 shadow-[0_20px_60px_-55px_hsl(var(--shadow-soft))]"
        >
          <span className="bg-surface-muted flex h-10 w-10 items-center justify-center rounded-lg border border-border/50 text-[hsl(var(--accent))]">
            <Icon className="h-5 w-5" />
          </span>
          <div className="flex flex-col">
            <span className="text-lg font-medium uppercase tracking-[0.22em] text-muted-foreground">
              {label}
            </span>
            <span className="text-4xl font-semibold text-foreground">
              {value}
            </span>
            {helper && (
              <span className="text-xs text-muted-foreground">{helper}</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
