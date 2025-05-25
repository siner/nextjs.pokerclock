import { Card, CardContent } from "@/components/ui/card";
import { PauseIcon } from "lucide-react";
import { Game } from "@/types";

interface TournamentStatusProps {
  playing: boolean;
  timer: number;
  game: Game;
  entriesStatus: {
    closed: boolean;
    lastLevel: number | null;
    currentLevel: number;
    message: string;
  };
}

export function TournamentStatus({
  playing,
  timer,
  game,
  entriesStatus,
}: TournamentStatusProps) {
  return (
    <div className="space-y-4">
      {/* Estado del juego - Pausa */}
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
    </div>
  );
}
