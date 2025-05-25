import { Button } from "@/components/ui/button";
import {
  ResetConfirmationDialog,
  ConfirmationDialog,
} from "@/components/ui/confirmation-dialog";
import {
  SquareIcon,
  RotateCcw,
  KeyboardIcon,
  ArrowLeftIcon,
  HomeIcon,
} from "lucide-react";

interface TournamentHeaderProps {
  timer: number;
  players: number;
  onFinishTournament: () => void;
  onResetGame: () => void;
  onShowShortcutsHelp: () => void;
}

export function TournamentHeader({
  timer,
  players,
  onFinishTournament,
  onResetGame,
  onShowShortcutsHelp,
}: TournamentHeaderProps) {
  return (
    <div className="flex w-full flex-col gap-3 md:flex-row md:items-center md:justify-between">
      {/* Navegación */}
      <div className="flex items-center gap-1 sm:gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => (window.location.href = "/gametemplates")}
          className="border-slate-300 text-slate-600 hover:bg-slate-100 dark:border-slate-600 dark:text-slate-400 dark:hover:bg-slate-800"
          title="Volver a plantillas"
        >
          <ArrowLeftIcon className="size-4 sm:mr-2" />
          <span className="hidden sm:inline">Volver</span>
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => (window.location.href = "/")}
          className="border-slate-300 text-slate-600 hover:bg-slate-100 dark:border-slate-600 dark:text-slate-400 dark:hover:bg-slate-800"
          title="Ir al inicio"
        >
          <HomeIcon className="size-4 sm:mr-2" />
          <span className="hidden sm:inline">Inicio</span>
        </Button>
      </div>

      {/* Controles de torneo */}
      <div className="flex w-full items-center justify-between gap-2 md:w-auto">
        <div className="flex items-center gap-1 sm:gap-2">
          {timer > 0 && players > 0 && (
            <ConfirmationDialog
              title="Finalizar torneo"
              description="¿Quieres finalizar el torneo y guardarlo en el historial?"
              onConfirm={onFinishTournament}
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

          <ResetConfirmationDialog onConfirm={onResetGame}>
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
          onClick={onShowShortcutsHelp}
          className="border-slate-300 text-slate-600 hover:bg-slate-100 dark:border-slate-600 dark:text-slate-400 dark:hover:bg-slate-800"
          title="Ver atajos de teclado (Presiona ?)"
        >
          <KeyboardIcon className="size-4 sm:mr-2" />
          <span className="hidden sm:inline">Atajos</span>
        </Button>
      </div>
    </div>
  );
}
