import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSignIcon, TrophyIcon, Target, Gift } from "lucide-react";
import { Game, PrizeStructure } from "@/types";

interface TournamentPrizesProps {
  game: Game;
  totalPot: number;
  fee: number;
  addonPot: number;
  realPot: number;
  entries: number;
  currentPrizeStructure: PrizeStructure;
}

export function TournamentPrizes({
  game,
  totalPot,
  fee,
  addonPot,
  realPot,
  entries,
  currentPrizeStructure,
}: TournamentPrizesProps) {
  // Memoizar el cálculo de premios
  const calculatedPrizes = useMemo(() => {
    if (!currentPrizeStructure.prizes?.length) {
      return [];
    }

    let remainingPot = realPot - (game.bubble || 0);
    const prizes = [];

    for (let i = 0; i < currentPrizeStructure.prizes.length; i++) {
      const newPrize =
        Math.ceil(
          ((realPot - (game.bubble || 0)) *
            currentPrizeStructure.prizes[i].percentaje) /
            100 /
            5
        ) * 5;

      const currentPrize = newPrize <= remainingPot ? newPrize : remainingPot;

      prizes.push({
        id: currentPrizeStructure.prizes[i].id,
        percentaje: currentPrizeStructure.prizes[i].percentaje,
        prize: currentPrize,
      });
      remainingPot -= newPrize;
      if (remainingPot <= 0) {
        break;
      }
    }

    return prizes.map((prize) => (
      <div key={prize.id} className="flex justify-between">
        <small>{prize.id}º</small>
        <strong>
          {prize.prize.toLocaleString("es-ES", {
            currency: "EUR",
            style: "currency",
            minimumFractionDigits: 0,
          })}
        </strong>
      </div>
    ));
  }, [currentPrizeStructure.prizes, realPot, game.bubble]);

  if (!currentPrizeStructure?.prizes?.length) {
    return null;
  }

  return (
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
            <span className="text-sm font-medium">Bote Total</span>
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

          {addonPot > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-blue-600">Addons</span>
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

          {typeof game.extrapot === "number" && game.extrapot > 0 && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <Gift className="size-3 text-green-600" />
                <span className="text-sm text-green-600">Extra</span>
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
          {currentPrizeStructure.max_players && (
            <p className="text-xs text-amber-600 dark:text-amber-400">
              Estructura para máx. {currentPrizeStructure.max_players} jugadores
            </p>
          )}
        </CardHeader>
        <CardContent className="space-y-2">
          {calculatedPrizes}
          {typeof game.bubble === "number" && game.bubble > 0 && (
            <div className="mt-3 border-t pt-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-orange-600">Burbuja</span>
                <span className="font-medium text-orange-600">
                  {Math.round(game.bubble).toLocaleString("es-ES", {
                    currency: "EUR",
                    style: "currency",
                    minimumFractionDigits: 0,
                  })}
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
