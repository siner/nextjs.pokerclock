import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ClockIcon, PlayIcon, PauseIcon } from "lucide-react";

interface TournamentTimerProps {
  clockDisplay: string;
  timer: number;
  playing: boolean;
  onTogglePlaying: () => void;
}

export function TournamentTimer({
  clockDisplay,
  timer,
  playing,
  onTogglePlaying,
}: TournamentTimerProps) {
  return (
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
              onClick={onTogglePlaying}
              title={playing ? "Click para pausar" : "Click para reanudar"}
            >
              <div className="text-4xl font-bold text-indigo-900 dark:text-indigo-100 sm:text-5xl md:text-6xl lg:text-8xl">
                {clockDisplay}
              </div>
              <div className="mt-2 flex items-center justify-center gap-2 text-xs text-indigo-600 dark:text-indigo-400 md:text-sm">
                {playing ? (
                  <>
                    <PauseIcon className="size-3 md:size-4" />
                    <span className="hidden sm:inline">Click para pausar</span>
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
                onClick={onTogglePlaying}
                variant="default"
              >
                <PlayIcon className="mr-2 size-4 sm:size-5" />
                <span className="hidden sm:inline">Iniciar Torneo</span>
                <span className="sm:hidden">Iniciar</span>
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
