"use client";
import {
  DownloadIcon,
  PencilIcon,
  PlayIcon,
  PlusIcon,
  SettingsIcon,
  TrashIcon,
  UploadIcon,
  WalletIcon,
  Clock,
  Users,
  Trophy,
  TrendingUp,
  Calendar,
  Coins,
  Gift,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { type GameTemplate } from "@/types";
import Link from "next/link";
import {
  DeleteConfirmationDialog,
  ImportConfirmationDialog,
} from "@/components/ui/confirmation-dialog";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { ButtonLoading, SpinnerWithText } from "@/components/ui/loading";
import {
  DataRecovery,
  SafeStorage,
  useErrorHandler,
} from "@/lib/error-handling";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { ExportDialog, QuickExportButton } from "@/components/ui/export-dialog";

export default function GameTemplatesTable({ title }: { title?: string }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [gametemplates, setGametemplates] = useState<GameTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { handleError } = useErrorHandler();

  // Cargar plantillas al montar el componente
  useEffect(() => {
    const loadGameTemplates = async () => {
      if (typeof window === "undefined") {
        setIsLoading(false);
        return;
      }

      try {
        const rawData = SafeStorage.getItem("gameTemplates", []);
        const validationResult = DataRecovery.validateGameTemplates(rawData);

        if (validationResult.isValid && validationResult.data) {
          setGametemplates(validationResult.data);

          // Mostrar advertencias si hubo recuperación de datos
          if (
            validationResult.recovered &&
            validationResult.warnings.length > 0
          ) {
            toast({
              title: "Datos recuperados",
              description: `Se recuperaron ${validationResult.data.length} plantillas. Algunas tenían datos incompletos que fueron corregidos.`,
              variant: "default",
            });
          }
        } else {
          // Error crítico - no se pudieron cargar las plantillas
          handleError(
            `Failed to load game templates: ${validationResult.errors.join(", ")}`,
            {
              errors: validationResult.errors,
              warnings: validationResult.warnings,
            },
            "high"
          );

          toast({
            title: "Error cargando plantillas",
            description:
              "No se pudieron cargar las plantillas. Se creará una nueva lista.",
            variant: "destructive",
          });

          setGametemplates([]);
        }
      } catch (error) {
        handleError(
          error as Error,
          { context: "Loading game templates" },
          "high"
        );

        toast({
          title: "Error crítico",
          description: "Error inesperado cargando plantillas.",
          variant: "destructive",
        });

        setGametemplates([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadGameTemplates();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Intencionalmente vacío - solo ejecutar una vez

  // Funciones auxiliares para calcular estadísticas
  const calculateTournamentDuration = (levels: GameTemplate["levels"]) => {
    if (!levels || levels.length === 0) return 0;
    return levels.reduce((total, level) => total + (level.time || 0), 0);
  };

  const getBlindProgression = (levels: GameTemplate["levels"]) => {
    if (!levels || levels.length < 2) return 0;
    const firstBB = levels[0]?.bb || 0;
    const lastBB = levels[levels.length - 1]?.bb || 0;
    if (firstBB === 0) return 0;
    return Math.round(((lastBB - firstBB) / firstBB) * 100);
  };

  const getTotalPrizePositions = (
    prizeStructures: GameTemplate["prize_structures"]
  ) => {
    if (!prizeStructures || prizeStructures.length === 0) return 0;
    return Math.max(
      ...prizeStructures.map((structure) => structure.prizes?.length || 0)
    );
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  async function removeTemplate(id: number) {
    setIsDeleting(true);
    try {
      const newGameTemplates = gametemplates.filter(
        (gametemplate) => gametemplate.id !== id
      );

      const success = SafeStorage.setItem("gameTemplates", newGameTemplates);

      if (success) {
        // Actualizar el estado local
        setGametemplates(newGameTemplates);

        toast({
          title: "Plantilla eliminada",
          description: "La plantilla se ha eliminado correctamente.",
        });
      } else {
        throw new Error("Failed to save to localStorage");
      }
    } catch (error) {
      handleError(
        error as Error,
        { templateId: id, context: "Deleting template" },
        "medium"
      );

      toast({
        title: "Error",
        description: "No se pudo eliminar la plantilla.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  }

  async function handleImportGames() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";

    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      setIsImporting(true);
      try {
        const text = await file.text();
        const rawData = JSON.parse(text);

        // Validar y recuperar datos usando el sistema de manejo de errores
        const validationResult = DataRecovery.validateGameTemplates(rawData);

        if (validationResult.isValid && validationResult.data) {
          const success = SafeStorage.setItem(
            "gameTemplates",
            validationResult.data
          );

          if (success) {
            // Actualizar el estado local
            setGametemplates(validationResult.data);

            toast({
              title: "Plantillas importadas",
              description: `Se han importado ${validationResult.data.length} plantillas correctamente.${
                validationResult.recovered
                  ? " Algunas plantillas fueron reparadas automáticamente."
                  : ""
              }`,
            });
          } else {
            throw new Error("Failed to save imported templates");
          }
        } else {
          throw new Error(
            `Validation failed: ${validationResult.errors.join(", ")}`
          );
        }
      } catch (error) {
        handleError(
          error as Error,
          { context: "Importing templates", fileName: file.name },
          "medium"
        );

        toast({
          title: "Error al importar",
          description: "El archivo no es válido o está corrupto.",
          variant: "destructive",
        });
      } finally {
        setIsImporting(false);
      }
    };

    input.click();
  }

  // Mostrar loading mientras se cargan los datos
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <SpinnerWithText text="Cargando plantillas..." />
      </div>
    );
  }

  return (
    <ErrorBoundary>
      {/* Estadísticas y acciones */}
      <div className="mb-6 flex flex-col gap-4">
        {gametemplates.length > 0 && (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded-lg border bg-gradient-to-r from-blue-50 to-blue-100 p-4 dark:from-blue-950 dark:to-blue-900">
              <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
                <Calendar className="size-5" />
                <span className="font-medium">Total Plantillas</span>
              </div>
              <p className="mt-1 text-2xl font-bold text-blue-900 dark:text-blue-100">
                {gametemplates.length}
              </p>
            </div>

            <div className="rounded-lg border bg-gradient-to-r from-green-50 to-green-100 p-4 dark:from-green-950 dark:to-green-900">
              <div className="flex items-center gap-2 text-green-700 dark:text-green-300">
                <WalletIcon className="size-5" />
                <span className="font-medium">Buy-in Promedio</span>
              </div>
              <p className="mt-1 text-2xl font-bold text-green-900 dark:text-green-100">
                {(
                  gametemplates.reduce((sum, t) => sum + (t.entry || 0), 0) /
                  gametemplates.length
                ).toLocaleString("es-ES", {
                  style: "currency",
                  currency: "EUR",
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                })}
              </p>
            </div>

            <div className="rounded-lg border bg-gradient-to-r from-purple-50 to-purple-100 p-4 dark:from-purple-950 dark:to-purple-900">
              <div className="flex items-center gap-2 text-purple-700 dark:text-purple-300">
                <Clock className="size-5" />
                <span className="font-medium">Duración Promedio</span>
              </div>
              <p className="mt-1 text-2xl font-bold text-purple-900 dark:text-purple-100">
                {formatDuration(
                  Math.round(
                    gametemplates.reduce(
                      (sum, t) => sum + calculateTournamentDuration(t.levels),
                      0
                    ) / gametemplates.length
                  )
                )}
              </p>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-muted-foreground">
            <span className="text-sm">
              {gametemplates.length === 0
                ? "No hay plantillas"
                : `${gametemplates.length} plantilla${gametemplates.length !== 1 ? "s" : ""}`}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <ExportDialog templates={gametemplates}>
              <Button variant="outline" size="sm">
                <DownloadIcon className="mr-2 size-4" />
                Exportar
              </Button>
            </ExportDialog>
            <ImportConfirmationDialog
              onConfirm={handleImportGames}
              isLoading={isImporting}
            >
              <Button variant="outline" size="sm" disabled={isImporting}>
                <ButtonLoading
                  isLoading={isImporting}
                  loadingText="Importando..."
                >
                  <UploadIcon className="mr-2 size-4" />
                  Importar
                </ButtonLoading>
              </Button>
            </ImportConfirmationDialog>
          </div>
        </div>
      </div>
      <Card>
        {title && (
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>{title}</CardTitle>
          </CardHeader>
        )}

        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[300px]">
                  <div className="flex items-center gap-2">
                    <Calendar className="size-4" />
                    Torneo
                  </div>
                </TableHead>
                <TableHead className="text-center">
                  <div className="flex items-center justify-center gap-2">
                    <WalletIcon className="size-4" />
                    Buy-in
                  </div>
                </TableHead>
                <TableHead className="hidden text-center sm:table-cell">
                  <div className="flex items-center justify-center gap-2">
                    <Clock className="size-4" />
                    Duración
                  </div>
                </TableHead>
                <TableHead className="hidden text-center md:table-cell">
                  <div className="flex items-center justify-center gap-2">
                    <TrendingUp className="size-4" />
                    Niveles
                  </div>
                </TableHead>
                <TableHead className="hidden text-center lg:table-cell">
                  <div className="flex items-center justify-center gap-2">
                    <Trophy className="size-4" />
                    Premios
                  </div>
                </TableHead>
                <TableHead className="pr-4 text-right">
                  <SettingsIcon className="ml-auto size-4" />
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {gametemplates.length > 0 ? (
                gametemplates.map((gametemplate) => {
                  const duration = calculateTournamentDuration(
                    gametemplate.levels
                  );
                  const progression = getBlindProgression(gametemplate.levels);
                  const prizePositions = getTotalPrizePositions(
                    gametemplate.prize_structures
                  );

                  return (
                    <TableRow
                      key={gametemplate.id}
                      className="group hover:bg-muted/50"
                    >
                      <TableCell className="py-4">
                        <div className="space-y-1">
                          <Link
                            href={`/gametemplates/${gametemplate.id}`}
                            className="font-medium text-foreground transition-colors hover:text-primary"
                          >
                            {gametemplate.name}
                          </Link>
                          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Coins className="size-3" />
                              {Number(
                                gametemplate.points || 0
                              ).toLocaleString()}{" "}
                              pts
                            </div>
                            {gametemplate.punctuality_bonus &&
                              gametemplate.punctuality_bonus > 0 && (
                                <div className="flex items-center gap-1 text-blue-600">
                                  <Gift className="size-3" />+
                                  {Number(
                                    gametemplate.punctuality_bonus
                                  ).toLocaleString()}
                                </div>
                              )}
                            {gametemplate.fee && gametemplate.fee > 0 && (
                              <span className="rounded bg-muted px-2 py-0.5 text-xs">
                                {gametemplate.fee}% comisión
                              </span>
                            )}
                            {/* Información adicional en móvil */}
                            <div className="text-xs sm:hidden">
                              {formatDuration(duration)} •{" "}
                              {gametemplate.levels?.length || 0} niveles
                            </div>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell className="text-center">
                        <div className="font-medium">
                          €{gametemplate.entry.toLocaleString("es-ES")}
                        </div>
                        {gametemplate.extrapot && gametemplate.extrapot > 0 && (
                          <div className="text-xs text-green-600">
                            +€{gametemplate.extrapot.toLocaleString("es-ES")}{" "}
                            extra
                          </div>
                        )}
                      </TableCell>

                      <TableCell className="hidden text-center sm:table-cell">
                        <div className="font-medium">
                          {formatDuration(duration)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {gametemplate.levels?.length || 0} niveles
                        </div>
                      </TableCell>

                      <TableCell className="hidden text-center md:table-cell">
                        <div className="space-y-1">
                          <div className="text-sm">
                            {gametemplate.levels?.[0]?.sb || 0}/
                            {gametemplate.levels?.[0]?.bb || 0}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            →{" "}
                            {gametemplate.levels?.[
                              gametemplate.levels.length - 1
                            ]?.sb || 0}
                            /
                            {gametemplate.levels?.[
                              gametemplate.levels.length - 1
                            ]?.bb || 0}
                          </div>
                          {progression > 0 && (
                            <div className="text-xs text-green-600">
                              +{progression}%
                            </div>
                          )}
                        </div>
                      </TableCell>

                      <TableCell className="hidden text-center lg:table-cell">
                        <div className="flex items-center justify-center gap-1">
                          <Users className="size-3" />
                          <span className="font-medium">{prizePositions}</span>
                        </div>
                        {gametemplate.bubble && gametemplate.bubble > 0 && (
                          <div className="text-xs text-orange-600">
                            Burbuja: €
                            {gametemplate.bubble.toLocaleString("es-ES")}
                          </div>
                        )}
                      </TableCell>

                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0"
                          >
                            <Link href={`/play?template=${gametemplate.id}`}>
                              <PlayIcon className="size-4 text-green-600" />
                            </Link>
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0"
                          >
                            <Link href={`/gametemplates/${gametemplate.id}`}>
                              <PencilIcon className="size-4 text-blue-600" />
                            </Link>
                          </Button>
                          <DeleteConfirmationDialog
                            itemName={gametemplate.name}
                            onConfirm={() => removeTemplate(gametemplate.id)}
                            isLoading={isDeleting}
                          >
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 w-8 p-0"
                              disabled={isDeleting}
                            >
                              <TrashIcon className="size-4 text-red-600" />
                            </Button>
                          </DeleteConfirmationDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-32">
                    <div className="flex flex-col items-center justify-center gap-4 text-muted-foreground">
                      <Calendar className="size-12 opacity-50" />
                      <div className="text-center">
                        <p className="font-medium">
                          No hay plantillas de torneos
                        </p>
                        <p className="text-sm">
                          Crea tu primera plantilla para empezar
                        </p>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      {gametemplates.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-6 py-12">
          <div className="space-y-2 text-center">
            <h3 className="text-lg font-semibold">
              ¡Comienza creando tu primera plantilla!
            </h3>
            <p className="max-w-md text-muted-foreground">
              Las plantillas te permiten configurar torneos con estructuras de
              ciegas, premios y reglas personalizadas que podrás reutilizar.
            </p>
          </div>
          <Button size="lg" className="gap-2">
            <Link
              href="/gametemplates/create"
              className="flex items-center gap-2"
            >
              <PlusIcon className="size-5" />
              Crear mi primera plantilla
            </Link>
          </Button>
        </div>
      ) : (
        <div className="flex items-center justify-between border-t pt-6">
          <div className="flex items-center gap-4">
            <div className="text-sm text-muted-foreground">
              Tip: Haz clic en el nombre de una plantilla para editarla
            </div>
            <QuickExportButton
              templates={gametemplates}
              type="templates"
              format="json"
            >
              <DownloadIcon className="mr-2 size-3" />
              Backup rápido
            </QuickExportButton>
          </div>
          <Button className="gap-2">
            <Link
              href="/gametemplates/create"
              className="flex items-center gap-2"
            >
              <PlusIcon className="size-4" />
              Nueva plantilla
            </Link>
          </Button>
        </div>
      )}
    </ErrorBoundary>
  );
}
