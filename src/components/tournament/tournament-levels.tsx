import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrophyIcon, FastForward, ClockIcon } from "lucide-react";
import { Level } from "@/types";

interface TournamentLevelsProps {
  currentLevel: Level | null;
  nextLevel: Level | null;
  levelIndex: number;
  onJumpToNextLevel: () => void;
}

export function TournamentLevels({
  currentLevel,
  nextLevel,
  levelIndex,
  onJumpToNextLevel,
}: TournamentLevelsProps) {
  return (
    <div className="space-y-4 md:space-y-6">
      {/* Nivel Actual */}
      {currentLevel && (
        <Card className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
          <CardContent className="p-4 md:p-5">
            <div className="text-center">
              <div className="mb-3 flex items-center justify-center gap-2">
                <TrophyIcon className="size-5 text-slate-600 dark:text-slate-400 md:size-6" />
                <span className="text-base font-medium text-slate-700 dark:text-slate-300 md:text-lg">
                  Nivel Actual ({levelIndex + 1})
                </span>
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 sm:text-3xl md:text-4xl lg:text-6xl">
                  {currentLevel.sb} / {currentLevel.bb}
                  {currentLevel.ante > 0 && (
                    <span className="text-orange-600">
                      {" "}
                      / {currentLevel.ante}
                    </span>
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
          </CardContent>
        </Card>
      )}

      {/* Siguiente Nivel */}
      {nextLevel && currentLevel && (
        <Card className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950 dark:to-orange-950">
          <CardContent className="p-5">
            <div className="text-center">
              <div className="mb-4 flex items-center justify-center gap-2">
                <FastForward className="size-5 text-amber-600 dark:text-amber-400" />
                <span className="text-lg font-medium text-amber-700 dark:text-amber-300">
                  Siguiente Nivel ({levelIndex + 2})
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
                onClick={onJumpToNextLevel}
              >
                <FastForward className="mr-2 size-4" />
                Saltar al siguiente nivel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
