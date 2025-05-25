"use client";

import {
  GameTemplate,
  type Game,
  type Level,
  type PrizeStructure,
} from "@/types";
import { Button } from "@/components/ui/button";
import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { useToast } from "@/hooks/use-toast";
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
} from "lucide-react";
import { ResetConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { LoadingOverlay, SpinnerWithText } from "@/components/ui/loading";
import {
  DataRecovery,
  SafeStorage,
  useErrorHandler,
} from "@/lib/error-handling";
import { ErrorBoundary } from "@/components/ui/error-boundary";
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
        points: template.points,
        extrapot: template.extrapot,
        addon_price: template.addon_price,
        addon_points: template.addon_points,
        double_addon_price: template.double_addon_price,
        double_addon_points: template.double_addon_points,
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
      points: game.points,
      extrapot: game.extrapot,
      addon_price: game.addon_price,
      addon_points: game.addon_points,
      double_addon_price: game.double_addon_price,
      double_addon_points: game.double_addon_points,
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

    const sortedStructures = [...game.prize_structures].sort(
      (a, b) => b.max_players - a.max_players
    );

    for (const structure of sortedStructures) {
      if (totalPlayers <= structure.max_players) {
        return structure;
      }
    }

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
    setRealPot(totalPot - fee + newaddonpot);
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
    setPlayers(players + 1);
    setEntries(entries + 1);
    setTotalPlayers(totalPlayers + 1);
  }
  function removePlayer() {
    if (players > 0) {
      setPlayers(players - 1);
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

  function showClock() {
    return clockDisplay;
  }

  function showCurrentLevel() {
    if (!currentLevel) {
      return;
    }
    return (
      <div className="flex w-full flex-col py-4 text-center">
        <h3 className="text-3xl font-bold md:text-6xl">
          {currentLevel.sb} / {currentLevel.bb}{" "}
          {currentLevel.ante > 0 ? " / " + currentLevel.ante : ""} /{" "}
          <span className="text-xl md:text-3xl">
            {currentLevel.time + "min"}
          </span>
        </h3>
      </div>
    );
  }

  function showNextLevel() {
    if (!nextLevel || !currentLevel) {
      return;
    }
    return (
      <div className="flex flex-col items-center justify-center">
        <div className="mt-4 flex w-full flex-col py-4 text-center md:mb-8">
          <h2 className="text-xl font-bold">Siguiente nivel</h2>
          <h3 className="text-xl font-bold md:text-2xl">
            {nextLevel.sb} / {nextLevel.bb}{" "}
            {nextLevel.ante > 0 ? "/" + nextLevel.ante : ""}/{" "}
            <span className="text-sm md:text-xl">{nextLevel.time + "min"}</span>
          </h3>
        </div>
        <Button
          className="mt-4"
          onClick={() => {
            let finishedLevelsMinutes = 0;
            for (let i = 0; i <= levelIndex; i++) {
              finishedLevelsMinutes = +finishedLevelsMinutes + +levels[i].time;
            }
            setTimer(finishedLevelsMinutes * 60);
          }}
        >
          <FastForward className="mr-2 size-4" />
          Siguiente nivel
        </Button>
      </div>
    );
  }

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
          <div className="flex flex-col items-center md:gap-4">
            <div className="order-3 flex w-full items-center justify-end md:order-1">
              <ResetConfirmationDialog onConfirm={resetGame}>
                <Button variant="destructive" size="icon">
                  <RotateCcw className="size-4" />
                </Button>
              </ResetConfirmationDialog>
            </div>
            <h1 className="order-1 mb-4 text-center text-4xl font-bold md:order-2 md:mb-8">
              {game.name}
            </h1>
            <div className="order-2 flex w-full flex-col md:order-3 md:flex-row md:items-start md:justify-between">
              <div className="order-2 mb-10 flex flex-col items-start justify-between space-y-2 md:order-1 md:w-1/6 md:space-y-10">
                <div className="flex w-full items-center justify-between gap-4 md:flex-col md:items-start">
                  <h2 className="flex items-center text-xl font-bold">
                    <UsersIcon className="mr-2 size-6" />
                    Jugadores
                  </h2>
                  <h3 className="text-4xl font-bold">
                    {players} / {totalPlayers}
                  </h3>
                </div>
                <div className="flex w-full items-center justify-between gap-4 md:flex-col md:items-start">
                  <h2 className="flex items-center text-xl font-bold">
                    <DatabaseIcon className="mr-2 size-6" />
                    Total de fichas
                  </h2>
                  <h3 className="text-4xl font-bold">
                    {(entries * parseInt(game.points)).toLocaleString("es-ES")}
                  </h3>
                </div>
                <div className="flex w-full items-center justify-between gap-4 md:flex-col md:items-start">
                  <h2 className="flex items-center text-xl font-bold">
                    <DatabaseIcon className="mr-2 size-6" />
                    Promedio
                  </h2>
                  <h3 className="text-4xl font-bold">
                    {players > 0
                      ? Math.round(
                          (entries * parseInt(game.points)) / players
                        ).toLocaleString("es-ES")
                      : 0}
                  </h3>
                </div>
              </div>
              <div className="order-1 mb-8 md:order-2 md:w-4/6">
                {!playing && timer > 0 && (
                  <div className="mb-4 flex items-center justify-center text-center">
                    <p className="bg-red-400 p-4 text-2xl uppercase text-white">
                      Juego en pausa
                    </p>
                  </div>
                )}
                <div className="mb-4 flex items-center justify-center md:mb-10">
                  <Button
                    className="flex items-center justify-center"
                    size="lg"
                    onClick={togglePlaying}
                  >
                    {playing ? (
                      <>
                        <PauseIcon className="mr-2 size-4" /> Pausar
                      </>
                    ) : (
                      <>
                        <PlayIcon className="mr-2 size-4" /> Reanudar
                      </>
                    )}
                  </Button>
                </div>
                {showCurrentLevel()}
                {timer > 0 && (
                  <div className="my-2 flex justify-center md:my-5">
                    <div className="w-full p-4 text-center text-8xl font-bold md:text-9xl">
                      {showClock()}
                    </div>
                  </div>
                )}
                {showNextLevel()}
              </div>
              <div className="order-3 md:order-3 md:w-1/6">
                {currentStructurePrizes?.prizes?.length > 0 && (
                  <div className="flex flex-col space-y-8">
                    <div>
                      <div className="flex justify-between">
                        <span className="font-bold">Bote total</span>
                        <span className="font-bold">
                          {totalPot.toLocaleString("es-ES", {
                            currency: "EUR",
                            style: "currency",
                            minimumFractionDigits: 0,
                          })}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-bold">Comisión</span>
                        <span className="font-bold">
                          {fee.toLocaleString("es-ES", {
                            currency: "EUR",
                            style: "currency",
                            minimumFractionDigits: 0,
                          })}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-bold">Bote Addons</span>
                        <span className="font-bold">
                          {addonPot.toLocaleString("es-ES", {
                            currency: "EUR",
                            style: "currency",
                            minimumFractionDigits: 0,
                          })}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-bold">Bote real</span>
                        <span className="font-bold">
                          {realPot.toLocaleString("es-ES", {
                            currency: "EUR",
                            style: "currency",
                            minimumFractionDigits: 0,
                          })}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col space-y-2">
                      {calculatedPrizes}
                      {game.bubble && (
                        <div className="flex justify-between">
                          <small>Burbuja</small>
                          <strong>
                            {Math.round(game.bubble).toLocaleString("es-ES", {
                              currency: "EUR",
                              style: "currency",
                              minimumFractionDigits: 0,
                            })}
                          </strong>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="order-4 my-10 grid w-full grid-cols-2 gap-4 md:order-4 md:grid-cols-4">
              <div className="mb-8 flex w-full flex-col justify-center text-center">
                <h3 className="mb-2 text-xl font-bold">Jugadores</h3>
                <div className="flex items-center justify-center space-x-4">
                  <Button size="icon" onClick={() => removePlayer()}>
                    <MinusIcon className="size-4" />
                  </Button>
                  <span className="text-xl font-bold">{players}</span>
                  <Button size="icon" onClick={() => addPlayer()}>
                    <PlusIcon className="size-4" />
                  </Button>
                </div>
              </div>

              <div className="mb-8 flex w-full flex-col justify-center text-center">
                <h3 className="mb-2 text-xl font-bold">Entradas</h3>
                <div className="flex items-center justify-center space-x-4">
                  <Button size="icon" onClick={() => removeEntry()}>
                    <MinusIcon className="size-4" />
                  </Button>
                  <span className="text-xl font-bold">{entries}</span>
                  <Button size="icon" onClick={() => addEntry()}>
                    <PlusIcon className="size-4" />
                  </Button>
                </div>
              </div>

              <div className="mb-8 flex w-full flex-col justify-center text-center">
                <h3 className="mb-2 text-xl font-bold">Addons</h3>
                <div className="flex items-center justify-center space-x-4">
                  <Button size="icon" onClick={() => removeAddon()}>
                    <MinusIcon className="size-4" />
                  </Button>
                  <span className="text-xl font-bold">{addons}</span>
                  <Button size="icon" onClick={() => addAddon()}>
                    <PlusIcon className="size-4" />
                  </Button>
                </div>
              </div>

              <div className="mb-8 flex w-full flex-col justify-center text-center">
                <h3 className="mb-2 text-xl font-bold">Doble Addons</h3>
                <div className="flex items-center justify-center space-x-4">
                  <Button size="icon" onClick={() => removeDoubleAddon()}>
                    <MinusIcon className="size-4" />
                  </Button>
                  <span className="text-xl font-bold">{doubleaddons}</span>
                  <Button size="icon" onClick={() => addDoubleAddon()}>
                    <PlusIcon className="size-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
        <audio ref={audioPlayer} src={Notification} />
      </div>
    </LoadingOverlay>
  );
}
