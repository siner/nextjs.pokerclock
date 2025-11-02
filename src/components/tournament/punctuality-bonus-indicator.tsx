"use client";

import { Gift } from "lucide-react";

interface PunctualityBonusIndicatorProps {
  punctualityBonusStatus: {
    available: boolean;
    timeLeft: number;
    expired: boolean;
    isExpiring?: boolean;
  };
  punctualityBonus?: number;
  timer: number;
}

export function PunctualityBonusIndicator({
  punctualityBonusStatus,
  punctualityBonus,
  timer,
}: PunctualityBonusIndicatorProps) {
  if (!punctualityBonusStatus.available) return null;

  const timeLeftMinutes = Math.floor(punctualityBonusStatus.timeLeft / 60);
  const timeLeftSeconds = punctualityBonusStatus.timeLeft % 60;
  const timeLeftDisplay = `${timeLeftMinutes.toString().padStart(2, "0")}:${timeLeftSeconds.toString().padStart(2, "0")}`;

  const isExpiring = punctualityBonusStatus.isExpiring && timer > 0;

  return (
    <div className="rounded-2xl border border-[hsl(var(--accent))]/40 bg-[hsl(var(--accent))]/10 p-4 text-center text-sm text-[hsl(var(--accent))] shadow-[0_24px_80px_-60px_rgba(245,158,11,0.5)]">
      <div className="mb-2 flex items-center justify-center gap-2 font-semibold text-[hsl(var(--accent))]">
        <Gift className="h-4 w-4" /> Bono de puntualidad activo
      </div>
      <p className="text-xs text-[hsl(var(--accent))]/90">
        {punctualityBonus?.toLocaleString("es-ES")} puntos extra para jugadores que se registren durante el primer nivel.
      </p>
      <p className="mt-1 text-xs font-medium">
        {timer === 0
          ? "Inicia el reloj para comenzar la cuenta atrás"
          : isExpiring
            ? `¡Últimos ${timeLeftDisplay}!`
            : `Tiempo restante: ${timeLeftDisplay}`}
      </p>
    </div>
  );
}

