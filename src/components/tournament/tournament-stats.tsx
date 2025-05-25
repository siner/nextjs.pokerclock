import { Card, CardContent } from "@/components/ui/card";
import { UsersIcon, CoinsIcon, TrendingUpIcon } from "lucide-react";

interface TournamentStatsProps {
  players: number;
  totalPlayers: number;
  totalChips: number;
  punctualityBonusPlayers: number;
  punctualityBonus?: number;
}

export function TournamentStats({
  players,
  totalPlayers,
  totalChips,
  punctualityBonusPlayers,
  punctualityBonus,
}: TournamentStatsProps) {
  const stackPromedio = players > 0 ? Math.round(totalChips / players) : 0;

  return (
    <div className="grid grid-cols-3 gap-3 md:block md:space-y-6">
      {/* Jugadores */}
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

      {/* Total Fichas */}
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
              {punctualityBonusPlayers > 0 && punctualityBonus && (
                <p className="text-xs text-green-600 dark:text-green-400">
                  +
                  {(punctualityBonusPlayers * punctualityBonus).toLocaleString(
                    "es-ES"
                  )}{" "}
                  <span className="hidden sm:inline">puntos de bono</span>
                  <span className="sm:hidden">bono</span>
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stack Promedio */}
      <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900">
        <CardContent className="p-3 md:p-5">
          <div className="flex flex-col items-center gap-2 md:flex-row md:gap-3">
            <div className="rounded-full bg-purple-100 p-2 dark:bg-purple-900">
              <TrendingUpIcon className="size-4 text-purple-600 dark:text-purple-400 md:size-5" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <p className="text-xs font-medium text-purple-700 dark:text-purple-300 md:text-sm">
                <span className="hidden sm:inline">Stack Promedio</span>
                <span className="sm:hidden">Stack Prom.</span>
              </p>
              <p className="text-lg font-bold text-purple-900 dark:text-purple-100 md:text-2xl">
                {stackPromedio.toLocaleString("es-ES")}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
