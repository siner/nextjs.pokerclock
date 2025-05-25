import { useState, useCallback, useMemo } from "react";
import { Game, Level, PrizeStructure } from "@/types";

interface UseTournamentStateProps {
  game: Game;
  levelIndex: number;
}

export function useTournamentState({
  game,
  levelIndex,
}: UseTournamentStateProps) {
  const [players, setPlayers] = useState<number>(0);
  const [totalPlayers, setTotalPlayers] = useState<number>(0);
  const [entries, setEntries] = useState<number>(0);
  const [addons, setAddons] = useState<number>(0);
  const [doubleAddons, setDoubleAddons] = useState<number>(0);
  const [punctualityBonusPlayers, setPunctualityBonusPlayers] = useState(0);

  // Cálculos derivados
  const totalPot = useMemo(() => entries * game.entry, [entries, game.entry]);

  const fee = useMemo(
    () => Math.ceil((totalPot * game.fee) / 100 / 5) * 5,
    [totalPot, game.fee]
  );

  const addonPot = useMemo(
    () => addons * game.addon_price + doubleAddons * game.double_addon_price,
    [addons, game.addon_price, doubleAddons, game.double_addon_price]
  );

  const realPot = useMemo(
    () => totalPot - fee + addonPot + (game.extrapot || 0),
    [totalPot, fee, addonPot, game.extrapot]
  );

  // Cálculo del total de fichas incluyendo bono de puntualidad
  const totalChips = useMemo(() => {
    const baseChips = entries * parseInt(game.points || "0");
    const bonusChips =
      punctualityBonusPlayers *
      parseInt(game.punctuality_bonus?.toString() || "0");
    return baseChips + bonusChips;
  }, [entries, game.points, punctualityBonusPlayers, game.punctuality_bonus]);

  // Verificar si los addons están habilitados
  const addonsEnabled = useMemo(() => {
    return {
      simple: game.addon_price > 0 && game.addon_points > 0,
      double: game.double_addon_price > 0 && game.double_addon_points > 0,
    };
  }, [
    game.addon_price,
    game.addon_points,
    game.double_addon_price,
    game.double_addon_points,
  ]);

  // Estado de las entradas (si están cerradas o no)
  const entriesStatus = useMemo(() => {
    const lastEntryLevel = game.last_entry_level;

    if (!lastEntryLevel) {
      return {
        closed: false,
        lastLevel: null,
        currentLevel: levelIndex + 1,
        message: "Sin límite de entradas",
      };
    }

    const currentLevel = levelIndex + 1;
    const closed = currentLevel > lastEntryLevel;

    return {
      closed,
      lastLevel: lastEntryLevel,
      currentLevel,
      message: closed
        ? `Entradas cerradas desde nivel ${lastEntryLevel + 1}`
        : `Entradas hasta nivel ${lastEntryLevel}`,
    };
  }, [game.last_entry_level, levelIndex]);

  // Estructura de premios actual
  const currentPrizeStructure = useMemo(() => {
    if (!game?.prize_structures?.length) {
      return {} as PrizeStructure;
    }

    // Ordenar estructuras de menor a mayor número de jugadores
    const sortedStructures = [...game.prize_structures].sort(
      (a, b) => a.max_players - b.max_players
    );

    // Buscar la estructura más pequeña que pueda acomodar a los jugadores actuales
    for (const structure of sortedStructures) {
      if (totalPlayers <= structure.max_players) {
        return structure;
      }
    }

    // Si ninguna estructura puede acomodar a los jugadores, usar la más grande
    return sortedStructures[sortedStructures.length - 1];
  }, [game.prize_structures, totalPlayers]);

  // Funciones de control
  const addEntry = useCallback(() => {
    if (!entriesStatus.closed) {
      setEntries((prev) => prev + 1);
      return true;
    }
    return false;
  }, [entriesStatus.closed]);

  const removeEntry = useCallback(() => {
    if (entries > 0) {
      setEntries((prev) => prev - 1);
      return true;
    }
    return false;
  }, [entries]);

  const addAddon = useCallback(() => {
    setAddons((prev) => prev + 1);
  }, []);

  const removeAddon = useCallback(() => {
    if (addons > 0) {
      setAddons((prev) => prev - 1);
      return true;
    }
    return false;
  }, [addons]);

  const addDoubleAddon = useCallback(() => {
    setDoubleAddons((prev) => prev + 1);
  }, []);

  const removeDoubleAddon = useCallback(() => {
    if (doubleAddons > 0) {
      setDoubleAddons((prev) => prev - 1);
      return true;
    }
    return false;
  }, [doubleAddons]);

  const addPlayer = useCallback(
    (withPunctualityBonus: boolean = false) => {
      if (!entriesStatus.closed) {
        setPlayers((prev) => prev + 1);
        setEntries((prev) => prev + 1);
        setTotalPlayers((prev) => prev + 1);

        if (withPunctualityBonus) {
          setPunctualityBonusPlayers((prev) => prev + 1);
        }

        return true;
      }
      return false;
    },
    [entriesStatus.closed]
  );

  const removePlayer = useCallback(() => {
    if (players > 0) {
      setPlayers((prev) => prev - 1);
      return true;
    }
    return false;
  }, [players]);

  const initializeState = useCallback(
    (gameData: {
      players: number;
      total_players: number;
      entries: number;
      addons: number;
      doubleaddons: number;
      punctuality_bonus_players?: number;
    }) => {
      setPlayers(gameData.players);
      setTotalPlayers(gameData.total_players);
      setEntries(gameData.entries);
      setAddons(gameData.addons);
      setDoubleAddons(gameData.doubleaddons);
      setPunctualityBonusPlayers(gameData.punctuality_bonus_players || 0);
    },
    []
  );

  const resetState = useCallback(() => {
    setPlayers(0);
    setTotalPlayers(0);
    setEntries(0);
    setAddons(0);
    setDoubleAddons(0);
    setPunctualityBonusPlayers(0);
  }, []);

  return {
    // Estado
    players,
    totalPlayers,
    entries,
    addons,
    doubleAddons,
    punctualityBonusPlayers,

    // Cálculos
    totalPot,
    fee,
    addonPot,
    realPot,
    totalChips,
    addonsEnabled,
    entriesStatus,
    currentPrizeStructure,

    // Acciones
    addEntry,
    removeEntry,
    addAddon,
    removeAddon,
    addDoubleAddon,
    removeDoubleAddon,
    addPlayer,
    removePlayer,
    initializeState,
    resetState,
  };
}
