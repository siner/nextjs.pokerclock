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
  // Solo mostrar el bono si está disponible (durante el primer nivel)
  if (!punctualityBonusStatus.available) {
    return null;
  }

  const timeLeftMinutes = Math.floor(punctualityBonusStatus.timeLeft / 60);
  const timeLeftSeconds = punctualityBonusStatus.timeLeft % 60;
  const timeLeftDisplay = `${timeLeftMinutes.toString().padStart(2, "0")}:${timeLeftSeconds.toString().padStart(2, "0")}`;

  return (
    <div
      className={`mb-4 rounded-lg p-4 text-center ${
        punctualityBonusStatus.isExpiring
          ? "animate-pulse border-2 border-orange-400 bg-orange-100"
          : "border-2 border-green-400 bg-green-100"
      }`}
    >
      <div className="mb-2 flex items-center justify-center gap-2">
        <span className="text-2xl">
          <Gift className="size-5 text-green-600" />
        </span>
        <h3
          className={`text-lg font-bold ${
            punctualityBonusStatus.isExpiring
              ? "text-orange-700"
              : "text-green-700"
          }`}
        >
          Bono de Puntualidad Disponible
        </h3>
      </div>
      <p
        className={`text-sm ${
          punctualityBonusStatus.isExpiring
            ? "text-orange-600"
            : "text-green-600"
        }`}
      >
        {punctualityBonus?.toLocaleString("es-ES")} puntos extra por llegar a
        tiempo
      </p>
      <p
        className={`mt-1 text-xs ${
          punctualityBonusStatus.isExpiring
            ? "font-bold text-orange-500"
            : "text-green-500"
        }`}
      >
        {timer === 0
          ? "🚀 ¡Inicia el torneo para activar el bono!"
          : punctualityBonusStatus.isExpiring
            ? `⚠️ ¡Expira en ${timeLeftDisplay}!`
            : `Tiempo restante: ${timeLeftDisplay}`}
      </p>
    </div>
  );
}
