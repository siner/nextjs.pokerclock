import { useMemo, useEffect } from "react";
import { Game, Level } from "@/types";

interface UsePunctualityBonusProps {
  game: Game;
  levelIndex: number;
  timer: number;
  levels: Level[];
  onPlayAudio: () => void;
}

export function usePunctualityBonus({
  game,
  levelIndex,
  timer,
  levels,
  onPlayAudio,
}: UsePunctualityBonusProps) {
  // Memoizar el cálculo del estado del bono de puntualidad
  const punctualityBonusStatus = useMemo(() => {
    if (!game.punctuality_bonus || game.punctuality_bonus === 0) {
      return { available: false, timeLeft: 0, expired: false };
    }

    // El bono está disponible solo durante el primer nivel
    if (levelIndex > 0) {
      return { available: false, timeLeft: 0, expired: true };
    }

    // Si estamos en el primer nivel, calcular tiempo restante
    const firstLevelDuration = levels[0]?.time * 60 || 0; // en segundos

    // Si no hay duración del primer nivel, mostrar como disponible (juego no iniciado)
    if (firstLevelDuration === 0) {
      return {
        available: true,
        timeLeft: 0,
        expired: false,
        isExpiring: false,
      };
    }

    const timeLeft = firstLevelDuration - timer;

    return {
      available: timeLeft > 0,
      timeLeft: Math.max(0, timeLeft),
      expired: timeLeft <= 0 && timer > 0, // Solo expirado si el timer ha empezado
      isExpiring: timeLeft <= 60 && timeLeft > 0, // último minuto
    };
  }, [game.punctuality_bonus, levelIndex, timer, levels]);

  // Efecto para notificar cuando el bono de puntualidad está expirando
  useEffect(() => {
    if (
      punctualityBonusStatus.isExpiring &&
      punctualityBonusStatus.timeLeft === 30
    ) {
      // Notificación a los 30 segundos
      onPlayAudio();
    }
  }, [
    punctualityBonusStatus.isExpiring,
    punctualityBonusStatus.timeLeft,
    onPlayAudio,
  ]);

  return {
    punctualityBonusStatus,
  };
}
