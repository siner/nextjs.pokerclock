"use client";

import { useMemo } from "react";
import { DollarSignIcon, TrophyIcon, Target, Gift } from "lucide-react";
import { Game, PrizeStructure } from "@/types";

interface TournamentPrizesProps {
  game: Game;
  totalPot: number;
  fee: number;
  addonPot: number;
  realPot: number;
  entries: number;
  currentPrizeStructure: PrizeStructure;
}

export function TournamentPrizes({
  game,
  totalPot,
  fee,
  addonPot,
  realPot,
  entries,
  currentPrizeStructure,
}: TournamentPrizesProps) {
  const prizes = useMemo(() => {
    if (!currentPrizeStructure.prizes?.length) return [];

    let remainingPot = realPot - (game.bubble || 0);
    return currentPrizeStructure.prizes.map((prize) => {
      const calculated =
        Math.ceil(
          ((realPot - (game.bubble || 0)) * prize.percentaje) / 100 / 5
        ) * 5;
      const prizeValue = Math.max(0, Math.min(calculated, remainingPot));
      remainingPot -= prizeValue;
      return {
        id: prize.id,
        percent: prize.percentaje,
        value: prizeValue,
      };
    });
  }, [currentPrizeStructure.prizes, realPot, game.bubble]);

  if (!prizes.length) return null;

  return (
    <div className="space-y-4">
      <div className="bg-surface rounded-2xl border border-border/60 p-5 shadow-[0_32px_120px_-80px_hsl(var(--shadow-soft))]">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-lg font-semibold uppercase tracking-[0.32em] text-muted-foreground">
              Información del bote
            </p>
            <span className="mt-1 flex items-center gap-2 text-4xl font-semibold text-foreground">
              <DollarSignIcon className="h-5 w-5 text-[hsl(var(--accent))]" />
              {realPot.toLocaleString("es-ES", {
                currency: "EUR",
                style: "currency",
                minimumFractionDigits: 0,
              })}
            </span>
          </div>
        </div>

        <div className="space-y-2 text-lg text-muted-foreground">
          <div className="flex items-center justify-between">
            <span>Bote total</span>
            <span className="font-medium text-foreground">
              {totalPot.toLocaleString("es-ES", {
                currency: "EUR",
                style: "currency",
                minimumFractionDigits: 0,
              })}
            </span>
          </div>
          <div className="flex items-center justify-between text-red-500">
            <span className="text-lg">Comisión</span>
            <span>
              -
              {fee.toLocaleString("es-ES", {
                currency: "EUR",
                style: "currency",
                minimumFractionDigits: 0,
              })}
            </span>
          </div>
          {addonPot > 0 && (
            <div className="flex items-center justify-between text-foreground">
              <span>Add-ons</span>
              <span>
                +
                {addonPot.toLocaleString("es-ES", {
                  currency: "EUR",
                  style: "currency",
                  minimumFractionDigits: 0,
                })}
              </span>
            </div>
          )}
          {typeof game.extrapot === "number" && game.extrapot > 0 && (
            <div className="flex items-center justify-between text-[hsl(var(--accent))]">
              <span className="flex items-center gap-1">
                <Gift className="h-4 w-4" /> Extra
              </span>
              <span>
                +
                {game.extrapot.toLocaleString("es-ES", {
                  currency: "EUR",
                  style: "currency",
                  minimumFractionDigits: 0,
                })}
              </span>
            </div>
          )}
          {typeof game.bounty === "number" && game.bounty > 0 && (
            <div className="flex items-center justify-between text-orange-500">
              <span className="flex items-center gap-1">
                <Target className="h-4 w-4" />
                {entries} bounty{entries !== 1 ? "s" : ""}
              </span>
              <span>
                {(entries * game.bounty).toLocaleString("es-ES", {
                  currency: "EUR",
                  style: "currency",
                  minimumFractionDigits: 0,
                })}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="bg-surface-muted/70 rounded-2xl border border-border/60 p-5 shadow-[0_32px_120px_-80px_hsl(var(--shadow-soft))]">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <p className="text-lg font-semibold uppercase tracking-[0.32em] text-muted-foreground">
              Reparto de premios
            </p>
            {currentPrizeStructure.max_players && (
              <p className="mt-1 text-lg text-muted-foreground">
                Hasta {currentPrizeStructure.max_players} jugadores
              </p>
            )}
          </div>
          <TrophyIcon className="h-5 w-5 text-[hsl(var(--accent))]" />
        </div>
        <div className="space-y-2 text-lg">
          {prizes.map((prize) => (
            <div
              key={prize.id}
              className="bg-surface flex items-center justify-between rounded-lg border border-border/50 px-3 py-2"
            >
              <span className="font-medium text-muted-foreground">
                {prize.id}º · {prize.percent}%
              </span>
              <span className="font-semibold text-foreground">
                {prize.value.toLocaleString("es-ES", {
                  currency: "EUR",
                  style: "currency",
                  minimumFractionDigits: 0,
                })}
              </span>
            </div>
          ))}
        </div>

        {typeof game.bubble === "number" && game.bubble > 0 && (
          <div className="bg-surface mt-4 flex items-center justify-between rounded-lg border border-border/50 px-3 py-2 text-sm text-orange-500">
            <span>Burbuja</span>
            <span>
              {Math.round(game.bubble).toLocaleString("es-ES", {
                currency: "EUR",
                style: "currency",
                minimumFractionDigits: 0,
              })}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
