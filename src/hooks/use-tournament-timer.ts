import { useEffect, useState, useCallback, useMemo } from "react";
import { Level } from "@/types";

interface UseTournamentTimerProps {
  levels: Level[];
  playing: boolean;
  onLevelChange: (newLevelIndex: number) => void;
  onPlayAudio: () => void;
  onSaveGame: () => void;
}

export function useTournamentTimer({
  levels,
  playing,
  onLevelChange,
  onPlayAudio,
  onSaveGame,
}: UseTournamentTimerProps) {
  const [timer, setTimer] = useState(0);
  const [levelIndex, setLevelIndex] = useState(0);

  // Función para calcular el nivel actual basado en el tiempo transcurrido
  const calculateCurrentLevelIndex = useCallback(
    (elapsedSeconds: number): number => {
      if (elapsedSeconds === 0 || levels.length === 0) {
        return 0;
      }

      let accumulatedTime = 0;
      for (let i = 0; i < levels.length; i++) {
        accumulatedTime += levels[i].time * 60; // convertir minutos a segundos
        if (elapsedSeconds < accumulatedTime) {
          return i;
        }
      }

      // Si el tiempo transcurrido excede todos los niveles, devolver el último nivel
      return levels.length - 1;
    },
    [levels]
  );

  // Cronómetro principal
  useEffect(() => {
    if (playing) {
      const interval = setInterval(() => {
        setTimer((prevTimer) => {
          const newTimer = prevTimer + 1;

          // Solo guardar cada 10 segundos para reducir operaciones de localStorage
          if (newTimer % 10 === 0) {
            onSaveGame();
          }

          return newTimer;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [playing, onSaveGame]);

  // Efecto separado para verificar cambios de nivel
  useEffect(() => {
    if (!playing || timer === 0 || levels.length === 0) return;

    // Calcular el tiempo acumulado hasta el final del nivel actual
    const timeToEndCurrentLevel = levels
      .slice(0, levelIndex + 1)
      .reduce((total, level) => total + level.time * 60, 0);

    // Si el timer ha alcanzado o superado el tiempo del nivel actual, avanzar
    if (timer >= timeToEndCurrentLevel && levelIndex < levels.length - 1) {
      onPlayAudio();
      const newLevelIndex = levelIndex + 1;
      setLevelIndex(newLevelIndex);
      onLevelChange(newLevelIndex);
    }
  }, [timer, levelIndex, levels, playing, onPlayAudio, onLevelChange]);

  // Memoizar el cálculo del reloj
  const clockDisplay = useMemo(() => {
    if (timer === 0) {
      return "00:00";
    }

    const finishedLevelsMinutes = levels
      .slice(0, levelIndex)
      .reduce((total, level) => total + level.time, 0);

    const currentLevelTimer = timer - finishedLevelsMinutes * 60;

    // Asegurar que el tiempo del nivel actual no sea negativo
    const safeCurrentLevelTimer = Math.max(0, currentLevelTimer);
    const minutes = Math.floor(safeCurrentLevelTimer / 60);
    const seconds = safeCurrentLevelTimer % 60;

    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  }, [timer, levels, levelIndex]);

  const goToNextLevel = useCallback(() => {
    if (levelIndex < levels.length - 1) {
      const newLevelIndex = levelIndex + 1;
      setLevelIndex(newLevelIndex);
      onLevelChange(newLevelIndex);
      return true;
    }
    return false;
  }, [levelIndex, levels.length, onLevelChange]);

  const goToPreviousLevel = useCallback(() => {
    if (levelIndex > 0) {
      const newLevelIndex = levelIndex - 1;
      setLevelIndex(newLevelIndex);
      onLevelChange(newLevelIndex);
      return true;
    }
    return false;
  }, [levelIndex, onLevelChange]);

  const jumpToLevel = useCallback(
    (targetLevelIndex: number) => {
      if (targetLevelIndex >= 0 && targetLevelIndex < levels.length) {
        // Calcular el tiempo total hasta el final del nivel objetivo
        let finishedLevelsMinutes = 0;
        for (let i = 0; i <= targetLevelIndex; i++) {
          finishedLevelsMinutes += levels[i].time;
        }
        const newTimer = finishedLevelsMinutes * 60;

        // Asegurar que el timer no sea menor que el actual
        setTimer(Math.max(timer, newTimer));
        setLevelIndex(targetLevelIndex);
        onLevelChange(targetLevelIndex);
      }
    },
    [levels, timer, onLevelChange]
  );

  const initializeTimer = useCallback(
    (elapsedSeconds: number) => {
      setTimer(elapsedSeconds);
      const calculatedLevelIndex = calculateCurrentLevelIndex(elapsedSeconds);
      setLevelIndex(calculatedLevelIndex);
      onLevelChange(calculatedLevelIndex);
    },
    [calculateCurrentLevelIndex, onLevelChange]
  );

  const resetTimer = useCallback(() => {
    setTimer(0);
    setLevelIndex(0);
    onLevelChange(0);
  }, [onLevelChange]);

  return {
    timer,
    levelIndex,
    clockDisplay,
    goToNextLevel,
    goToPreviousLevel,
    jumpToLevel,
    initializeTimer,
    resetTimer,
    calculateCurrentLevelIndex,
  };
}
