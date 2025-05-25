import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EnhancedInput, TimeInput } from "@/components/ui/enhanced-input";
import { FormGrid } from "@/components/ui/form-section";
import { cn } from "@/lib/utils";
import {
  Clock,
  Coins,
  Eye,
  EyeOff,
  GripVertical,
  Plus,
  Trash2,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";

interface Level {
  sb: number | string;
  bb: number | string;
  ante: number | string;
  time: number | string;
}

interface LevelManagerProps {
  levels: Level[];
  onLevelsChange: (levels: Level[]) => void;
  errors?: Record<string, string>;
  warnings?: Record<string, string>;
}

export function LevelManager({
  levels,
  onLevelsChange,
  errors = {},
  warnings = {},
}: LevelManagerProps) {
  const [showAnteColumn, setShowAnteColumn] = useState(
    levels.some((level) => level.ante && Number(level.ante) > 0)
  );

  const addLevel = () => {
    const newLevel: Level = {
      sb: "",
      bb: "",
      ante: showAnteColumn ? "" : "0",
      time: "20",
    };
    onLevelsChange([...levels, newLevel]);
  };

  const removeLevel = (index: number) => {
    onLevelsChange(levels.filter((_, i) => i !== index));
  };

  const updateLevel = (index: number, field: keyof Level, value: string) => {
    const updatedLevels = levels.map((level, i) =>
      i === index ? { ...level, [field]: value } : level
    );
    onLevelsChange(updatedLevels);
  };

  const duplicateLevel = (index: number) => {
    const levelToDuplicate = levels[index];
    const newLevel = { ...levelToDuplicate };
    const newLevels = [...levels];
    newLevels.splice(index + 1, 0, newLevel);
    onLevelsChange(newLevels);
  };

  const toggleAnteColumn = () => {
    setShowAnteColumn(!showAnteColumn);
    if (!showAnteColumn) {
      // Si activamos la columna ante, inicializar con 0
      const updatedLevels = levels.map((level) => ({
        ...level,
        ante: level.ante || "0",
      }));
      onLevelsChange(updatedLevels);
    }
  };

  const getProgressionIndicator = (index: number) => {
    if (index === 0) return null;

    const currentSb = Number(levels[index].sb);
    const prevSb = Number(levels[index - 1].sb);

    if (isNaN(currentSb) || isNaN(prevSb) || prevSb === 0) return null;

    const increase = ((currentSb - prevSb) / prevSb) * 100;

    if (increase > 0) {
      return (
        <div className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
          <TrendingUp className="h-3 w-3" />
          <span>+{increase.toFixed(0)}%</span>
        </div>
      );
    }

    return null;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Estructura de Niveles
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={toggleAnteColumn}
              className="flex items-center gap-2"
            >
              {showAnteColumn ? (
                <>
                  <EyeOff className="h-4 w-4" />
                  Ocultar Ante
                </>
              ) : (
                <>
                  <Eye className="h-4 w-4" />
                  Mostrar Ante
                </>
              )}
            </Button>
            <Button
              type="button"
              onClick={addLevel}
              size="sm"
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Añadir Nivel
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {levels.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground">
            <Clock className="mx-auto mb-4 h-12 w-12 opacity-50" />
            <p className="mb-2 text-lg font-medium">No hay niveles definidos</p>
            <p className="mb-4 text-sm">
              Añade al menos un nivel para comenzar tu torneo
            </p>
            <Button onClick={addLevel} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Crear Primer Nivel
            </Button>
          </div>
        ) : (
          <>
            {/* Encabezados */}
            <div
              className={cn(
                "grid gap-3 text-sm font-medium text-muted-foreground",
                showAnteColumn ? "grid-cols-6" : "grid-cols-5"
              )}
            >
              <span>Ciega Pequeña</span>
              <span>Ciega Grande</span>
              {showAnteColumn && <span>Ante</span>}
              <span>Duración</span>
              <span>Progresión</span>
              <span>Acciones</span>
            </div>

            {/* Niveles */}
            <div className="space-y-3">
              {levels.map((level, index) => (
                <div
                  key={index}
                  className={cn(
                    "grid gap-3 rounded-lg border p-4 transition-colors",
                    index % 2 === 0 ? "bg-muted/30" : "bg-background",
                    showAnteColumn ? "grid-cols-6" : "grid-cols-5"
                  )}
                >
                  {/* Ciega Pequeña */}
                  <EnhancedInput
                    type="number"
                    placeholder="25"
                    value={level.sb}
                    onValueChange={(value) => updateLevel(index, "sb", value)}
                    error={errors[`levels.${index}.sb`]}
                    warning={warnings[`levels.${index}.sb`]}
                    icon={<Coins className="h-4 w-4" />}
                    tooltip="Ciega pequeña para este nivel"
                  />

                  {/* Ciega Grande */}
                  <EnhancedInput
                    type="number"
                    placeholder="50"
                    value={level.bb}
                    onValueChange={(value) => updateLevel(index, "bb", value)}
                    error={errors[`levels.${index}.bb`]}
                    warning={warnings[`levels.${index}.bb`]}
                    icon={<Coins className="h-4 w-4" />}
                    tooltip="Ciega grande para este nivel"
                  />

                  {/* Ante (condicional) */}
                  {showAnteColumn && (
                    <EnhancedInput
                      type="number"
                      placeholder="0"
                      value={level.ante}
                      onValueChange={(value) =>
                        updateLevel(index, "ante", value)
                      }
                      error={errors[`levels.${index}.ante`]}
                      warning={warnings[`levels.${index}.ante`]}
                      icon={<Coins className="h-4 w-4" />}
                      tooltip="Ante obligatorio para todos los jugadores"
                    />
                  )}

                  {/* Tiempo */}
                  <TimeInput
                    placeholder="20"
                    value={level.time}
                    onValueChange={(value) => updateLevel(index, "time", value)}
                    error={errors[`levels.${index}.time`]}
                    warning={warnings[`levels.${index}.time`]}
                    tooltip="Duración del nivel en minutos"
                  />

                  {/* Indicador de Progresión */}
                  <div className="flex items-center justify-center">
                    {getProgressionIndicator(index) || (
                      <span className="text-xs text-muted-foreground">
                        {index === 0 ? "Inicial" : "—"}
                      </span>
                    )}
                  </div>

                  {/* Acciones */}
                  <div className="flex items-center gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => duplicateLevel(index)}
                      className="h-8 w-8 p-0"
                      title="Duplicar nivel"
                    >
                      <GripVertical className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeLevel(index)}
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                      title="Eliminar nivel"
                      disabled={levels.length === 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Resumen */}
            <div className="mt-6 rounded-lg bg-muted/50 p-4">
              <div className="grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
                <div>
                  <span className="text-muted-foreground">Total Niveles:</span>
                  <p className="font-medium">{levels.length}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Duración Total:</span>
                  <p className="font-medium">
                    {levels.reduce(
                      (total, level) => total + Number(level.time || 0),
                      0
                    )}{" "}
                    min
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">Ciega Inicial:</span>
                  <p className="font-medium">
                    {levels[0]?.sb || "—"} / {levels[0]?.bb || "—"}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">Ciega Final:</span>
                  <p className="font-medium">
                    {levels[levels.length - 1]?.sb || "—"} /{" "}
                    {levels[levels.length - 1]?.bb || "—"}
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
