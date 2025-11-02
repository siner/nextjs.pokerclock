"use client";

import { GameTemplate, type Game } from "@/types";
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
import { LoadingOverlay, SpinnerWithText } from "@/components/ui/loading";
import {
  DataRecovery,
  SafeStorage,
  useErrorHandler,
} from "@/lib/error-handling";
import {
  TournamentTimer,
  TournamentStats,
  TournamentControls,
  TournamentLevels,
  TournamentPrizes,
  TournamentStatus,
  PunctualityBonusIndicator,
} from "@/components/tournament";
import { trackEvent } from "@/lib/analytics";
import { Button } from "@/components/ui/button";
import {
  ExitConfirmationDialog,
  ResetConfirmationDialog,
} from "@/components/ui/confirmation-dialog";
import { useRouter } from "next/navigation";
import { ArrowLeftIcon, HomeIcon, KeyboardIcon } from "lucide-react";

const Notification = "/notification.mp3";

export default function PlayGame(params: { template: string }) {
  const { toast } = useToast();
  const { handleError } = useErrorHandler();
  const audioPlayer = useRef<HTMLAudioElement>(null);
  const router = useRouter();

  function playAudio() {
    if (audioPlayer.current) {
      audioPlayer.current.play();
    }
  }

  // Función para calcular el nivel actual basado en el tiempo transcurrido
  function calculateCurrentLevelIndex(
    elapsedSeconds: number,
    levels: { time: number }[]
  ): number {
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
  }

  // Estados principales
  const [template, setTemplate] = useState<GameTemplate>({} as GameTemplate);
  const [game, setGame] = useState<Game>({} as Game);
  const [isLoadingTemplate, setIsLoadingTemplate] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [showShortcutsHelp, setShowShortcutsHelp] = useState(false);

  // Estados del torneo
  const [playing, setPlaying] = useState(false);
  const [timer, setTimer] = useState(0);
  const [levelIndex, setLevelIndex] = useState(0);
  const [players, setPlayers] = useState<number>(0);
  const [totalPlayers, setTotalPlayers] = useState<number>(0);
  const [entries, setEntries] = useState<number>(0);
  const [addons, setAddons] = useState<number>(0);
  const [doubleaddons, setDoubleAddons] = useState<number>(0);
  const [punctualityBonusPlayers, setPunctualityBonusPlayers] = useState(0);

  // Niveles actuales
  const currentLevel = useMemo(() => {
    return game.levels?.[levelIndex] || null;
  }, [game.levels, levelIndex]);

  const nextLevel = useMemo(() => {
    return game.levels?.[levelIndex + 1] || null;
  }, [game.levels, levelIndex]);

  // Cálculos derivados
  const totalPot = useMemo(
    () => entries * (game.entry || 0),
    [entries, game.entry]
  );
  const fee = useMemo(
    () => Math.ceil((totalPot * (game.fee || 0)) / 100 / 5) * 5,
    [totalPot, game.fee]
  );
  const addonPot = useMemo(
    () =>
      addons * (game.addon_price || 0) +
      doubleaddons * (game.double_addon_price || 0),
    [addons, game.addon_price, doubleaddons, game.double_addon_price]
  );
  const realPot = useMemo(
    () => totalPot - fee + addonPot + (game.extrapot || 0),
    [totalPot, fee, addonPot, game.extrapot]
  );

  const totalChips = useMemo(() => {
    const baseChips = entries * parseInt(game.points || "0");
    const bonusChips =
      punctualityBonusPlayers *
      parseInt(game.punctuality_bonus?.toString() || "0");
    return baseChips + bonusChips;
  }, [entries, game.points, punctualityBonusPlayers, game.punctuality_bonus]);

  const addonsEnabled = useMemo(() => {
    return {
      simple: (game.addon_price || 0) > 0 && (game.addon_points || 0) > 0,
      double:
        (game.double_addon_price || 0) > 0 &&
        (game.double_addon_points || 0) > 0,
    };
  }, [
    game.addon_price,
    game.addon_points,
    game.double_addon_price,
    game.double_addon_points,
  ]);

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

  const currentPrizeStructure = useMemo(() => {
    if (!game?.prize_structures?.length) {
      return { max_players: 0, prizes: [] };
    }

    const sortedStructures = [...game.prize_structures].sort(
      (a, b) => a.max_players - b.max_players
    );

    for (const structure of sortedStructures) {
      if (totalPlayers <= structure.max_players) {
        return structure;
      }
    }

    return sortedStructures[sortedStructures.length - 1];
  }, [game.prize_structures, totalPlayers]);

  const punctualityBonusStatus = useMemo(() => {
    if (!game.punctuality_bonus || game.punctuality_bonus === 0) {
      return { available: false, timeLeft: 0, expired: false };
    }

    if (levelIndex > 0) {
      return { available: false, timeLeft: 0, expired: true };
    }

    const firstLevelDuration = game.levels?.[0]?.time * 60 || 0;

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
      expired: timeLeft <= 0 && timer > 0,
      isExpiring: timeLeft <= 60 && timeLeft > 0,
    };
  }, [game.punctuality_bonus, levelIndex, timer, game.levels]);

  const clockDisplay = useMemo(() => {
    if (timer === 0) {
      return "00:00";
    }

    const finishedLevelsMinutes = (game.levels || [])
      .slice(0, levelIndex)
      .reduce((total, level) => total + level.time, 0);

    const currentLevelTimer = timer - finishedLevelsMinutes * 60;
    const safeCurrentLevelTimer = Math.max(0, currentLevelTimer);
    const minutes = Math.floor(safeCurrentLevelTimer / 60);
    const seconds = safeCurrentLevelTimer % 60;

    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  }, [timer, game.levels, levelIndex]);

  // Cargar plantillas disponibles
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

  // Guardar juego
  const saveGame = useCallback(() => {
    const newGame = {
      ...game,
      players: players,
      total_players: totalPlayers,
      entries: entries,
      addons: addons,
      doubleaddons: doubleaddons,
      elapsed: timer,
      punctuality_bonus_players: punctualityBonusPlayers,
    } as Game;

    // Guardar en localStorage de forma asíncrona para no bloquear la UI
    if (typeof window !== "undefined") {
      setTimeout(() => {
        localStorage.setItem("game", JSON.stringify(newGame));
      }, 0);
    }
  }, [
    game,
    players,
    totalPlayers,
    entries,
    addons,
    doubleaddons,
    timer,
    punctualityBonusPlayers,
  ]);

  // Funciones de control
  function togglePlaying() {
    const nextState = !playing;
    setPlaying(nextState);
    if (game.id) {
      trackEvent("play_timer_toggled", {
        playing: nextState,
        elapsed: timer,
        level: levelIndex + 1,
      });
    }
  }

  function goToNextLevel() {
    if (levelIndex < (game.levels?.length || 0) - 1) {
      setLevelIndex(levelIndex + 1);
      if (game.id) {
        trackEvent("play_level_changed", {
          to: levelIndex + 2,
          reason: "manual_next",
        });
      }
      toast({
        title: "Nivel avanzado",
        description: `Avanzado al nivel ${levelIndex + 2}`,
      });
      return true;
    } else {
      toast({
        title: "Último nivel",
        description: "Ya estás en el último nivel del torneo",
        variant: "destructive",
      });
      return false;
    }
  }

  function goToPreviousLevel() {
    if (levelIndex > 0) {
      setLevelIndex(levelIndex - 1);
      if (game.id) {
        trackEvent("play_level_changed", {
          to: levelIndex,
          reason: "manual_prev",
        });
      }
      toast({
        title: "Nivel retrocedido",
        description: `Retrocedido al nivel ${levelIndex}`,
      });
      return true;
    } else {
      toast({
        title: "Primer nivel",
        description: "Ya estás en el primer nivel del torneo",
        variant: "destructive",
      });
      return false;
    }
  }

  function jumpToNextLevel() {
    if (levelIndex < (game.levels?.length || 0) - 1) {
      let finishedLevelsMinutes = 0;
      for (let i = 0; i <= levelIndex; i++) {
        finishedLevelsMinutes += game.levels?.[i]?.time || 0;
      }
      const newTimer = finishedLevelsMinutes * 60;
      setTimer(Math.max(timer, newTimer));
      if (game.id) {
        trackEvent("play_jump_to_level", {
          to: levelIndex + 2,
        });
      }
      goToNextLevel();
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
    if (game.id) {
      trackEvent("play_player_update", {
        action: "add",
        players: players + 1,
        totalPlayers: totalPlayers + 1,
      });
      trackEvent("play_entry_update", {
        action: "add",
        entries: entries + 1,
      });
    }

    if (punctualityBonusStatus.available && levelIndex === 0) {
      setPunctualityBonusPlayers(punctualityBonusPlayers + 1);
      trackEvent("play_punctuality_bonus", {
        playersWithBonus: punctualityBonusPlayers + 1,
      });
      toast({
        title: "¡Bono de puntualidad aplicado!",
        description: `Jugador añadido con ${game.punctuality_bonus?.toLocaleString("es-ES")} puntos extra`,
      });
    }
  }

  function removePlayer() {
    if (players > 0) {
      setPlayers(players - 1);
      if (game.id) {
        trackEvent("play_player_update", {
          action: "remove",
          players: players - 1,
          totalPlayers,
        });
      }
      toast({
        title: "Jugador eliminado",
      });
    }
  }

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
    if (game.id) {
      trackEvent("play_entry_update", {
        action: "add",
        entries: entries + 1,
      });
    }
  }

  function removeEntry() {
    if (entries > 0) {
      setEntries(entries - 1);
      if (game.id) {
        trackEvent("play_entry_update", {
          action: "remove",
          entries: entries - 1,
        });
      }
    }
  }

  function addAddon() {
    setAddons(addons + 1);
    if (game.id) {
      trackEvent("play_addon_update", {
        addonType: "simple",
        action: "add",
        count: addons + 1,
      });
    }
  }

  function removeAddon() {
    if (addons > 0) {
      setAddons(addons - 1);
      if (game.id) {
        trackEvent("play_addon_update", {
          addonType: "simple",
          action: "remove",
          count: addons - 1,
        });
      }
    }
  }

  function addDoubleAddon() {
    setDoubleAddons(doubleaddons + 1);
    if (game.id) {
      trackEvent("play_addon_update", {
        addonType: "double",
        action: "add",
        count: doubleaddons + 1,
      });
    }
  }

  function removeDoubleAddon() {
    if (doubleaddons > 0) {
      setDoubleAddons(doubleaddons - 1);
      if (game.id) {
        trackEvent("play_addon_update", {
          addonType: "double",
          action: "remove",
          count: doubleaddons - 1,
        });
      }
    }
  }

  // Inicialización y recuperación de juego
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
            setPlayers(currentGame.players);
            setTotalPlayers(currentGame.total_players);
            setEntries(currentGame.entries);
            setAddons(currentGame.addons);
            setDoubleAddons(currentGame.doubleaddons);
            setTimer(currentGame.elapsed);
            setPunctualityBonusPlayers(
              currentGame.punctuality_bonus_players || 0
            );

            const calculatedLevelIndex = calculateCurrentLevelIndex(
              currentGame.elapsed,
              currentGame.levels
            );
            setLevelIndex(calculatedLevelIndex);

            trackEvent("play_game_recovered", {
              templateName: currentGame.name,
              elapsed: currentGame.elapsed,
              level: calculatedLevelIndex + 1,
            });

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

  // Actualizar estado del game
  useEffect(() => {
    if (game.id) {
      setGame((prevGame) => ({
        ...prevGame,
        players: players,
        total_players: totalPlayers,
        entries: entries,
        addons: addons,
        doubleaddons: doubleaddons,
        elapsed: timer,
        punctuality_bonus_players: punctualityBonusPlayers,
      }));
    }
  }, [
    timer,
    players,
    totalPlayers,
    entries,
    addons,
    doubleaddons,
    punctualityBonusPlayers,
  ]);

  // Guardar juego cuando cambie el estado
  useEffect(() => {
    if (game.id) {
      saveGame();
    }
  }, [game, saveGame]);

  // Cronómetro
  useEffect(() => {
    if (playing) {
      const interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer + 1);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [playing]);

  // Cambio de nivel automático
  useEffect(() => {
    if (!playing || timer === 0 || !game.levels?.length || !game.id) return;

    const timeToEndCurrentLevel = game.levels
      .slice(0, levelIndex + 1)
      .reduce((total, level) => total + level.time * 60, 0);

    if (timer >= timeToEndCurrentLevel && levelIndex < game.levels.length - 1) {
      playAudio();
      setLevelIndex((prevIndex) => {
        const nextIndex = prevIndex + 1;
        trackEvent("play_level_changed", {
          to: nextIndex + 1,
          reason: "auto",
        });
        return nextIndex;
      });
    }
  }, [timer, levelIndex, game.levels, playing, game.id]);

  // Notificación de bono de puntualidad
  useEffect(() => {
    if (
      punctualityBonusStatus.isExpiring &&
      punctualityBonusStatus.timeLeft === 30
    ) {
      playAudio();
    }
  }, [punctualityBonusStatus.isExpiring, punctualityBonusStatus.timeLeft]);

  // Configurar plantilla inicial
  async function setCurrentTemplate(id: number) {
    setIsLoadingTemplate(true);

    try {
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
        trackEvent("play_error", {
          context: "template_not_found",
          message: `template ${id} not found`,
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
      setPlayers(0);
      setTotalPlayers(0);
      setEntries(0);
      setAddons(0);
      setDoubleAddons(0);
      setPunctualityBonusPlayers(0);
      setTimer(0);
      setLevelIndex(0);
      localStorage.setItem("game", JSON.stringify(newGame));

      trackEvent("play_template_selected", {
        templateId: template.id,
        name: template.name,
        levels: template.levels.length,
      });

      toast({
        title: "¡Torneo iniciado!",
        description: `Torneo "${template.name}" configurado correctamente.`,
      });
    } catch (error) {
      console.error("Error setting template:", error);
      trackEvent("play_error", {
        context: "set_template",
        message: error instanceof Error ? error.message : "unknown",
      });
      toast({
        title: "Error",
        description: "No se pudo iniciar el torneo. Inténtalo de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingTemplate(false);
    }
  }

  // Resetear juego
  async function resetGame() {
    setIsResetting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 800));

      setPlaying(false);
      setTimer(0);
      setLevelIndex(0);
      setPlayers(0);
      setTotalPlayers(0);
      setEntries(0);
      setAddons(0);
      setDoubleAddons(0);
      setPunctualityBonusPlayers(0);
      setGame({} as Game);
      setTemplate({} as GameTemplate);
      localStorage.removeItem("game");

      trackEvent("play_reset", {
        templateId: game.id,
      });

      toast({
        title: "¡Torneo reiniciado!",
        description: "Puedes seleccionar una nueva plantilla para empezar.",
      });
    } catch (error) {
      console.error("Error resetting game:", error);
      trackEvent("play_error", {
        context: "reset_game",
        message: error instanceof Error ? error.message : "unknown",
      });
      toast({
        title: "Error",
        description: "No se pudo reiniciar el torneo.",
        variant: "destructive",
      });
    } finally {
      setIsResetting(false);
    }
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

  return (
    <LoadingOverlay
      isLoading={isLoadingTemplate || isResetting}
      text={isLoadingTemplate ? "Iniciando torneo..." : "Reiniciando torneo..."}
    >
      <div className="relative left-1/2 w-screen -translate-x-1/2 px-4 pb-16 sm:px-8 lg:px-12">
        {game.id && (
          <div className="pointer-events-none absolute inset-x-0 top-4 flex justify-between px-1 sm:px-6">
            <div className="pointer-events-auto flex gap-2">
              <ExitConfirmationDialog
                hasUnsavedChanges={false}
                onConfirm={() => router.push("/gametemplates")}
              >
                <Button variant="outline" size="sm" className="gap-2">
                  <ArrowLeftIcon className="h-4 w-4" />
                  Plantillas
                </Button>
              </ExitConfirmationDialog>
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={() => router.push("/")}
              >
                <HomeIcon className="h-4 w-4" />
                Inicio
              </Button>
            </div>
            <div className="pointer-events-auto flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={() => setShowShortcutsHelp(true)}
              >
                <KeyboardIcon className="h-4 w-4" />
                Atajos
              </Button>
              <ResetConfirmationDialog onConfirm={resetGame}>
                <Button variant="destructive" size="sm">
                  Resetear
                </Button>
              </ResetConfirmationDialog>
            </div>
          </div>
        )}

        <div className="mx-auto max-w-[1680px] space-y-10 pt-14">
          {!game.id && !template.id ? (
            <div className="bg-surface rounded-3xl border border-border/60 p-6 shadow-[0_46px_160px_-90px_hsl(var(--shadow-strong))]">
              <div className="flex flex-col gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.32em] text-muted-foreground">
                    Preparar torneo
                  </p>
                  <h2 className="mt-2 text-xl font-semibold text-foreground">
                    Selecciona una plantilla para comenzar
                  </h2>
                </div>
                <Select
                  onValueChange={(value) => {
                    setCurrentTemplate(parseInt(value.toString()));
                  }}
                  disabled={isLoadingTemplate}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Elegir plantilla" />
                  </SelectTrigger>
                  <SelectContent>
                    {gameTemplates.map((template) => (
                      <SelectItem
                        key={template.id}
                        value={template.id.toString()}
                      >
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
            </div>
          ) : (
            <div className="space-y-10">
              <h1 className="text-center text-3xl font-semibold text-foreground md:text-4xl">
                {game.name}
              </h1>

              <div className="grid gap-8 xl:grid-cols-[420px_minmax(0,1fr)_420px]">
                <div className="space-y-5 xl:pt-6">
                  <TournamentStats
                    players={players}
                    totalPlayers={totalPlayers}
                    totalChips={totalChips}
                    currentLevel={currentLevel}
                    punctualityBonusPlayers={punctualityBonusPlayers}
                    punctualityBonus={game.punctuality_bonus}
                  />
                  <PunctualityBonusIndicator
                    punctualityBonusStatus={punctualityBonusStatus}
                    punctualityBonus={game.punctuality_bonus}
                    timer={timer}
                  />
                </div>

                <div className="space-y-5">
                  <TournamentStatus
                    playing={playing}
                    timer={timer}
                    entriesStatus={entriesStatus}
                    game={game}
                  />
                  <TournamentTimer
                    timer={timer}
                    playing={playing}
                    clockDisplay={clockDisplay}
                    onTogglePlaying={togglePlaying}
                  />
                  <TournamentLevels
                    currentLevel={currentLevel}
                    nextLevel={nextLevel}
                    levelIndex={levelIndex}
                    onJumpToNextLevel={jumpToNextLevel}
                  />
                </div>

                <div className="space-y-5 xl:pt-6">
                  <TournamentPrizes
                    currentPrizeStructure={currentPrizeStructure}
                    totalPot={totalPot}
                    fee={fee}
                    addonPot={addonPot}
                    realPot={realPot}
                    entries={entries}
                    game={game}
                  />
                </div>
              </div>

              <div className="grid gap-6 xl:grid-cols-[minmax(0,2.5fr)_minmax(0,1fr)]">
                <TournamentControls
                  players={players}
                  entries={entries}
                  addons={addons}
                  doubleAddons={doubleaddons}
                  entriesStatus={entriesStatus}
                  addonsEnabled={addonsEnabled}
                  onAddPlayer={addPlayer}
                  onRemovePlayer={removePlayer}
                  onAddEntry={addEntry}
                  onRemoveEntry={removeEntry}
                  onAddAddon={addAddon}
                  onRemoveAddon={removeAddon}
                  onAddDoubleAddon={addDoubleAddon}
                  onRemoveDoubleAddon={removeDoubleAddon}
                />

                <div className="bg-surface-muted/70 flex h-full flex-col justify-between rounded-2xl border border-border/60 p-5 text-sm text-muted-foreground shadow-[0_32px_120px_-80px_hsl(var(--shadow-soft))]">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                      Sugerencia rápida
                    </p>
                    <h3 className="mt-2 text-lg font-semibold text-foreground">
                      Usa el modo pantalla completa
                    </h3>
                    <p className="mt-2">
                      Pulsa <span className="font-semibold">F11</span> (Windows)
                      o<span className="font-semibold"> Ctrl + Cmd + F</span>{" "}
                      (macOS) para mostrar solo el reloj en TV o proyector.
                    </p>
                  </div>
                  <p className="mt-4 text-xs text-muted-foreground">
                    Mantén este dispositivo como control remoto y abre la misma
                    URL en otro para visualizar únicamente la cuenta atrás.
                  </p>
                </div>
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
      </div>
    </LoadingOverlay>
  );
}
