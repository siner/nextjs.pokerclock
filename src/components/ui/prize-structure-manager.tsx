import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EnhancedInput, PercentageInput } from "@/components/ui/enhanced-input";
import { cn } from "@/lib/utils";
import {
  Award,
  Calculator,
  Copy,
  Plus,
  Trash2,
  Trophy,
  Users,
} from "lucide-react";
import { useState } from "react";

interface Prize {
  id?: number;
  percentaje: number | string;
}

interface PrizeStructure {
  max_players: number | string;
  prizes: Prize[];
}

interface PrizeStructureManagerProps {
  prizeStructures: PrizeStructure[];
  onPrizeStructuresChange: (structures: PrizeStructure[]) => void;
  errors?: Record<string, string>;
  warnings?: Record<string, string>;
}

export function PrizeStructureManager({
  prizeStructures,
  onPrizeStructuresChange,
  errors = {},
  warnings = {},
}: PrizeStructureManagerProps) {
  const addPrizeStructure = () => {
    const newStructure: PrizeStructure = {
      max_players: "",
      prizes: [{ percentaje: "60" }, { percentaje: "40" }],
    };
    onPrizeStructuresChange([...prizeStructures, newStructure]);
  };

  const removePrizeStructure = (index: number) => {
    onPrizeStructuresChange(prizeStructures.filter((_, i) => i !== index));
  };

  const updateMaxPlayers = (index: number, value: string) => {
    const updated = prizeStructures.map((structure, i) =>
      i === index ? { ...structure, max_players: value } : structure
    );
    onPrizeStructuresChange(updated);
  };

  const addPrize = (structureIndex: number) => {
    const updated = prizeStructures.map((structure, i) =>
      i === structureIndex
        ? {
            ...structure,
            prizes: [...structure.prizes, { percentaje: "" }],
          }
        : structure
    );
    onPrizeStructuresChange(updated);
  };

  const removePrize = (structureIndex: number, prizeIndex: number) => {
    const updated = prizeStructures.map((structure, i) =>
      i === structureIndex
        ? {
            ...structure,
            prizes: structure.prizes.filter((_, j) => j !== prizeIndex),
          }
        : structure
    );
    onPrizeStructuresChange(updated);
  };

  const updatePrize = (
    structureIndex: number,
    prizeIndex: number,
    value: string
  ) => {
    const updated = prizeStructures.map((structure, i) =>
      i === structureIndex
        ? {
            ...structure,
            prizes: structure.prizes.map((prize, j) =>
              j === prizeIndex ? { ...prize, percentaje: value } : prize
            ),
          }
        : structure
    );
    onPrizeStructuresChange(updated);
  };

  const duplicatePrizeStructure = (index: number) => {
    const structureToDuplicate = prizeStructures[index];
    const newStructure = {
      ...structureToDuplicate,
      max_players: "",
      prizes: [...structureToDuplicate.prizes],
    };
    onPrizeStructuresChange([...prizeStructures, newStructure]);
  };

  const autoDistributePrizes = (structureIndex: number) => {
    const structure = prizeStructures[structureIndex];
    const prizeCount = structure.prizes.length;

    // Distribución automática común para torneos
    const distributions: Record<number, number[]> = {
      1: [100],
      2: [60, 40],
      3: [50, 30, 20],
      4: [40, 30, 20, 10],
      5: [35, 25, 20, 12, 8],
      6: [30, 22, 18, 15, 10, 5],
    };

    const distribution = distributions[prizeCount];
    if (distribution) {
      const updated = prizeStructures.map((struct, i) =>
        i === structureIndex
          ? {
              ...struct,
              prizes: struct.prizes.map((prize, j) => ({
                ...prize,
                percentaje: distribution[j]?.toString() || "",
              })),
            }
          : struct
      );
      onPrizeStructuresChange(updated);
    }
  };

  const getTotalPercentage = (structure: PrizeStructure) => {
    return structure.prizes.reduce(
      (total, prize) => total + (Number(prize.percentaje) || 0),
      0
    );
  };

  const getPositionLabel = (index: number) => {
    const labels = [
      "1º",
      "2º",
      "3º",
      "4º",
      "5º",
      "6º",
      "7º",
      "8º",
      "9º",
      "10º",
    ];
    return labels[index] || `${index + 1}º`;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Estructuras de Premios
          </CardTitle>
          <Button
            type="button"
            onClick={addPrizeStructure}
            size="sm"
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Nueva Estructura
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {prizeStructures.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground">
            <Award className="mx-auto mb-4 h-12 w-12 opacity-50" />
            <p className="mb-2 text-lg font-medium">
              No hay estructuras de premios
            </p>
            <p className="mb-4 text-sm">
              Define cómo se distribuirán los premios según el número de
              jugadores
            </p>
            <Button
              onClick={addPrizeStructure}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Crear Primera Estructura
            </Button>
          </div>
        ) : (
          prizeStructures.map((structure, structureIndex) => {
            const totalPercentage = getTotalPercentage(structure);
            const isValidTotal = Math.abs(totalPercentage - 100) < 0.01;

            return (
              <Card
                key={structureIndex}
                className={cn(
                  "border-2 transition-colors",
                  !isValidTotal && "border-yellow-200 dark:border-yellow-800"
                )}
              >
                <CardHeader className="pb-4">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                      <Users className="h-5 w-5 text-primary" />
                      <div className="flex items-center gap-2">
                        <EnhancedInput
                          type="number"
                          placeholder="10"
                          value={structure.max_players}
                          onValueChange={(value) =>
                            updateMaxPlayers(structureIndex, value)
                          }
                          error={
                            errors[
                              `prize_structures.${structureIndex}.max_players`
                            ]
                          }
                          warning={
                            warnings[
                              `prize_structures.${structureIndex}.max_players`
                            ]
                          }
                          className="w-20"
                          tooltip="Número máximo de jugadores para esta estructura"
                        />
                        <span className="text-sm text-muted-foreground">
                          jugadores
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <div
                        className={cn(
                          "rounded px-2 py-1 text-sm font-medium",
                          isValidTotal
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                        )}
                      >
                        Total: {totalPercentage.toFixed(1)}%
                      </div>

                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => autoDistributePrizes(structureIndex)}
                        className="flex items-center gap-1"
                        title="Distribución automática"
                      >
                        <Calculator className="h-4 w-4" />
                      </Button>

                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => duplicatePrizeStructure(structureIndex)}
                        className="flex items-center gap-1"
                        title="Duplicar estructura"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>

                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removePrizeStructure(structureIndex)}
                        className="text-destructive hover:text-destructive"
                        title="Eliminar estructura"
                        disabled={prizeStructures.length === 1}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-3">
                  {/* Encabezados - Ocultos en móvil */}
                  <div className="hidden grid-cols-3 gap-3 text-sm font-medium text-muted-foreground sm:grid">
                    <span>Posición</span>
                    <span>Porcentaje</span>
                    <span>Acciones</span>
                  </div>

                  {/* Premios */}
                  {structure.prizes.map((prize, prizeIndex) => (
                    <div
                      key={prizeIndex}
                      className="flex flex-col gap-3 rounded-lg bg-muted/30 p-3 sm:grid sm:grid-cols-3 sm:items-center"
                    >
                      <div className="space-y-1">
                        <label className="text-sm font-medium text-muted-foreground sm:hidden">
                          Posición
                        </label>
                        <div className="flex items-center gap-2">
                          <div
                            className={cn(
                              "flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold",
                              prizeIndex === 0
                                ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                                : prizeIndex === 1
                                  ? "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
                                  : prizeIndex === 2
                                    ? "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
                                    : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                            )}
                          >
                            {getPositionLabel(prizeIndex)}
                          </div>
                          <span className="text-sm text-muted-foreground">
                            lugar
                          </span>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-sm font-medium text-muted-foreground sm:hidden">
                          Porcentaje del bote
                        </label>
                        <PercentageInput
                          placeholder="50"
                          value={prize.percentaje}
                          onValueChange={(value) =>
                            updatePrize(structureIndex, prizeIndex, value)
                          }
                          error={
                            errors[
                              `prize_structures.${structureIndex}.prizes.${prizeIndex}`
                            ]
                          }
                          warning={
                            warnings[
                              `prize_structures.${structureIndex}.prizes.${prizeIndex}`
                            ]
                          }
                          tooltip={`Porcentaje del bote para el ${getPositionLabel(prizeIndex)} lugar`}
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-sm font-medium text-muted-foreground sm:hidden">
                          Acciones
                        </label>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            removePrize(structureIndex, prizeIndex)
                          }
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                          title="Eliminar premio"
                          disabled={structure.prizes.length === 1}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}

                  {/* Botón para añadir premio */}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addPrize(structureIndex)}
                    className="flex w-full items-center gap-2"
                    disabled={structure.prizes.length >= 10}
                  >
                    <Plus className="h-4 w-4" />
                    Añadir Premio
                  </Button>

                  {/* Advertencias */}
                  {!isValidTotal && (
                    <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-3 dark:border-yellow-800 dark:bg-yellow-900/20">
                      <p className="text-sm text-yellow-800 dark:text-yellow-200">
                        ⚠️ Los porcentajes deben sumar exactamente 100%
                      </p>
                    </div>
                  )}

                  {structure.prizes.length >
                    Number(structure.max_players) / 2 && (
                    <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 dark:border-blue-800 dark:bg-blue-900/20">
                      <p className="text-sm text-blue-800 dark:text-blue-200">
                        💡 Tienes muchos premios para pocos jugadores. ¿Es esto
                        intencional?
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
