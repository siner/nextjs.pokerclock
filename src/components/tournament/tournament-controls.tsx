import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  UsersIcon,
  DollarSignIcon,
  CoinsIcon,
  TrophyIcon,
  MinusIcon,
  PlusIcon,
} from "lucide-react";

interface TournamentControlsProps {
  players: number;
  entries: number;
  addons: number;
  doubleAddons: number;
  addonsEnabled: {
    simple: boolean;
    double: boolean;
  };
  entriesStatus: {
    closed: boolean;
    message: string;
  };
  onAddPlayer: () => void;
  onRemovePlayer: () => void;
  onAddEntry: () => void;
  onRemoveEntry: () => void;
  onAddAddon: () => void;
  onRemoveAddon: () => void;
  onAddDoubleAddon: () => void;
  onRemoveDoubleAddon: () => void;
}

export function TournamentControls({
  players,
  entries,
  addons,
  doubleAddons,
  addonsEnabled,
  entriesStatus,
  onAddPlayer,
  onRemovePlayer,
  onAddEntry,
  onRemoveEntry,
  onAddAddon,
  onRemoveAddon,
  onAddDoubleAddon,
  onRemoveDoubleAddon,
}: TournamentControlsProps) {
  return (
    <div className="mt-6 flex w-full flex-col gap-3 sm:flex-row sm:gap-4 md:mt-8">
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
                onClick={onRemovePlayer}
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
                onClick={onAddPlayer}
                disabled={entriesStatus.closed}
                title={
                  entriesStatus.closed ? "Entradas cerradas" : "Añadir jugador"
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
                onClick={onRemoveEntry}
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
                onClick={onAddEntry}
                disabled={entriesStatus.closed}
                title={
                  entriesStatus.closed ? "Entradas cerradas" : "Añadir entrada"
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
                  onClick={onRemoveAddon}
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
                  onClick={onAddAddon}
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
                  onClick={onRemoveDoubleAddon}
                >
                  <MinusIcon className="size-3 sm:size-4" />
                </Button>
                <span className="min-w-[2.5rem] text-xl font-bold text-orange-900 dark:text-orange-100 sm:min-w-[3rem] sm:text-2xl">
                  {doubleAddons}
                </span>
                <Button
                  size="icon"
                  variant="outline"
                  className="size-8 border-orange-300 text-orange-600 hover:bg-orange-100 dark:border-orange-700 dark:text-orange-400 dark:hover:bg-orange-900 sm:size-10"
                  onClick={onAddDoubleAddon}
                >
                  <PlusIcon className="size-3 sm:size-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
