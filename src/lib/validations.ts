import { GameTemplate, Level, PrizeStructure } from "@/types";

// Tipos para errores de validación
export interface ValidationError {
  field: string;
  message: string;
  type: "error" | "warning";
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationError[];
}

// Tipos para datos del formulario (que vienen como strings)
export interface FormGameTemplate {
  id?: number;
  name?: string;
  entry?: string | number;
  fee?: string | number;
  bubble?: string | number;
  bounty?: string | number;
  points?: string;
  extrapot?: string | number;
  addon_price?: string | number;
  addon_points?: string | number;
  double_addon_price?: string | number;
  double_addon_points?: string | number;
  punctuality_bonus?: string | number;
  levels?: FormLevel[];
  prize_structures?: FormPrizeStructure[];
}

export interface FormLevel {
  sb?: string | number;
  bb?: string | number;
  ante?: string | number;
  time?: string | number;
}

export interface FormPrizeStructure {
  max_players?: string | number;
  prizes?: FormPrize[];
}

export interface FormPrize {
  id?: number;
  percentaje?: string | number;
}

// Constantes de validación
const VALIDATION_CONSTANTS = {
  MIN_ENTRY: 0.01,
  MAX_ENTRY: 10000,
  MIN_FEE: 0,
  MAX_FEE: 50,
  MIN_POINTS: 100,
  MAX_POINTS: 1000000,
  MIN_LEVEL_TIME: 1,
  MAX_LEVEL_TIME: 180,
  MIN_BLIND: 1,
  MAX_BLIND: 1000000,
  MIN_ANTE: 0,
  MAX_PLAYERS: 1000,
  MIN_PRIZE_PERCENTAGE: 0.01,
  MAX_PRIZE_PERCENTAGE: 100,
} as const;

// Utilidad para convertir string a número de forma segura
function toNumber(value: string | number | undefined): number {
  if (typeof value === "number") return value;
  if (typeof value === "string") return Number(value);
  return NaN;
}

// Utilidad para verificar si un valor está vacío
function isEmpty(value: string | number | undefined): boolean {
  return value === undefined || value === null || value === "";
}

// Validaciones para campos básicos
export function validateBasicFields(
  template: FormGameTemplate
): ValidationError[] {
  const errors: ValidationError[] = [];

  // Nombre
  if (!template.name || template.name.trim().length === 0) {
    errors.push({
      field: "name",
      message: "El nombre del torneo es obligatorio",
      type: "error",
    });
  } else if (template.name.trim().length < 3) {
    errors.push({
      field: "name",
      message: "El nombre debe tener al menos 3 caracteres",
      type: "error",
    });
  } else if (template.name.trim().length > 50) {
    errors.push({
      field: "name",
      message: "El nombre no puede exceder 50 caracteres",
      type: "error",
    });
  }

  // Entrada (buy-in)
  if (isEmpty(template.entry)) {
    errors.push({
      field: "entry",
      message: "La entrada es obligatoria",
      type: "error",
    });
  } else {
    const entry = toNumber(template.entry);
    if (isNaN(entry)) {
      errors.push({
        field: "entry",
        message: "La entrada debe ser un número válido",
        type: "error",
      });
    } else if (entry < VALIDATION_CONSTANTS.MIN_ENTRY) {
      errors.push({
        field: "entry",
        message: `La entrada debe ser al menos ${VALIDATION_CONSTANTS.MIN_ENTRY}€`,
        type: "error",
      });
    } else if (entry > VALIDATION_CONSTANTS.MAX_ENTRY) {
      errors.push({
        field: "entry",
        message: `La entrada no puede exceder ${VALIDATION_CONSTANTS.MAX_ENTRY}€`,
        type: "error",
      });
    }
  }

  // Comisión
  if (!isEmpty(template.fee)) {
    const fee = toNumber(template.fee);
    if (isNaN(fee)) {
      errors.push({
        field: "fee",
        message: "La comisión debe ser un número válido",
        type: "error",
      });
    } else if (fee < VALIDATION_CONSTANTS.MIN_FEE) {
      errors.push({
        field: "fee",
        message: "La comisión no puede ser negativa",
        type: "error",
      });
    } else if (fee > VALIDATION_CONSTANTS.MAX_FEE) {
      errors.push({
        field: "fee",
        message: `La comisión no puede exceder ${VALIDATION_CONSTANTS.MAX_FEE}%`,
        type: "error",
      });
    }
  }

  // Puntos iniciales
  if (isEmpty(template.points)) {
    errors.push({
      field: "points",
      message: "Los puntos iniciales son obligatorios",
      type: "error",
    });
  } else {
    const points = toNumber(template.points);
    if (isNaN(points)) {
      errors.push({
        field: "points",
        message: "Los puntos iniciales deben ser un número válido",
        type: "error",
      });
    } else if (points < VALIDATION_CONSTANTS.MIN_POINTS) {
      errors.push({
        field: "points",
        message: `Los puntos iniciales deben ser al menos ${VALIDATION_CONSTANTS.MIN_POINTS}`,
        type: "error",
      });
    } else if (points > VALIDATION_CONSTANTS.MAX_POINTS) {
      errors.push({
        field: "points",
        message: `Los puntos iniciales no pueden exceder ${VALIDATION_CONSTANTS.MAX_POINTS}`,
        type: "error",
      });
    }
  }

  // Bote extra
  if (!isEmpty(template.extrapot)) {
    const extrapot = toNumber(template.extrapot);
    if (isNaN(extrapot)) {
      errors.push({
        field: "extrapot",
        message: "El bote extra debe ser un número válido",
        type: "error",
      });
    } else if (extrapot < 0) {
      errors.push({
        field: "extrapot",
        message: "El bote extra no puede ser negativo",
        type: "error",
      });
    }
  }

  // Burbuja
  if (!isEmpty(template.bubble)) {
    const bubble = toNumber(template.bubble);
    if (isNaN(bubble)) {
      errors.push({
        field: "bubble",
        message: "El premio de burbuja debe ser un número válido",
        type: "error",
      });
    } else if (bubble < 0) {
      errors.push({
        field: "bubble",
        message: "El premio de burbuja no puede ser negativo",
        type: "error",
      });
    }
  }

  // Bounty
  if (!isEmpty(template.bounty)) {
    const bounty = toNumber(template.bounty);
    if (isNaN(bounty)) {
      errors.push({
        field: "bounty",
        message: "El bounty debe ser un número válido",
        type: "error",
      });
    } else if (bounty < 0) {
      errors.push({
        field: "bounty",
        message: "El bounty no puede ser negativo",
        type: "error",
      });
    } else if (bounty > VALIDATION_CONSTANTS.MAX_ENTRY) {
      errors.push({
        field: "bounty",
        message: `El bounty no puede exceder ${VALIDATION_CONSTANTS.MAX_ENTRY}€`,
        type: "error",
      });
    }

    // Advertencia si el bounty es muy alto comparado con la entrada
    const entry = toNumber(template.entry);
    if (!isNaN(entry) && bounty > entry) {
      errors.push({
        field: "bounty",
        message: "El bounty es mayor que la entrada. ¿Es esto intencional?",
        type: "warning",
      });
    }
  }

  // Bono de puntualidad
  if (!isEmpty(template.punctuality_bonus)) {
    const punctualityBonus = toNumber(template.punctuality_bonus);
    if (isNaN(punctualityBonus)) {
      errors.push({
        field: "punctuality_bonus",
        message: "El bono de puntualidad debe ser un número válido",
        type: "error",
      });
    } else if (punctualityBonus < 0) {
      errors.push({
        field: "punctuality_bonus",
        message: "El bono de puntualidad no puede ser negativo",
        type: "error",
      });
    } else if (punctualityBonus > VALIDATION_CONSTANTS.MAX_POINTS) {
      errors.push({
        field: "punctuality_bonus",
        message: `El bono de puntualidad no puede exceder ${VALIDATION_CONSTANTS.MAX_POINTS} puntos`,
        type: "error",
      });
    }

    // Advertencia si el bono es muy alto comparado con los puntos base
    const basePoints = toNumber(template.points);
    if (!isNaN(basePoints) && punctualityBonus > basePoints) {
      errors.push({
        field: "punctuality_bonus",
        message:
          "El bono de puntualidad es mayor que los puntos base. ¿Es esto intencional?",
        type: "warning",
      });
    }
  }

  return errors;
}

// Validaciones para niveles
export function validateLevels(levels: FormLevel[]): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!levels || levels.length === 0) {
    errors.push({
      field: "levels",
      message: "Debe definir al menos un nivel",
      type: "error",
    });
    return errors;
  }

  levels.forEach((level, index) => {
    const levelNumber = index + 1;

    // Validar ciega pequeña
    if (isEmpty(level.sb)) {
      errors.push({
        field: `levels.${index}.sb`,
        message: `Nivel ${levelNumber}: La ciega pequeña es obligatoria`,
        type: "error",
      });
    } else {
      const sb = toNumber(level.sb);
      if (isNaN(sb)) {
        errors.push({
          field: `levels.${index}.sb`,
          message: `Nivel ${levelNumber}: La ciega pequeña debe ser un número válido`,
          type: "error",
        });
      } else if (sb < VALIDATION_CONSTANTS.MIN_BLIND) {
        errors.push({
          field: `levels.${index}.sb`,
          message: `Nivel ${levelNumber}: La ciega pequeña debe ser al menos ${VALIDATION_CONSTANTS.MIN_BLIND}`,
          type: "error",
        });
      } else if (sb > VALIDATION_CONSTANTS.MAX_BLIND) {
        errors.push({
          field: `levels.${index}.sb`,
          message: `Nivel ${levelNumber}: La ciega pequeña no puede exceder ${VALIDATION_CONSTANTS.MAX_BLIND}`,
          type: "error",
        });
      }
    }

    // Validar ciega grande
    if (isEmpty(level.bb)) {
      errors.push({
        field: `levels.${index}.bb`,
        message: `Nivel ${levelNumber}: La ciega grande es obligatoria`,
        type: "error",
      });
    } else {
      const bb = toNumber(level.bb);
      if (isNaN(bb)) {
        errors.push({
          field: `levels.${index}.bb`,
          message: `Nivel ${levelNumber}: La ciega grande debe ser un número válido`,
          type: "error",
        });
      } else if (bb < VALIDATION_CONSTANTS.MIN_BLIND) {
        errors.push({
          field: `levels.${index}.bb`,
          message: `Nivel ${levelNumber}: La ciega grande debe ser al menos ${VALIDATION_CONSTANTS.MIN_BLIND}`,
          type: "error",
        });
      } else if (bb > VALIDATION_CONSTANTS.MAX_BLIND) {
        errors.push({
          field: `levels.${index}.bb`,
          message: `Nivel ${levelNumber}: La ciega grande no puede exceder ${VALIDATION_CONSTANTS.MAX_BLIND}`,
          type: "error",
        });
      }
    }

    // Validar relación SB/BB
    const sb = toNumber(level.sb);
    const bb = toNumber(level.bb);
    if (!isNaN(sb) && !isNaN(bb)) {
      // Solo validar que BB no sea menor que SB
      if (bb < sb) {
        errors.push({
          field: `levels.${index}.bb`,
          message: `Nivel ${levelNumber}: La ciega grande no puede ser menor que la pequeña`,
          type: "error",
        });
      }

      // Advertencia si BB es mucho mayor que el doble de SB (configuración inusual)
      if (bb > sb * 5) {
        errors.push({
          field: `levels.${index}.bb`,
          message: `Nivel ${levelNumber}: La ciega grande es muy alta comparada con la pequeña (${bb} vs ${sb}). ¿Es esto intencional?`,
          type: "warning",
        });
      }
    }

    // Validar ante
    if (!isEmpty(level.ante)) {
      const ante = toNumber(level.ante);
      if (isNaN(ante)) {
        errors.push({
          field: `levels.${index}.ante`,
          message: `Nivel ${levelNumber}: El ante debe ser un número válido`,
          type: "error",
        });
      } else if (ante < VALIDATION_CONSTANTS.MIN_ANTE) {
        errors.push({
          field: `levels.${index}.ante`,
          message: `Nivel ${levelNumber}: El ante no puede ser negativo`,
          type: "error",
        });
      } else if (!isNaN(sb) && ante > sb * 2) {
        errors.push({
          field: `levels.${index}.ante`,
          message: `Nivel ${levelNumber}: El ante es muy alto comparado con la ciega pequeña (${ante} vs ${sb}). ¿Es esto intencional?`,
          type: "warning",
        });
      }
    }

    // Validar tiempo
    if (isEmpty(level.time)) {
      errors.push({
        field: `levels.${index}.time`,
        message: `Nivel ${levelNumber}: El tiempo es obligatorio`,
        type: "error",
      });
    } else {
      const time = toNumber(level.time);
      if (isNaN(time)) {
        errors.push({
          field: `levels.${index}.time`,
          message: `Nivel ${levelNumber}: El tiempo debe ser un número válido`,
          type: "error",
        });
      } else if (time < VALIDATION_CONSTANTS.MIN_LEVEL_TIME) {
        errors.push({
          field: `levels.${index}.time`,
          message: `Nivel ${levelNumber}: El tiempo debe ser al menos ${VALIDATION_CONSTANTS.MIN_LEVEL_TIME} minuto`,
          type: "error",
        });
      } else if (time > VALIDATION_CONSTANTS.MAX_LEVEL_TIME) {
        errors.push({
          field: `levels.${index}.time`,
          message: `Nivel ${levelNumber}: El tiempo no puede exceder ${VALIDATION_CONSTANTS.MAX_LEVEL_TIME} minutos`,
          type: "error",
        });
      }
    }

    // Validar progresión de ciegas
    if (index > 0 && !isNaN(sb) && !isNaN(bb)) {
      const prevLevel = levels[index - 1];
      const prevSb = toNumber(prevLevel.sb);
      const prevBb = toNumber(prevLevel.bb);

      if (!isNaN(prevSb) && sb < prevSb) {
        errors.push({
          field: `levels.${index}.sb`,
          message: `Nivel ${levelNumber}: La ciega pequeña debe ser mayor o igual que el nivel anterior (${prevSb})`,
          type: "error",
        });
      }

      if (!isNaN(prevBb) && bb < prevBb) {
        errors.push({
          field: `levels.${index}.bb`,
          message: `Nivel ${levelNumber}: La ciega grande debe ser mayor o igual que el nivel anterior (${prevBb})`,
          type: "error",
        });
      }

      // Advertencia si el aumento es muy grande
      if (!isNaN(prevSb) && sb > prevSb * 3) {
        errors.push({
          field: `levels.${index}.sb`,
          message: `Nivel ${levelNumber}: El aumento de ciega pequeña es muy grande (más del 300%)`,
          type: "warning",
        });
      }
    }
  });

  return errors;
}

// Validaciones para estructuras de premios
export function validatePrizeStructures(
  prizeStructures: FormPrizeStructure[]
): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!prizeStructures || prizeStructures.length === 0) {
    errors.push({
      field: "prize_structures",
      message: "Debe definir al menos una estructura de premios",
      type: "error",
    });
    return errors;
  }

  prizeStructures.forEach((structure, structureIndex) => {
    // Validar número máximo de jugadores
    if (isEmpty(structure.max_players)) {
      errors.push({
        field: `prize_structures.${structureIndex}.max_players`,
        message: `Estructura ${structureIndex + 1}: El número máximo de jugadores es obligatorio`,
        type: "error",
      });
    } else {
      const maxPlayers = toNumber(structure.max_players);
      if (isNaN(maxPlayers)) {
        errors.push({
          field: `prize_structures.${structureIndex}.max_players`,
          message: `Estructura ${structureIndex + 1}: El número máximo de jugadores debe ser un número válido`,
          type: "error",
        });
      } else if (maxPlayers < 1) {
        errors.push({
          field: `prize_structures.${structureIndex}.max_players`,
          message: `Estructura ${structureIndex + 1}: Debe haber al menos 1 jugador`,
          type: "error",
        });
      } else if (maxPlayers > VALIDATION_CONSTANTS.MAX_PLAYERS) {
        errors.push({
          field: `prize_structures.${structureIndex}.max_players`,
          message: `Estructura ${structureIndex + 1}: No puede exceder ${VALIDATION_CONSTANTS.MAX_PLAYERS} jugadores`,
          type: "error",
        });
      }
    }

    // Validar premios
    if (!structure.prizes || structure.prizes.length === 0) {
      errors.push({
        field: `prize_structures.${structureIndex}.prizes`,
        message: `Estructura ${structureIndex + 1}: Debe definir al menos un premio`,
        type: "error",
      });
    } else {
      let totalPercentage = 0;

      structure.prizes.forEach((prize, prizeIndex) => {
        if (isEmpty(prize.percentaje)) {
          errors.push({
            field: `prize_structures.${structureIndex}.prizes.${prizeIndex}`,
            message: `Estructura ${structureIndex + 1}, Premio ${prizeIndex + 1}: El porcentaje es obligatorio`,
            type: "error",
          });
        } else {
          const percentage = toNumber(prize.percentaje);

          if (isNaN(percentage)) {
            errors.push({
              field: `prize_structures.${structureIndex}.prizes.${prizeIndex}`,
              message: `Estructura ${structureIndex + 1}, Premio ${prizeIndex + 1}: El porcentaje debe ser un número válido`,
              type: "error",
            });
          } else if (percentage < VALIDATION_CONSTANTS.MIN_PRIZE_PERCENTAGE) {
            errors.push({
              field: `prize_structures.${structureIndex}.prizes.${prizeIndex}`,
              message: `Estructura ${structureIndex + 1}, Premio ${prizeIndex + 1}: El porcentaje debe ser al menos ${VALIDATION_CONSTANTS.MIN_PRIZE_PERCENTAGE}%`,
              type: "error",
            });
          } else if (percentage > VALIDATION_CONSTANTS.MAX_PRIZE_PERCENTAGE) {
            errors.push({
              field: `prize_structures.${structureIndex}.prizes.${prizeIndex}`,
              message: `Estructura ${structureIndex + 1}, Premio ${prizeIndex + 1}: El porcentaje no puede exceder ${VALIDATION_CONSTANTS.MAX_PRIZE_PERCENTAGE}%`,
              type: "error",
            });
          } else {
            totalPercentage += percentage;
          }
        }
      });

      // Validar que los porcentajes sumen 100%
      if (Math.abs(totalPercentage - 100) > 0.01) {
        errors.push({
          field: `prize_structures.${structureIndex}.prizes`,
          message: `Estructura ${structureIndex + 1}: Los porcentajes deben sumar exactamente 100% (actual: ${totalPercentage.toFixed(2)}%)`,
          type: "error",
        });
      }

      // Validar que el primer premio sea el mayor
      if (structure.prizes.length > 1) {
        const firstPrize = toNumber(structure.prizes[0].percentaje);
        for (let i = 1; i < structure.prizes.length; i++) {
          const currentPrize = toNumber(structure.prizes[i].percentaje);
          if (
            !isNaN(firstPrize) &&
            !isNaN(currentPrize) &&
            currentPrize > firstPrize
          ) {
            errors.push({
              field: `prize_structures.${structureIndex}.prizes.${i}`,
              message: `Estructura ${structureIndex + 1}: El primer lugar debe recibir el mayor porcentaje`,
              type: "warning",
            });
            break;
          }
        }
      }

      // Advertencia si hay demasiados premios para pocos jugadores
      const maxPlayers = toNumber(structure.max_players);
      if (!isNaN(maxPlayers) && structure.prizes.length > maxPlayers / 2) {
        errors.push({
          field: `prize_structures.${structureIndex}.prizes`,
          message: `Estructura ${structureIndex + 1}: Muchos premios para pocos jugadores. ¿Es esto intencional?`,
          type: "warning",
        });
      }
    }
  });

  // Validar que no haya estructuras duplicadas
  const maxPlayersValues = prizeStructures
    .map((s) => toNumber(s.max_players))
    .filter((n) => !isNaN(n));
  const duplicates = maxPlayersValues.filter(
    (value, index) => maxPlayersValues.indexOf(value) !== index
  );

  if (duplicates.length > 0) {
    errors.push({
      field: "prize_structures",
      message: `Hay estructuras duplicadas para el mismo número de jugadores: ${duplicates.join(", ")}`,
      type: "error",
    });
  }

  return errors;
}

// Función principal de validación
export function validateGameTemplate(
  template: FormGameTemplate
): ValidationResult {
  const allErrors: ValidationError[] = [];

  // Validar campos básicos
  allErrors.push(...validateBasicFields(template));

  // Validar niveles
  if (template.levels) {
    allErrors.push(...validateLevels(template.levels));
  }

  // Validar estructuras de premios
  if (template.prize_structures) {
    allErrors.push(...validatePrizeStructures(template.prize_structures));
  }

  // Separar errores y advertencias
  const errors = allErrors.filter((e) => e.type === "error");
  const warnings = allErrors.filter((e) => e.type === "warning");

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

// Función para obtener el mensaje de error para un campo específico
export function getFieldError(
  errors: ValidationError[],
  fieldName: string
): string | undefined {
  const error = errors.find(
    (e) => e.field === fieldName || e.field.startsWith(`${fieldName}.`)
  );
  return error?.message;
}

// Función para verificar si un campo tiene errores
export function hasFieldError(
  errors: ValidationError[],
  fieldName: string
): boolean {
  return errors.some(
    (e) => e.field === fieldName || e.field.startsWith(`${fieldName}.`)
  );
}

// Función para obtener cualquier mensaje (error o advertencia) para un campo específico
export function getFieldMessage(
  messages: ValidationError[],
  fieldName: string
): ValidationError | undefined {
  return messages.find(
    (e) => e.field === fieldName || e.field.startsWith(`${fieldName}.`)
  );
}

// Función para verificar si un campo tiene cualquier mensaje (error o advertencia)
export function hasFieldMessage(
  messages: ValidationError[],
  fieldName: string
): boolean {
  return messages.some(
    (e) => e.field === fieldName || e.field.startsWith(`${fieldName}.`)
  );
}
