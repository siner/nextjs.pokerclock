"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useUnsavedChanges } from "@/hooks/use-unsaved-changes";
import { ExitConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { ValidationSummary } from "@/components/ui/validation-message";
import { LoadingOverlay, ButtonLoading } from "@/components/ui/loading";
import {
  validateGameTemplate,
  getFieldMessage,
  type FormGameTemplate,
  type ValidationResult,
} from "@/lib/validations";

import { useEffect, useState } from "react";
import { type GameTemplate, type Level, type PrizeStructure } from "@/types";

import { FormSection, FormGrid } from "@/components/ui/form-section";
import {
  EnhancedInput,
  MoneyInput,
  PercentageInput,
} from "@/components/ui/enhanced-input";
import { LevelManager } from "@/components/ui/level-manager";
import { PrizeStructureManager } from "@/components/ui/prize-structure-manager";
import {
  Settings,
  DollarSign,
  Users,
  Save,
  Loader2,
  FileText,
  Calculator,
  Clock,
} from "lucide-react";
import { trackEvent } from "@/lib/analytics";

export default function GameTemplateForm({
  gametemplate,
}: {
  gametemplate?: GameTemplate;
}) {
  const [newGameTemplate, setnewGameTemplate] = useState<GameTemplate>(
    gametemplate ? (gametemplate as GameTemplate) : ({} as GameTemplate)
  );

  function manageInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setnewGameTemplate({ ...newGameTemplate, [name]: value });
  }

  // Funciones de conversión para manejar tipos
  const convertLevelsToNumbers = (
    levels: Array<{
      sb: string | number;
      bb: string | number;
      ante: string | number;
      time: string | number;
    }>
  ): Level[] => {
    return levels.map((level) => ({
      sb: Number(level.sb) || 0,
      bb: Number(level.bb) || 0,
      ante: Number(level.ante) || 0,
      time: Number(level.time) || 0,
    }));
  };

  const convertPrizeStructuresToNumbers = (
    structures: Array<{
      max_players: string | number;
      prizes: Array<{ id?: number; percentaje: string | number }>;
    }>
  ): PrizeStructure[] => {
    return structures.map((structure) => ({
      max_players: Number(structure.max_players) || 0,
      prizes: structure.prizes.map((prize) => ({
        id: prize.id || 0,
        percentaje: Number(prize.percentaje) || 0,
      })),
    }));
  };

  const { toast } = useToast();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [levels, setLevels] = useState<Level[]>(newGameTemplate.levels ?? []);
  const [prizeStructures, setPrizeStructures] = useState<PrizeStructure[]>(
    newGameTemplate.prize_structures ?? []
  );

  const [validationResult, setValidationResult] = useState<ValidationResult>({
    isValid: true,
    errors: [],
    warnings: [],
  });

  // Detectar cambios sin guardar
  const [hasChanges, setHasChanges] = useState(false);
  const [originalData, setOriginalData] = useState<string>("");
  const [hasTrackedStart, setHasTrackedStart] = useState(false);

  const { showExitConfirmation, handleNavigation, confirmExit, cancelExit } =
    useUnsavedChanges(hasChanges);

  // Combinar errores y advertencias para mostrar en la UI
  const allMessages = [
    ...validationResult.errors,
    ...validationResult.warnings,
  ];

  // Convertir mensajes a objetos para fácil acceso
  const errorMap = validationResult.errors.reduce(
    (acc, error) => {
      acc[error.field] = error.message;
      return acc;
    },
    {} as Record<string, string>
  );

  const warningMap = validationResult.warnings.reduce(
    (acc, warning) => {
      acc[warning.field] = warning.message;
      return acc;
    },
    {} as Record<string, string>
  );

  // Función para validar en tiempo real
  function validateForm() {
    const formData: FormGameTemplate = {
      ...newGameTemplate,
      levels: levels,
      prize_structures: prizeStructures,
    };

    const result = validateGameTemplate(formData);
    setValidationResult(result);
    return result;
  }

  // Establecer datos originales al cargar
  useEffect(() => {
    const currentData = JSON.stringify({
      template: newGameTemplate,
      levels,
      prizeStructures,
    });

    if (!originalData) {
      setOriginalData(currentData);
    } else {
      const hasDifferences = currentData !== originalData;
      setHasChanges(hasDifferences);

      if (hasDifferences && !hasTrackedStart) {
        trackEvent("template_form_started", {
          mode: gametemplate ? "edit" : "create",
        });
        setHasTrackedStart(true);
      }
    }
  }, [
    newGameTemplate,
    levels,
    prizeStructures,
    originalData,
    hasTrackedStart,
    gametemplate,
  ]);

  // Validar cuando cambian los datos
  useEffect(() => {
    if (
      newGameTemplate.name ||
      newGameTemplate.entry ||
      newGameTemplate.points
    ) {
      validateForm();
    }
  }, [newGameTemplate, levels, prizeStructures]);

  useEffect(() => {
    setnewGameTemplate({
      ...newGameTemplate,
      prize_structures: prizeStructures,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prizeStructures]);

  useEffect(() => {
    setnewGameTemplate({ ...newGameTemplate, levels: levels });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [levels]);

  async function updateGameTemplate() {
    const validation = validateForm();

    if (!validation.isValid) {
      toast({
        description: `Se encontraron ${validation.errors.length} errores de validación. Por favor, corrígelos antes de continuar.`,
        variant: "destructive",
      });
      trackEvent("template_validation_failed", {
        errors: validation.errors.length,
        warnings: validation.warnings.length,
        mode: gametemplate ? "edit" : "create",
      });
      return;
    }

    if (validation.warnings.length > 0) {
      toast({
        description: `Se encontraron ${validation.warnings.length} advertencias. Revisa la configuración antes de continuar.`,
        variant: "default",
      });
    }

    setLoading(true);

    try {
      // Simular un pequeño delay para mostrar el loading
      await new Promise((resolve) => setTimeout(resolve, 500));

      if (gametemplate) {
        // Update game in local storage
        const existingTemplates = JSON.parse(
          localStorage.getItem("gameTemplates") || "[]"
        );
        const updatedTemplates = existingTemplates.map(
          (template: GameTemplate) =>
            template.id === gametemplate.id ? newGameTemplate : template
        );
        localStorage.setItem("gameTemplates", JSON.stringify(updatedTemplates));
        toast({
          title: "¡Plantilla actualizada!",
          description: "Los cambios se han guardado correctamente.",
        });
      } else {
        newGameTemplate.id = Math.floor(Math.random() * 1000000000);
        localStorage.setItem(
          "gameTemplates",
          JSON.stringify([
            ...JSON.parse(localStorage.getItem("gameTemplates") || "[]"),
            newGameTemplate,
          ])
        );
        toast({
          title: "¡Plantilla creada!",
          description: "La nueva plantilla se ha guardado correctamente.",
        });
      }

      trackEvent("template_save_success", {
        mode: gametemplate ? "edit" : "create",
        id: gametemplate ? gametemplate.id : newGameTemplate.id,
        levels: levels.length,
        buyIn: Number(newGameTemplate.entry) || 0,
        warnings: validation.warnings.length,
      });

      // Resetear estado de cambios después de guardar
      setHasChanges(false);
      setOriginalData(
        JSON.stringify({
          template: newGameTemplate,
          levels,
          prizeStructures,
        })
      );

      // Pequeño delay antes de navegar para mostrar el toast
      setTimeout(() => {
        router.push("/gametemplates");
      }, 1000);
    } catch (error) {
      console.error("Error al guardar la plantilla:", error);
      trackEvent("template_save_error", {
        mode: gametemplate ? "edit" : "create",
        message: error instanceof Error ? error.message : "unknown",
      });
      toast({
        title: "Error al guardar",
        description: "No se pudo guardar la plantilla. Inténtalo de nuevo.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <LoadingOverlay
      isLoading={loading}
      text={gametemplate ? "Actualizando plantilla..." : "Creando plantilla..."}
    >
      <div className="mx-auto max-w-6xl space-y-8">
        {/* Resumen de validación */}
        {allMessages.length > 0 && (
          <ValidationSummary errors={allMessages} className="mb-6" />
        )}

        {/* Información Básica */}
        <FormSection
          title="Información Básica"
          description="Configuración general del torneo"
          icon={<FileText className="h-5 w-5" />}
        >
          <FormGrid columns={3}>
            <EnhancedInput
              label="Nombre del Torneo"
              required
              placeholder="Ej: Torneo Semanal"
              value={newGameTemplate.name || ""}
              onValueChange={(value) =>
                setnewGameTemplate({ ...newGameTemplate, name: value })
              }
              error={errorMap["name"]}
              warning={warningMap["name"]}
              tooltip="Nombre descriptivo para identificar tu torneo"
            />

            <MoneyInput
              label="Entrada (Buy-in)"
              required
              placeholder="20.00"
              value={String(newGameTemplate.entry || "")}
              onValueChange={(value) =>
                setnewGameTemplate({
                  ...newGameTemplate,
                  entry: Number(value) || 0,
                })
              }
              error={errorMap["entry"]}
              warning={warningMap["entry"]}
              tooltip="Coste de entrada al torneo en euros"
            />

            <MoneyInput
              label="Bounty"
              placeholder="0.00"
              value={String(newGameTemplate.bounty || "")}
              onValueChange={(value) =>
                setnewGameTemplate({
                  ...newGameTemplate,
                  bounty: Number(value) || 0,
                })
              }
              error={errorMap["bounty"]}
              warning={warningMap["bounty"]}
              tooltip="Premio por eliminar a un jugador (torneos bounty)"
            />
          </FormGrid>

          <FormGrid columns={4}>
            <PercentageInput
              label="Comisión"
              placeholder="10"
              value={String(newGameTemplate.fee || "")}
              onValueChange={(value) =>
                setnewGameTemplate({
                  ...newGameTemplate,
                  fee: Number(value) || 0,
                })
              }
              error={errorMap["fee"]}
              warning={warningMap["fee"]}
              tooltip="Porcentaje de comisión de la casa"
            />

            <EnhancedInput
              label="Puntos Iniciales"
              required
              type="number"
              placeholder="10000"
              value={String(newGameTemplate.points || "")}
              onValueChange={(value) =>
                setnewGameTemplate({
                  ...newGameTemplate,
                  points: value,
                })
              }
              error={errorMap["points"]}
              warning={warningMap["points"]}
              tooltip="Fichas que recibe cada jugador al inicio"
            />

            <MoneyInput
              label="Bote Extra"
              placeholder="0.00"
              value={String(newGameTemplate.extrapot || "")}
              onValueChange={(value) =>
                setnewGameTemplate({
                  ...newGameTemplate,
                  extrapot: Number(value) || 0,
                })
              }
              error={errorMap["extrapot"]}
              warning={warningMap["extrapot"]}
              tooltip="Dinero adicional añadido al bote de premios (ej: patrocinio)"
            />

            <MoneyInput
              label="Premio Burbuja"
              placeholder="0.00"
              value={String(newGameTemplate.bubble || "")}
              onValueChange={(value) =>
                setnewGameTemplate({
                  ...newGameTemplate,
                  bubble: Number(value) || 0,
                })
              }
              error={errorMap["bubble"]}
              warning={warningMap["bubble"]}
              tooltip="Premio para el último jugador eliminado antes de premios"
            />
          </FormGrid>

          {/* Bono de Puntualidad */}
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
            <div className="mb-3 flex items-center gap-2">
              <div className="rounded-full bg-blue-100 p-2 dark:bg-blue-900">
                <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h4 className="font-medium text-blue-900 dark:text-blue-100">
                  Bono de Puntualidad
                </h4>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Puntos extra para jugadores que lleguen durante el primer
                  nivel
                </p>
              </div>
            </div>

            <FormGrid columns={2}>
              <EnhancedInput
                label="Puntos de Bono"
                type="number"
                placeholder="2500"
                value={String(newGameTemplate.punctuality_bonus || "")}
                onValueChange={(value) =>
                  setnewGameTemplate({
                    ...newGameTemplate,
                    punctuality_bonus: Number(value) || 0,
                  })
                }
                error={errorMap["punctuality_bonus"]}
                warning={warningMap["punctuality_bonus"]}
                tooltip="Puntos adicionales que reciben los jugadores puntuales"
              />

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Resumen del Stack Inicial
                </label>
                <div className="rounded-md bg-muted/50 p-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Puntos base:</span>
                    <span className="font-medium">
                      {Number(newGameTemplate.points || 0).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Bono puntualidad:
                    </span>
                    <span className="font-medium text-blue-600 dark:text-blue-400">
                      +
                      {Number(
                        newGameTemplate.punctuality_bonus || 0
                      ).toLocaleString()}
                    </span>
                  </div>
                  <div className="mt-2 flex justify-between border-t pt-2">
                    <span className="font-medium">Total con bono:</span>
                    <span className="font-bold text-green-600 dark:text-green-400">
                      {(
                        Number(newGameTemplate.points || 0) +
                        Number(newGameTemplate.punctuality_bonus || 0)
                      ).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </FormGrid>
          </div>

          {/* Configuración de Entradas */}
          <div className="rounded-lg border border-orange-200 bg-orange-50 p-4 dark:border-orange-800 dark:bg-orange-900/20">
            <div className="mb-3 flex items-center gap-2">
              <div className="rounded-full bg-orange-100 p-2 dark:bg-orange-900">
                <Users className="h-4 w-4 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <h4 className="font-medium text-orange-900 dark:text-orange-100">
                  Control de Entradas
                </h4>
                <p className="text-sm text-orange-700 dark:text-orange-300">
                  Define hasta qué nivel se permiten nuevas entradas al torneo
                </p>
              </div>
            </div>

            <FormGrid columns={2}>
              <EnhancedInput
                label="Último Nivel de Entradas"
                type="number"
                placeholder="3"
                min="1"
                max={levels.length}
                value={String(newGameTemplate.last_entry_level || "")}
                onValueChange={(value) =>
                  setnewGameTemplate({
                    ...newGameTemplate,
                    last_entry_level: Number(value) || undefined,
                  })
                }
                error={errorMap["last_entry_level"]}
                warning={warningMap["last_entry_level"]}
                tooltip="Último nivel en el que se permiten nuevas entradas (después de este nivel solo se eliminan jugadores)"
              />

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Estado de Entradas
                </label>
                <div className="rounded-md bg-muted/50 p-3 text-sm">
                  {newGameTemplate.last_entry_level ? (
                    <>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Entradas hasta:
                        </span>
                        <span className="font-medium text-orange-600 dark:text-orange-400">
                          Nivel {newGameTemplate.last_entry_level}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Después del nivel:
                        </span>
                        <span className="font-medium text-red-600 dark:text-red-400">
                          Solo eliminaciones
                        </span>
                      </div>
                      {levels[newGameTemplate.last_entry_level - 1] && (
                        <div className="mt-2 flex justify-between border-t pt-2">
                          <span className="font-medium">
                            Ciegas del último nivel:
                          </span>
                          <span className="font-bold">
                            {levels[newGameTemplate.last_entry_level - 1].sb}/
                            {levels[newGameTemplate.last_entry_level - 1].bb}
                          </span>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-center text-muted-foreground">
                      Sin límite de entradas configurado
                    </div>
                  )}
                </div>
              </div>
            </FormGrid>
          </div>
        </FormSection>

        {/* Configuración de Add-ons */}
        <FormSection
          title="Add-ons y Recompras"
          description="Configuración opcional de add-ons"
          icon={<Calculator className="h-5 w-5" />}
        >
          <FormGrid columns={2}>
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-muted-foreground">
                Add-on Simple
              </h4>
              <FormGrid columns={2}>
                <MoneyInput
                  label="Precio"
                  placeholder="10.00"
                  value={String(newGameTemplate.addon_price || "")}
                  onValueChange={(value) =>
                    setnewGameTemplate({
                      ...newGameTemplate,
                      addon_price: Number(value) || 0,
                    })
                  }
                  tooltip="Coste del add-on simple"
                />
                <EnhancedInput
                  label="Puntos"
                  type="number"
                  placeholder="5000"
                  value={String(newGameTemplate.addon_points || "")}
                  onValueChange={(value) =>
                    setnewGameTemplate({
                      ...newGameTemplate,
                      addon_points: Number(value) || 0,
                    })
                  }
                  tooltip="Fichas que otorga el add-on simple"
                />
              </FormGrid>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-medium text-muted-foreground">
                Add-on Doble
              </h4>
              <FormGrid columns={2}>
                <MoneyInput
                  label="Precio"
                  placeholder="20.00"
                  value={String(newGameTemplate.double_addon_price || "")}
                  onValueChange={(value) =>
                    setnewGameTemplate({
                      ...newGameTemplate,
                      double_addon_price: Number(value) || 0,
                    })
                  }
                  tooltip="Coste del add-on doble"
                />
                <EnhancedInput
                  label="Puntos"
                  type="number"
                  placeholder="10000"
                  value={String(newGameTemplate.double_addon_points || "")}
                  onValueChange={(value) =>
                    setnewGameTemplate({
                      ...newGameTemplate,
                      double_addon_points: Number(value) || 0,
                    })
                  }
                  tooltip="Fichas que otorga el add-on doble"
                />
              </FormGrid>
            </div>
          </FormGrid>
        </FormSection>

        {/* Gestión de Niveles */}
        <LevelManager
          levels={levels}
          onLevelsChange={(newLevels) =>
            setLevels(convertLevelsToNumbers(newLevels))
          }
          errors={errorMap}
          warnings={warningMap}
        />

        {/* Gestión de Estructuras de Premios */}
        <PrizeStructureManager
          prizeStructures={prizeStructures}
          onPrizeStructuresChange={(newStructures) =>
            setPrizeStructures(convertPrizeStructuresToNumbers(newStructures))
          }
          errors={errorMap}
          warnings={warningMap}
        />

        {/* Botones de Acción */}
        <div className="flex justify-end gap-4 border-t pt-6">
          {hasChanges ? (
            <ExitConfirmationDialog
              onConfirm={() => handleNavigation("/gametemplates")}
              hasUnsavedChanges={hasChanges}
            >
              <Button type="button" variant="outline" disabled={loading}>
                Cancelar
              </Button>
            </ExitConfirmationDialog>
          ) : (
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/gametemplates")}
              disabled={loading}
            >
              Cancelar
            </Button>
          )}

          <Button
            onClick={updateGameTemplate}
            disabled={loading || !validationResult.isValid}
            className="flex items-center gap-2"
          >
            <ButtonLoading isLoading={loading} loadingText="Guardando...">
              <Save className="h-4 w-4" />
              {gametemplate ? "Actualizar" : "Crear"} Plantilla
            </ButtonLoading>
          </Button>
        </div>

        {/* Diálogo de confirmación de salida */}
        {showExitConfirmation && (
          <ExitConfirmationDialog
            onConfirm={() => {
              trackEvent("template_unsaved_exit", {
                mode: gametemplate ? "edit" : "create",
              });
              confirmExit();
            }}
            hasUnsavedChanges={hasChanges}
          >
            <div style={{ display: "none" }} />
          </ExitConfirmationDialog>
        )}
      </div>
    </LoadingOverlay>
  );
}
