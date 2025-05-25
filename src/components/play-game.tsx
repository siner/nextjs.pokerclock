"use client";

import {
  GameTemplate,
  type Game,
  type Level,
  type PrizeStructure,
} from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { useToast } from "@/hooks/use-toast";
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts";
import { KeyboardShortcutsHelp } from "@/components/ui/keyboard-shortcuts-help";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DatabaseIcon,
  FastForward,
  MinusIcon,
  PauseIcon,
  PlayIcon,
  PlusIcon,
  RotateCcw,
  SquareIcon,
  UsersIcon,
  TrophyIcon,
  CoinsIcon,
  ClockIcon,
  DollarSignIcon,
  Target,
  Gift,
  TrendingUpIcon,
  ArrowLeftIcon,
  HomeIcon,
  KeyboardIcon,
} from "lucide-react";
import {
  ResetConfirmationDialog,
  ConfirmationDialog,
} from "@/components/ui/confirmation-dialog";
import { LoadingOverlay, SpinnerWithText } from "@/components/ui/loading";
import {
  DataRecovery,
  SafeStorage,
  useErrorHandler,
} from "@/lib/error-handling";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { TournamentHistoryManager } from "@/lib/tournament-history";
const Notification = "/notification.mp3";

export default function PlayGame(params: { template: string }) {
  const { toast } = useToast();
  const { handleError } = useErrorHandler();
  const audioPlayer = useRef(null);

  function playAudio() {
    if (audioPlayer.current) {
      (audioPlayer.current as HTMLAudioElement).play();
    }
  }

  const [template, setTemplate] = useState<GameTemplate>({} as GameTemplate);
  const [game, setGame] = useState<Game>({} as Game);
  const [currentLevel, setCurrentLevel] = useState<Level | null>();
  const [nextLevel, setNextLevel] = useState<Level | null>();
  const [isLoadingTemplate, setIsLoadingTemplate] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [showShortcutsHelp, setShowShortcutsHelp] = useState(false);
  const [punctualityBonusPlayers, setPunctualityBonusPlayers] = useState(0);

  let gameTemplates = [] as GameTemplate[];
  if (typeof window !== "undefined") {
    try {
      const rawData = SafeStorage.getItem("gameTemplates", []);
      const validationResult = DataRecovery.validateGameTemplates(rawData);

      if (validationResult.isValid && validationResult.data) {
        gameTemplates = validationResult.data;
      } else {
        handleError(
          `Failed to load game templates: ${validationResult.errors.join(", ")}`,
          { errors: validationResult.errors },
          "high"
        );
        gameTemplates = [];
      }
    } catch (error) {
      handleError(
        error as Error,
        { context: "Loading game templates in PlayGame" },
        "high"
      );
      gameTemplates = [];
    }
  }

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const rawGameData = SafeStorage.getItem("game", {});

        if (
          rawGameData &&
          typeof rawGameData === "object" &&
          "id" in rawGameData
        ) {
          const validationResult =
            DataRecovery.validateCurrentGame(rawGameData);

          if (validationResult.isValid && validationResult.data) {
            const currentGame = validationResult.data;
            setGame(currentGame);
            setCurrentLevel(currentGame.current_level);
            setNextLevel(currentGame.next_level);
            setLevels(currentGame.levels);
            setPlayers(currentGame.players);
            setTotalPlayers(currentGame.total_players);
            setEntries(currentGame.entries);
            setAddons(currentGame.addons);
            setDoubleAddons(currentGame.doubleaddons);
            setTimer(currentGame.elapsed);
            setPunctualityBonusPlayers(
              currentGame.punctuality_bonus_players || 0
            );

            if (validationResult.recovered) {
              toast({
                title: "Juego recuperado",
                description:
                  "Se recuperó el juego anterior con algunos datos corregidos.",
              });
            }
            return;
          } else {
            handleError(
              `Failed to validate current game: ${validationResult.errors.join(", ")}`,
              { errors: validationResult.errors },
              "medium"
            );
          }
        }
      } catch (error) {
        handleError(
          error as Error,
          { context: "Loading current game" },
          "medium"
        );
      }
    }

    if (params.template) {
      setCurrentTemplate(parseInt(params.template));
    }
  }, []);

  useEffect(() => {
    if (game.id) {
      localStorage.setItem("game", JSON.stringify(game));
    }
  }, [game]);

  async function setCurrentTemplate(id: number) {
    setIsLoadingTemplate(true);

    try {
      // Simular delay para mostrar loading
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const template = gameTemplates.find(
        (template) => template.id === id
      ) as GameTemplate;

      if (!template) {
        toast({
          title: "Error",
          description: "No se encontró la plantilla seleccionada.",
          variant: "destructive",
        });
        return;
      }

      setTemplate(template);
      const newGame = {
        id: Math.floor(Math.random() * 1000000000),
        name: template.name,
        entry: template.entry,
        fee: template.fee,
        bubble: template.bubble,
        bounty: template.bounty,
        points: template.points,
        extrapot: template.extrapot,
        addon_price: template.addon_price,
        addon_points: template.addon_points,
        double_addon_price: template.double_addon_price,
        double_addon_points: template.double_addon_points,
        punctuality_bonus: template.punctuality_bonus,
        prize_structures: template.prize_structures,
        current_level: template.levels[0],
        next_level: template.levels[1],
        players: 0,
        total_players: 0,
        entries: 0,
        addons: 0,
        doubleaddons: 0,
        elapsed: 0,
        levels: template.levels,
      } as Game;
      setGame(newGame);
      setLevels(template.levels);
      setLevelIndex(0);
      setCurrentLevel(newGame.levels[0]);
      setNextLevel(newGame.levels[1]);
      setGame(newGame);
      setPlayers(0);
      setTotalPlayers(0);
      setEntries(0);
      setAddons(0);
      setDoubleAddons(0);
      setPunctualityBonusPlayers(0);
      localStorage.setItem("game", JSON.stringify(newGame));

      toast({
        title: "¡Torneo iniciado!",
        description: `Torneo "${template.name}" configurado correctamente.`,
      });
    } catch (error) {
      console.error("Error setting template:", error);
      toast({
        title: "Error",
        description: "No se pudo iniciar el torneo. Inténtalo de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingTemplate(false);
    }
  }

  const [playing, setPlaying] = useState(false);

  const [levels, setLevels] = useState<Level[]>([]);
  const [players, setPlayers] = useState<number>(0);
  const [totalPlayers, setTotalPlayers] = useState<number>(0);
  const [entries, setEntries] = useState<number>(0);
  const [addons, setAddons] = useState<number>(0);
  const [addonPot, setAddonPot] = useState(0);
  const [doubleaddons, setDoubleAddons] = useState<number>(0);
  const [levelIndex, setLevelIndex] = useState(0);
  const [totalPot, setTotalPot] = useState(0);
  const [fee, setFee] = useState(0);
  const [realPot, setRealPot] = useState(0);

  const [currentStructurePrizes, setCurrentStructurePrizes] =
    useState<PrizeStructure>({} as PrizeStructure);

  const [timer, setTimer] = useState(0);

  const saveGame = useCallback(() => {
    const newGame = {
      id: game.id,
      name: game.name,
      entry: game.entry,
      fee: game.fee,
      bubble: game.bubble,
      bounty: game.bounty,
      points: game.points,
      extrapot: game.extrapot,
      addon_price: game.addon_price,
      addon_points: game.addon_points,
      double_addon_price: game.double_addon_price,
      double_addon_points: game.double_addon_points,
      punctuality_bonus: game.punctuality_bonus,
      prize_structures: game.prize_structures,
      current_level: game.current_level,
      next_level: game.next_level,
      levels: game.levels,
      players: players,
      total_players: totalPlayers,
      entries: entries,
      addons: addons,
      doubleaddons: doubleaddons,
      elapsed: timer,
      punctuality_bonus_players: punctualityBonusPlayers,
    } as Game;
    setGame(newGame);

    // Usar requestIdleCallback para guardar cuando el navegador esté libre
    if ("requestIdleCallback" in window) {
      requestIdleCallback(() => {
        localStorage.setItem("game", JSON.stringify(newGame));
      });
    } else {
      localStorage.setItem("game", JSON.stringify(newGame));
    }
  }, [game, players, totalPlayers, entries, addons, doubleaddons, timer]);

  function togglePlaying() {
    setPlaying(!playing);
    setCurrentLevel(levels[levelIndex]);
    setNextLevel(levels[levelIndex + 1]);
  }

  useEffect(() => {
    setCurrentLevel(levels[levelIndex]);
    setNextLevel(levels[levelIndex + 1]);
  }, [levelIndex]);

  useEffect(() => {}, [currentLevel]);

  // Memoizar el cálculo de tiempo de niveles previos
  const timerPreviousLevels = useMemo(() => {
    return levels
      .slice(0, levelIndex + 1)
      .reduce((total, level) => total + level.time * 60, 0);
  }, [levels, levelIndex]);

  useEffect(() => {
    if (playing) {
      const interval = setInterval(() => {
        setTimer((prevTimer) => {
          const newTimer = prevTimer + 1;

          // Solo guardar cada 10 segundos para reducir operaciones de localStorage
          if (newTimer % 10 === 0) {
            saveGame();
          }

          // Verificar cambio de nivel
          if (timerPreviousLevels > 0 && newTimer === timerPreviousLevels) {
            playAudio();
            setLevelIndex((prevIndex) => prevIndex + 1);
          } else if (
            newTimer > timerPreviousLevels &&
            timerPreviousLevels > 0
          ) {
            setLevelIndex((prevIndex) => prevIndex + 1);
          }

          return newTimer;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [playing, timerPreviousLevels, saveGame]);

  // Memoizar la estructura de premios actual
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

  useEffect(() => {
    setCurrentStructurePrizes(currentPrizeStructure);
  }, [currentPrizeStructure]);
  useEffect(() => {
    setTotalPot(entries * game.entry);
    setFee(Math.ceil((totalPot * game.fee) / 100 / 5) * 5);
    const newaddonpot =
      addons * game.addon_price + doubleaddons * game.double_addon_price;
    setAddonPot(newaddonpot);
    setRealPot(totalPot - fee + newaddonpot + (game.extrapot || 0));
  }, [
    entries,
    totalPot,
    fee,
    game.entry,
    game.fee,
    game.addon_price,
    game.double_addon_price,
    addons,
    doubleaddons,
  ]);

  function addEntry() {
    if (entriesStatus.closed) {
      toast({
        title: "Entradas cerradas",
        description: entriesStatus.message,
        variant: "destructive",
      });
      return;
    }
    setEntries(entries + 1);
  }
  function removeEntry() {
    if (entries > 0) {
      setEntries(entries - 1);
    }
  }
  function addAddon() {
    setAddons(addons + 1);
  }
  function removeAddon() {
    if (addons > 0) {
      setAddons(addons - 1);
    }
  }
  function addDoubleAddon() {
    setDoubleAddons(doubleaddons + 1);
  }
  function removeDoubleAddon() {
    if (doubleaddons > 0) {
      setDoubleAddons(doubleaddons - 1);
    }
  }
  function addPlayer() {
    if (entriesStatus.closed) {
      toast({
        title: "Entradas cerradas",
        description: entriesStatus.message,
        variant: "destructive",
      });
      return;
    }

    setPlayers(players + 1);
    setEntries(entries + 1);
    setTotalPlayers(totalPlayers + 1);

    // Verificar si el jugador recibe bono de puntualidad
    if (punctualityBonusStatus.available && levelIndex === 0) {
      setPunctualityBonusPlayers(punctualityBonusPlayers + 1);
      toast({
        title: "¡Bono de puntualidad aplicado!",
        description: `Jugador añadido con ${game.punctuality_bonus?.toLocaleString("es-ES")} puntos extra`,
      });
    }
  }
  function removePlayer() {
    if (players > 0) {
      setPlayers(players - 1);

      // Si hay jugadores con bono de puntualidad, reducir uno
      if (punctualityBonusPlayers > 0) {
        setPunctualityBonusPlayers(punctualityBonusPlayers - 1);
        toast({
          title: "Jugador eliminado",
          description: "Se redujo un bono de puntualidad",
        });
      }
    }
  }

  function goToNextLevel() {
    if (levelIndex < levels.length - 1) {
      setLevelIndex(levelIndex + 1);
      toast({
        title: "Nivel avanzado",
        description: `Avanzado al nivel ${levelIndex + 2}`,
      });
    } else {
      toast({
        title: "Último nivel",
        description: "Ya estás en el último nivel del torneo",
        variant: "destructive",
      });
    }
  }

  function goToPreviousLevel() {
    if (levelIndex > 0) {
      setLevelIndex(levelIndex - 1);
      toast({
        title: "Nivel retrocedido",
        description: `Retrocedido al nivel ${levelIndex}`,
      });
    } else {
      toast({
        title: "Primer nivel",
        description: "Ya estás en el primer nivel del torneo",
        variant: "destructive",
      });
    }
  }

  async function finishTournament() {
    if (!game.id || timer === 0) {
      toast({
        title: "Error",
        description: "No hay un torneo activo para finalizar.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Crear datos de ejemplo para los ganadores (en una implementación real, esto vendría de un formulario)
      const winners = [
        {
          id: 1,
          name: "Ganador 1",
          place: 1,
          prize: Math.round(realPot * 0.5),
        },
        {
          id: 2,
          name: "Ganador 2",
          place: 2,
          prize: Math.round(realPot * 0.3),
        },
        {
          id: 3,
          name: "Ganador 3",
          place: 3,
          prize: Math.round(realPot * 0.2),
        },
      ].slice(0, Math.min(3, players)); // Solo mostrar ganadores hasta el número de jugadores

      const finalLevel = currentLevel || { sb: 0, bb: 0, ante: 0 };
      const durationMinutes = Math.floor(timer / 60);

      // Guardar en el historial
      TournamentHistoryManager.saveTournament(
        {
          ...game,
          final: {
            total_pot: totalPot,
            fee: fee,
            players: players,
            prizes: [],
          },
        },
        winners,
        finalLevel,
        durationMinutes
      );

      toast({
        title: "¡Torneo finalizado!",
        description: "El torneo se guardó en el historial correctamente.",
      });

      // Resetear el juego después de guardar
      await resetGame();
    } catch (error) {
      console.error("Error finishing tournament:", error);
      toast({
        title: "Error",
        description: "No se pudo finalizar el torneo.",
        variant: "destructive",
      });
    }
  }

  async function resetGame() {
    setIsResetting(true);

    try {
      // Simular delay para mostrar loading
      await new Promise((resolve) => setTimeout(resolve, 800));

      setPlaying(false);
      setTimer(0);
      setLevelIndex(0);
      setPlayers(0);
      setEntries(0);
      setAddons(0);
      setDoubleAddons(0);
      setPunctualityBonusPlayers(0);
      setLevels([]);
      setGame({} as Game);
      setTemplate({} as GameTemplate);
      localStorage.removeItem("game");

      toast({
        title: "¡Torneo reiniciado!",
        description: "Puedes seleccionar una nueva plantilla para empezar.",
      });
    } catch (error) {
      console.error("Error resetting game:", error);
      toast({
        title: "Error",
        description: "No se pudo reiniciar el torneo.",
        variant: "destructive",
      });
    } finally {
      setIsResetting(false);
    }
  }

  // Memoizar el cálculo del reloj
  const clockDisplay = useMemo(() => {
    if (timer === 0) {
      return "00:00";
    }

    const finishedLevelsMinutes = levels
      .slice(0, levelIndex)
      .reduce((total, level) => total + level.time, 0);

    const currentLevelTimer = timer - finishedLevelsMinutes * 60;
    const minutes = Math.floor(currentLevelTimer / 60);
    const seconds = currentLevelTimer % 60;

    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  }, [timer, levels, levelIndex]);

  // Memoizar el cálculo del total de fichas incluyendo bono de puntualidad
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

  // Memoizar el estado de las entradas (si están cerradas o no)
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
      playAudio();
    }
  }, [punctualityBonusStatus.isExpiring, punctualityBonusStatus.timeLeft]);

  function showClock() {
    return clockDisplay;
  }

  function showPunctualityBonus() {
    if (!punctualityBonusStatus.available && !punctualityBonusStatus.expired) {
      return null;
    }

    const timeLeftMinutes = Math.floor(punctualityBonusStatus.timeLeft / 60);
    const timeLeftSeconds = punctualityBonusStatus.timeLeft % 60;
    const timeLeftDisplay = `${timeLeftMinutes.toString().padStart(2, "0")}:${timeLeftSeconds.toString().padStart(2, "0")}`;

    if (punctualityBonusStatus.available) {
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
            {game.punctuality_bonus?.toLocaleString("es-ES")} puntos extra por
            llegar a tiempo
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

    if (punctualityBonusStatus.expired && levelIndex === 0) {
      return (
        <div className="mb-4 rounded-lg border-2 border-red-400 bg-red-100 p-4 text-center">
          <div className="mb-2 flex items-center justify-center gap-2">
            <span className="text-2xl">⏰</span>
            <h3 className="text-lg font-bold text-red-700">
              Bono de Puntualidad Expirado
            </h3>
          </div>
          <p className="text-sm text-red-600">
            El bono de{" "}
            {game.punctuality_bonus?.toLocaleString("es-ES", {
              currency: "EUR",
              style: "currency",
              minimumFractionDigits: 0,
            })}{" "}
            ya no está disponible
          </p>
        </div>
      );
    }

    return null;
  }

  function showCurrentLevel() {
    if (!currentLevel) {
      return;
    }
    return (
      <div className="text-center">
        <div className="mb-3 flex items-center justify-center gap-2">
          <TrophyIcon className="size-5 text-slate-600 dark:text-slate-400 md:size-6" />
          <span className="text-base font-medium text-slate-700 dark:text-slate-300 md:text-lg">
            Nivel Actual
          </span>
        </div>
        <div className="space-y-2">
          <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 sm:text-3xl md:text-4xl lg:text-6xl">
            {currentLevel.sb} / {currentLevel.bb}
            {currentLevel.ante > 0 && (
              <span className="text-orange-600"> / {currentLevel.ante}</span>
            )}
          </div>
          <Badge
            variant="secondary"
            className="px-3 py-1 text-sm md:px-4 md:text-lg"
          >
            <ClockIcon className="mr-1 size-3 md:mr-2 md:size-4" />
            {currentLevel.time}{" "}
            <span className="hidden sm:inline">minutos</span>
            <span className="sm:hidden">min</span>
          </Badge>
        </div>
      </div>
    );
  }

  function showNextLevel() {
    if (!nextLevel || !currentLevel) {
      return;
    }
    return (
      <Card className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950 dark:to-orange-950">
        <CardContent className="p-5">
          <div className="text-center">
            <div className="mb-4 flex items-center justify-center gap-2">
              <FastForward className="size-5 text-amber-600 dark:text-amber-400" />
              <span className="text-lg font-medium text-amber-700 dark:text-amber-300">
                Siguiente Nivel
              </span>
            </div>
            <div className="mb-4 space-y-2">
              <div className="text-2xl font-bold text-amber-900 dark:text-amber-100 md:text-3xl">
                {nextLevel.sb} / {nextLevel.bb}
                {nextLevel.ante > 0 && (
                  <span className="text-orange-600"> / {nextLevel.ante}</span>
                )}
              </div>
              <Badge
                variant="outline"
                className="border-amber-300 text-amber-700 dark:border-amber-700 dark:text-amber-300"
              >
                <ClockIcon className="mr-2 size-3" />
                {nextLevel.time} minutos
              </Badge>
            </div>
            <Button
              variant="outline"
              className="border-amber-300 text-amber-700 hover:bg-amber-100 dark:border-amber-700 dark:text-amber-300 dark:hover:bg-amber-900"
              onClick={() => {
                let finishedLevelsMinutes = 0;
                for (let i = 0; i <= levelIndex; i++) {
                  finishedLevelsMinutes =
                    +finishedLevelsMinutes + +levels[i].time;
                }
                setTimer(finishedLevelsMinutes * 60);
              }}
            >
              <FastForward className="mr-2 size-4" />
              Saltar al siguiente nivel
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Configurar atajos de teclado
  useKeyboardShortcuts(
    {
      space: () => {
        if (game.id) {
          togglePlaying();
        }
      },
      r: () => {
        if (game.id) {
          resetGame();
        }
      },
      n: () => {
        if (game.id) {
          goToNextLevel();
        }
      },
      p: () => {
        if (game.id) {
          goToPreviousLevel();
        }
      },
      plus: () => {
        if (game.id && !entriesStatus.closed) {
          addPlayer();
        }
      },
      minus: () => {
        if (game.id && players > 0) {
          removePlayer();
        }
      },
      "ctrl+plus": () => {
        if (game.id && !entriesStatus.closed) {
          addEntry();
        }
      },
      "ctrl+minus": () => {
        if (game.id && entries > 0) {
          removeEntry();
        }
      },
      a: () => {
        if (game.id) {
          addAddon();
        }
      },
      "shift+a": () => {
        if (game.id) {
          addDoubleAddon();
        }
      },
      f: () => {
        if (game.id && timer > 0) {
          finishTournament();
        }
      },
      "?": () => {
        setShowShortcutsHelp(true);
      },
      "shift+/": () => {
        setShowShortcutsHelp(true);
      },
    },
    {
      enabled: true,
      preventDefault: true,
    }
  );

  // Memoizar el cálculo de premios
  const calculatedPrizes = useMemo(() => {
    if (!currentStructurePrizes.prizes?.length) {
      return [];
    }

    let remainingPot = realPot - (game.bubble || 0);
    const prizes = [];

    for (let i = 0; i < currentStructurePrizes.prizes.length; i++) {
      const newPrize =
        Math.ceil(
          ((realPot - (game.bubble || 0)) *
            currentStructurePrizes.prizes[i].percentaje) /
            100 /
            5
        ) * 5;

      const currentPrize = newPrize <= remainingPot ? newPrize : remainingPot;

      prizes.push({
        id: currentStructurePrizes.prizes[i].id,
        percentaje: currentStructurePrizes.prizes[i].percentaje,
        prize: currentPrize,
      });
      remainingPot -= newPrize;
      if (remainingPot <= 0) {
        break;
      }
    }

    return prizes.map((prize) => (
      <div key={prize.id} className="flex justify-between">
        <small>{prize.percentaje}%</small>
        <strong>
          {prize.prize.toLocaleString("es-ES", {
            currency: "EUR",
            style: "currency",
            minimumFractionDigits: 0,
          })}
        </strong>
      </div>
    ));
  }, [currentStructurePrizes.prizes, realPot, game.bubble]);

  return (
    <LoadingOverlay
      isLoading={isLoadingTemplate || isResetting}
      text={isLoadingTemplate ? "Iniciando torneo..." : "Reiniciando torneo..."}
    >
      <div className="w-full">
        {!game.id && !template.id ? (
          <div className="flex flex-col items-start gap-4">
            <Select
              onValueChange={(e) => {
                setCurrentTemplate(parseInt(e.toString()));
              }}
              disabled={isLoadingTemplate}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Elegir plantilla" />
              </SelectTrigger>
              <SelectContent>
                {gameTemplates.map((template) => (
                  <SelectItem key={template.id} value={template.id.toString()}>
                    {template.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {isLoadingTemplate && (
              <div className="w-full">
                <SpinnerWithText text="Configurando torneo..." />
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-6">
            {/* Header con controles mejorados */}
            <div className="order-3 mt-5 flex w-full flex-col gap-3 md:order-1 md:mt-0 md:flex-row md:items-center md:justify-between">
              {/* Controles de torneo */}
              <div className="flex w-full items-center justify-between gap-2 md:w-auto">
                <div className="flex items-center gap-1 sm:gap-2">
                  {timer > 0 && players > 0 && (
                    <ConfirmationDialog
                      title="Finalizar torneo"
                      description="¿Quieres finalizar el torneo y guardarlo en el historial?"
                      onConfirm={finishTournament}
                      variant="info"
                      type="custom"
                      confirmText="Finalizar"
                    >
                      <Button
                        variant="default"
                        size="sm"
                        className="border-green-600 bg-green-600 text-white hover:border-green-700 hover:bg-green-700"
                        title="Finalizar torneo"
                      >
                        <SquareIcon className="size-4 sm:mr-2" />
                        <span className="hidden sm:inline">Finalizar</span>
                      </Button>
                    </ConfirmationDialog>
                  )}

                  <ResetConfirmationDialog onConfirm={resetGame}>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="bg-red-600 text-white hover:bg-red-700"
                      title="Reiniciar torneo"
                    >
                      <RotateCcw className="size-4 sm:mr-2" />
                      <span className="hidden sm:inline">Reset</span>
                    </Button>
                  </ResetConfirmationDialog>
                </div>

                {/* Botón de ayuda de atajos */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowShortcutsHelp(true)}
                  className="border-slate-300 text-slate-600 hover:bg-slate-100 dark:border-slate-600 dark:text-slate-400 dark:hover:bg-slate-800"
                  title="Ver atajos de teclado (Presiona ?)"
                >
                  <KeyboardIcon className="size-4 sm:mr-2" />
                  <span className="hidden sm:inline">Atajos</span>
                </Button>
              </div>
            </div>

            {/* Título del torneo */}
            <h1 className="order-1 text-center text-2xl font-bold sm:text-3xl md:order-2 md:text-4xl">
              {game.name}
            </h1>
            <div className="order-2 flex w-full flex-col gap-4 md:order-3 md:flex-row md:items-start md:justify-between md:gap-6">
              {/* Estadísticas laterales */}
              <div className="order-2 md:order-1 md:w-1/5">
                <div className="grid grid-cols-3 gap-3 md:block md:space-y-6">
                  <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
                    <CardContent className="p-3 md:p-5">
                      <div className="flex flex-col items-center gap-2 md:flex-row md:gap-3">
                        <div className="rounded-full bg-blue-100 p-2 dark:bg-blue-900">
                          <UsersIcon className="size-4 text-blue-600 dark:text-blue-400 md:size-5" />
                        </div>
                        <div className="flex-1 text-center md:text-left">
                          <p className="text-xs font-medium text-blue-700 dark:text-blue-300 md:text-sm">
                            Jugadores
                          </p>
                          <p className="text-lg font-bold text-blue-900 dark:text-blue-100 md:text-2xl">
                            {players} / {totalPlayers}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
                    <CardContent className="p-3 md:p-5">
                      <div className="flex flex-col items-center gap-2 md:flex-row md:gap-3">
                        <div className="rounded-full bg-green-100 p-2 dark:bg-green-900">
                          <CoinsIcon className="size-4 text-green-600 dark:text-green-400 md:size-5" />
                        </div>
                        <div className="flex-1 text-center md:text-left">
                          <p className="text-xs font-medium text-green-700 dark:text-green-300 md:text-sm">
                            Total Fichas
                          </p>
                          <p className="text-lg font-bold text-green-900 dark:text-green-100 md:text-2xl">
                            {totalChips.toLocaleString("es-ES")}
                          </p>
                          {punctualityBonusPlayers > 0 && (
                            <p className="text-xs text-green-600 dark:text-green-400">
                              +
                              {(
                                punctualityBonusPlayers *
                                parseInt(
                                  game.punctuality_bonus?.toString() || "0"
                                )
                              ).toLocaleString("es-ES")}{" "}
                              <span className="hidden sm:inline">
                                puntos de bono
                              </span>
                              <span className="sm:hidden">bono</span>
                            </p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900">
                    <CardContent className="p-3 md:p-5">
                      <div className="flex flex-col items-center gap-2 md:flex-row md:gap-3">
                        <div className="rounded-full bg-purple-100 p-2 dark:bg-purple-900">
                          <TrendingUpIcon className="size-4 text-purple-600 dark:text-purple-400 md:size-5" />
                        </div>
                        <div className="flex-1 text-center md:text-left">
                          <p className="text-xs font-medium text-purple-700 dark:text-purple-300 md:text-sm">
                            <span className="hidden sm:inline">
                              Stack Promedio
                            </span>
                            <span className="sm:hidden">Stack Prom.</span>
                          </p>
                          <p className="text-lg font-bold text-purple-900 dark:text-purple-100 md:text-2xl">
                            {players > 0
                              ? Math.round(totalChips / players).toLocaleString(
                                  "es-ES"
                                )
                              : 0}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Sección central */}
              <div className="order-1 md:order-2 md:w-3/5">
                <div className="space-y-4 md:space-y-6">
                  {/* Estado del juego */}
                  {!playing && timer > 0 && (
                    <Card className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950">
                      <CardContent className="p-3 md:p-5">
                        <div className="flex items-center justify-center gap-2">
                          <PauseIcon className="size-4 text-red-600 md:size-5" />
                          <p className="text-base font-bold text-red-700 dark:text-red-300 md:text-lg">
                            TORNEO EN PAUSA
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Nivel actual */}
                  <Card className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
                    <CardContent className="p-4 md:p-5">
                      {showCurrentLevel()}
                    </CardContent>
                  </Card>

                  {/* Bono de puntualidad */}
                  {showPunctualityBonus()}

                  {/* Estado de entradas */}
                  {game.last_entry_level && (
                    <Card
                      className={`${
                        entriesStatus.closed
                          ? "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950"
                          : "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950"
                      }`}
                    >
                      <CardContent className="p-5">
                        <div className="text-center">
                          <div className="mb-2 flex items-center justify-center gap-2">
                            <span className="text-2xl">
                              {entriesStatus.closed ? "🔒" : "🚪"}
                            </span>
                            <h3
                              className={`text-lg font-bold ${
                                entriesStatus.closed
                                  ? "text-red-700 dark:text-red-300"
                                  : "text-green-700 dark:text-green-300"
                              }`}
                            >
                              {entriesStatus.closed
                                ? "Entradas Cerradas"
                                : "Entradas Abiertas"}
                            </h3>
                          </div>
                          <p
                            className={`text-sm ${
                              entriesStatus.closed
                                ? "text-red-600 dark:text-red-400"
                                : "text-green-600 dark:text-green-400"
                            }`}
                          >
                            {entriesStatus.message}
                          </p>
                          {!entriesStatus.closed && entriesStatus.lastLevel && (
                            <p className="mt-1 text-xs text-orange-500">
                              ⚠️ Las entradas se cerrarán en el nivel{" "}
                              {entriesStatus.lastLevel + 1}
                            </p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Cronómetro con controles integrados */}
                  <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950 dark:to-purple-950">
                    <CardContent className="p-4 md:p-5">
                      <div className="text-center">
                        <div className="mb-4 flex items-center justify-center gap-2">
                          <ClockIcon className="size-5 text-indigo-600 dark:text-indigo-400 md:size-6" />
                          <span className="text-base font-medium text-indigo-700 dark:text-indigo-300 md:text-lg">
                            {timer === 0 ? "Cronómetro" : "Tiempo Transcurrido"}
                          </span>
                        </div>

                        {timer > 0 ? (
                          <div
                            className="cursor-pointer transition-transform hover:scale-105"
                            onClick={togglePlaying}
                            title={
                              playing
                                ? "Click para pausar"
                                : "Click para reanudar"
                            }
                          >
                            <div className="text-4xl font-bold text-indigo-900 dark:text-indigo-100 sm:text-5xl md:text-6xl lg:text-8xl">
                              {showClock()}
                            </div>
                            <div className="mt-2 flex items-center justify-center gap-2 text-xs text-indigo-600 dark:text-indigo-400 md:text-sm">
                              {playing ? (
                                <>
                                  <PauseIcon className="size-3 md:size-4" />
                                  <span className="hidden sm:inline">
                                    Click para pausar
                                  </span>
                                  <span className="sm:hidden">Pausar</span>
                                </>
                              ) : (
                                <>
                                  <PlayIcon className="size-3 md:size-4" />
                                  <span className="hidden sm:inline">
                                    Click para reanudar
                                  </span>
                                  <span className="sm:hidden">Reanudar</span>
                                </>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            <div className="text-4xl font-bold text-indigo-900 dark:text-indigo-100 sm:text-5xl md:text-6xl lg:text-8xl">
                              00:00
                            </div>
                            <Button
                              className="w-32 px-6 py-2 sm:w-40 sm:px-8 sm:py-3"
                              size="lg"
                              onClick={togglePlaying}
                              variant="default"
                            >
                              <PlayIcon className="mr-2 size-4 sm:size-5" />
                              <span className="hidden sm:inline">
                                Iniciar Torneo
                              </span>
                              <span className="sm:hidden">Iniciar</span>
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Siguiente nivel */}
                  {showNextLevel()}
                </div>
              </div>
              {/* Información del bote y premios */}
              <div className="order-3 md:order-3 md:w-1/5">
                {currentStructurePrizes?.prizes?.length > 0 && (
                  <div className="space-y-6">
                    {/* Información del Bote */}
                    <Card className="bg-gradient-to-br from-emerald-50 to-green-100 dark:from-emerald-950 dark:to-green-900">
                      <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-lg text-emerald-700 dark:text-emerald-300">
                          <DollarSignIcon className="size-5" />
                          Información del Bote
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">
                            Bote Total
                          </span>
                          <span className="font-bold text-emerald-700 dark:text-emerald-300">
                            {totalPot.toLocaleString("es-ES", {
                              currency: "EUR",
                              style: "currency",
                              minimumFractionDigits: 0,
                            })}
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-sm text-red-600">Comisión</span>
                          <span className="font-medium text-red-600">
                            -
                            {fee.toLocaleString("es-ES", {
                              currency: "EUR",
                              style: "currency",
                              minimumFractionDigits: 0,
                            })}
                          </span>
                        </div>

                        {(addonsEnabled.simple || addonsEnabled.double) && (
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-blue-600">
                              Addons
                            </span>
                            <span className="font-medium text-blue-600">
                              +
                              {addonPot.toLocaleString("es-ES", {
                                currency: "EUR",
                                style: "currency",
                                minimumFractionDigits: 0,
                              })}
                            </span>
                          </div>
                        )}

                        {typeof game.extrapot === "number" &&
                          game.extrapot > 0 && (
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1">
                                <Gift className="size-3 text-green-600" />
                                <span className="text-sm text-green-600">
                                  Extra
                                </span>
                              </div>
                              <span className="font-medium text-green-600">
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
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1">
                              <Target className="size-3 text-orange-600" />
                              <span className="text-sm text-orange-600">
                                {entries} bounty{entries !== 1 ? "s" : ""}
                              </span>
                            </div>
                            <span className="font-medium text-orange-600">
                              {(entries * game.bounty).toLocaleString("es-ES", {
                                currency: "EUR",
                                style: "currency",
                                minimumFractionDigits: 0,
                              })}
                            </span>
                          </div>
                        )}

                        <div className="border-t pt-3">
                          <div className="flex items-center justify-between">
                            <span className="font-bold">Bote Real</span>
                            <span className="text-lg font-bold text-emerald-700 dark:text-emerald-300">
                              {realPot.toLocaleString("es-ES", {
                                currency: "EUR",
                                style: "currency",
                                minimumFractionDigits: 0,
                              })}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Estructura de Premios */}
                    <Card className="bg-gradient-to-br from-yellow-50 to-amber-100 dark:from-yellow-950 dark:to-amber-900">
                      <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-lg text-amber-700 dark:text-amber-300">
                          <TrophyIcon className="size-5" />
                          Premios
                        </CardTitle>
                        {currentStructurePrizes.max_players && (
                          <p className="text-xs text-amber-600 dark:text-amber-400">
                            Estructura para máx.{" "}
                            {currentStructurePrizes.max_players} jugadores
                          </p>
                        )}
                      </CardHeader>
                      <CardContent className="space-y-2">
                        {calculatedPrizes}
                        {typeof game.bubble === "number" && game.bubble > 0 && (
                          <div className="mt-3 border-t pt-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-orange-600">
                                Burbuja
                              </span>
                              <span className="font-medium text-orange-600">
                                {Math.round(game.bubble).toLocaleString(
                                  "es-ES",
                                  {
                                    currency: "EUR",
                                    style: "currency",
                                    minimumFractionDigits: 0,
                                  }
                                )}
                              </span>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>
            </div>
            {/* Controles de gestión */}
            <div className="order-4 mt-6 flex w-full flex-col gap-3 sm:flex-row sm:gap-4 md:mt-8">
              {/* Control de Jugadores */}
              <Card className="flex-1 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-900">
                <CardContent className="p-3 sm:p-4 md:p-5">
                  <div className="text-center">
                    <div className="mb-3 flex items-center justify-center gap-2 md:mb-4">
                      <UsersIcon className="size-4 text-blue-600 dark:text-blue-400 md:size-5" />
                      <span className="text-sm font-medium text-blue-700 dark:text-blue-300 md:text-base">
                        Jugadores
                      </span>
                    </div>
                    <div className="flex items-center justify-center space-x-2 sm:space-x-3">
                      <Button
                        size="icon"
                        variant="outline"
                        className="size-8 border-blue-300 text-blue-600 hover:bg-blue-100 dark:border-blue-700 dark:text-blue-400 dark:hover:bg-blue-900 sm:size-10"
                        onClick={() => removePlayer()}
                      >
                        <MinusIcon className="size-3 sm:size-4" />
                      </Button>
                      <span className="min-w-[2.5rem] text-xl font-bold text-blue-900 dark:text-blue-100 sm:min-w-[3rem] sm:text-2xl">
                        {players}
                      </span>
                      <Button
                        size="icon"
                        variant="outline"
                        className="size-8 border-blue-300 text-blue-600 hover:bg-blue-100 dark:border-blue-700 dark:text-blue-400 dark:hover:bg-blue-900 sm:size-10"
                        onClick={() => addPlayer()}
                        disabled={entriesStatus.closed}
                        title={
                          entriesStatus.closed
                            ? "Entradas cerradas"
                            : "Añadir jugador"
                        }
                      >
                        <PlusIcon className="size-3 sm:size-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Control de Entradas */}
              <Card className="flex-1 bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-950 dark:to-emerald-900">
                <CardContent className="p-3 sm:p-4 md:p-5">
                  <div className="text-center">
                    <div className="mb-3 flex items-center justify-center gap-2 md:mb-4">
                      <DollarSignIcon className="size-4 text-green-600 dark:text-green-400 md:size-5" />
                      <span className="text-sm font-medium text-green-700 dark:text-green-300 md:text-base">
                        Entradas
                      </span>
                    </div>
                    <div className="flex items-center justify-center space-x-2 sm:space-x-3">
                      <Button
                        size="icon"
                        variant="outline"
                        className="size-8 border-green-300 text-green-600 hover:bg-green-100 dark:border-green-700 dark:text-green-400 dark:hover:bg-green-900 sm:size-10"
                        onClick={() => removeEntry()}
                      >
                        <MinusIcon className="size-3 sm:size-4" />
                      </Button>
                      <span className="min-w-[2.5rem] text-xl font-bold text-green-900 dark:text-green-100 sm:min-w-[3rem] sm:text-2xl">
                        {entries}
                      </span>
                      <Button
                        size="icon"
                        variant="outline"
                        className="size-8 border-green-300 text-green-600 hover:bg-green-100 dark:border-green-700 dark:text-green-400 dark:hover:bg-green-900 sm:size-10"
                        onClick={() => addEntry()}
                        disabled={entriesStatus.closed}
                        title={
                          entriesStatus.closed
                            ? "Entradas cerradas"
                            : "Añadir entrada"
                        }
                      >
                        <PlusIcon className="size-3 sm:size-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Control de Addons */}
              {addonsEnabled.simple && (
                <Card className="flex-1 bg-gradient-to-br from-purple-50 to-violet-100 dark:from-purple-950 dark:to-violet-900">
                  <CardContent className="p-3 sm:p-4 md:p-5">
                    <div className="text-center">
                      <div className="mb-3 flex items-center justify-center gap-2 md:mb-4">
                        <CoinsIcon className="size-4 text-purple-600 dark:text-purple-400 md:size-5" />
                        <span className="text-sm font-medium text-purple-700 dark:text-purple-300 md:text-base">
                          Addons
                        </span>
                      </div>
                      <div className="flex items-center justify-center space-x-2 sm:space-x-3">
                        <Button
                          size="icon"
                          variant="outline"
                          className="size-8 border-purple-300 text-purple-600 hover:bg-purple-100 dark:border-purple-700 dark:text-purple-400 dark:hover:bg-purple-900 sm:size-10"
                          onClick={() => removeAddon()}
                        >
                          <MinusIcon className="size-3 sm:size-4" />
                        </Button>
                        <span className="min-w-[2.5rem] text-xl font-bold text-purple-900 dark:text-purple-100 sm:min-w-[3rem] sm:text-2xl">
                          {addons}
                        </span>
                        <Button
                          size="icon"
                          variant="outline"
                          className="size-8 border-purple-300 text-purple-600 hover:bg-purple-100 dark:border-purple-700 dark:text-purple-400 dark:hover:bg-purple-900 sm:size-10"
                          onClick={() => addAddon()}
                        >
                          <PlusIcon className="size-3 sm:size-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Control de Doble Addons */}
              {addonsEnabled.double && (
                <Card className="flex-1 bg-gradient-to-br from-orange-50 to-red-100 dark:from-orange-950 dark:to-red-900">
                  <CardContent className="p-3 sm:p-4 md:p-5">
                    <div className="text-center">
                      <div className="mb-3 flex items-center justify-center gap-2 md:mb-4">
                        <TrophyIcon className="size-4 text-orange-600 dark:text-orange-400 md:size-5" />
                        <span className="text-sm font-medium text-orange-700 dark:text-orange-300 md:text-base">
                          Doble Addons
                        </span>
                      </div>
                      <div className="flex items-center justify-center space-x-2 sm:space-x-3">
                        <Button
                          size="icon"
                          variant="outline"
                          className="size-8 border-orange-300 text-orange-600 hover:bg-orange-100 dark:border-orange-700 dark:text-orange-400 dark:hover:bg-orange-900 sm:size-10"
                          onClick={() => removeDoubleAddon()}
                        >
                          <MinusIcon className="size-3 sm:size-4" />
                        </Button>
                        <span className="min-w-[2.5rem] text-xl font-bold text-orange-900 dark:text-orange-100 sm:min-w-[3rem] sm:text-2xl">
                          {doubleaddons}
                        </span>
                        <Button
                          size="icon"
                          variant="outline"
                          className="size-8 border-orange-300 text-orange-600 hover:bg-orange-100 dark:border-orange-700 dark:text-orange-400 dark:hover:bg-orange-900 sm:size-10"
                          onClick={() => addDoubleAddon()}
                        >
                          <PlusIcon className="size-3 sm:size-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}
        <audio ref={audioPlayer} src={Notification} />

        {/* Diálogo de ayuda de atajos de teclado */}
        <KeyboardShortcutsHelp
          open={showShortcutsHelp}
          onOpenChange={setShowShortcutsHelp}
        />
      </div>
    </LoadingOverlay>
  );
}
