import { GameTemplate, Game } from "@/types";

// Tipos para manejo de errores
export interface ErrorLog {
  id: string;
  message: string;
  stack?: string;
  timestamp: string;
  context?: Record<string, unknown>;
  severity: "low" | "medium" | "high" | "critical";
  resolved?: boolean;
}

export interface DataValidationResult<T> {
  isValid: boolean;
  data: T | null;
  errors: string[];
  warnings: string[];
  recovered?: boolean;
}

// Clase principal para manejo de errores
export class ErrorHandler {
  private static instance: ErrorHandler;
  private errorLogs: ErrorLog[] = [];

  private constructor() {
    this.loadErrorLogs();
  }

  static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler();
    }
    return ErrorHandler.instance;
  }

  // Logging de errores
  logError(
    error: Error | string,
    context?: Record<string, unknown>,
    severity: ErrorLog["severity"] = "medium"
  ): string {
    const errorId = this.generateErrorId();
    const errorLog: ErrorLog = {
      id: errorId,
      message: typeof error === "string" ? error : error.message,
      stack: typeof error === "object" ? error.stack : undefined,
      timestamp: new Date().toISOString(),
      context,
      severity,
      resolved: false,
    };

    this.errorLogs.push(errorLog);
    this.saveErrorLogs();

    // Log to console based on severity
    switch (severity) {
      case "critical":
        console.error("🔴 CRITICAL ERROR:", errorLog);
        break;
      case "high":
        console.error("🟠 HIGH ERROR:", errorLog);
        break;
      case "medium":
        console.warn("🟡 MEDIUM ERROR:", errorLog);
        break;
      case "low":
        console.info("🔵 LOW ERROR:", errorLog);
        break;
    }

    return errorId;
  }

  // Obtener logs de errores
  getErrorLogs(severity?: ErrorLog["severity"]): ErrorLog[] {
    if (severity) {
      return this.errorLogs.filter((log) => log.severity === severity);
    }
    return [...this.errorLogs];
  }

  // Marcar error como resuelto
  resolveError(errorId: string): boolean {
    const errorIndex = this.errorLogs.findIndex((log) => log.id === errorId);
    if (errorIndex !== -1) {
      this.errorLogs[errorIndex].resolved = true;
      this.saveErrorLogs();
      return true;
    }
    return false;
  }

  // Limpiar logs antiguos
  clearOldLogs(daysOld: number = 7): void {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    this.errorLogs = this.errorLogs.filter(
      (log) => new Date(log.timestamp) > cutoffDate
    );
    this.saveErrorLogs();
  }

  private generateErrorId(): string {
    return `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private loadErrorLogs(): void {
    try {
      const stored = localStorage.getItem("errorLogs");
      if (stored) {
        this.errorLogs = JSON.parse(stored);
      }
    } catch (error) {
      console.warn("Failed to load error logs from localStorage:", error);
      this.errorLogs = [];
    }
  }

  private saveErrorLogs(): void {
    try {
      // Keep only last 50 errors to avoid storage bloat
      if (this.errorLogs.length > 50) {
        this.errorLogs = this.errorLogs.slice(-50);
      }
      localStorage.setItem("errorLogs", JSON.stringify(this.errorLogs));
    } catch (error) {
      console.warn("Failed to save error logs to localStorage:", error);
    }
  }
}

// Utilidades para validación y recuperación de datos
export class DataRecovery {
  // Validar y recuperar plantillas de juego
  static validateGameTemplates(
    data: unknown
  ): DataValidationResult<GameTemplate[]> {
    const result: DataValidationResult<GameTemplate[]> = {
      isValid: true,
      data: [],
      errors: [],
      warnings: [],
      recovered: false,
    };

    try {
      if (!Array.isArray(data)) {
        result.errors.push("Los datos no son un array válido");
        result.isValid = false;
        return result;
      }

      const validTemplates: GameTemplate[] = [];
      const errorHandler = ErrorHandler.getInstance();

      data.forEach((template, index) => {
        try {
          const validatedTemplate = this.validateSingleTemplate(template);
          if (validatedTemplate.isValid && validatedTemplate.data) {
            validTemplates.push(validatedTemplate.data);
            if (validatedTemplate.recovered) {
              result.recovered = true;
              result.warnings.push(
                `Plantilla ${index + 1} fue recuperada con datos por defecto`
              );
            }
          } else {
            result.warnings.push(
              `Plantilla ${index + 1} omitida: ${validatedTemplate.errors.join(", ")}`
            );
            errorHandler.logError(
              `Invalid template at index ${index}`,
              { template, errors: validatedTemplate.errors },
              "medium"
            );
          }
        } catch (error) {
          result.warnings.push(`Error procesando plantilla ${index + 1}`);
          errorHandler.logError(error as Error, { template, index }, "medium");
        }
      });

      result.data = validTemplates;

      if (validTemplates.length === 0 && data.length > 0) {
        result.isValid = false;
        result.errors.push("No se pudieron recuperar plantillas válidas");
      }
    } catch (error) {
      result.isValid = false;
      result.errors.push("Error crítico validando plantillas");
      ErrorHandler.getInstance().logError(
        error as Error,
        { originalData: data },
        "high"
      );
    }

    return result;
  }

  // Validar una plantilla individual
  private static validateSingleTemplate(
    template: unknown
  ): DataValidationResult<GameTemplate> {
    const result: DataValidationResult<GameTemplate> = {
      isValid: true,
      data: null,
      errors: [],
      warnings: [],
      recovered: false,
    };

    try {
      // Verificar que template es un objeto
      if (!template || typeof template !== "object") {
        result.errors.push("La plantilla no es un objeto válido");
        result.isValid = false;
        return result;
      }

      const templateObj = template as Record<string, unknown>;

      // Campos requeridos
      const requiredFields = ["id", "name", "entry", "levels"];
      const missingFields = requiredFields.filter(
        (field) =>
          templateObj[field] === undefined || templateObj[field] === null
      );

      if (missingFields.length > 0) {
        result.errors.push(
          `Campos requeridos faltantes: ${missingFields.join(", ")}`
        );
        result.isValid = false;
        return result;
      }

      // Crear plantilla con valores por defecto para campos opcionales
      const recoveredTemplate: GameTemplate = {
        id: Number(templateObj.id) || 0,
        name: String(templateObj.name) || "Plantilla sin nombre",
        entry: Number(templateObj.entry) || 0,
        fee: Number(templateObj.fee) || 0,
        bubble: Number(templateObj.bubble) || 0,
        bounty: Number(templateObj.bounty) || 0,
        points: String(templateObj.points) || "1000",
        extrapot: Number(templateObj.extrapot) || 0,
        addon_price: Number(templateObj.addon_price) || 0,
        addon_points: Number(templateObj.addon_points) || 0,
        double_addon_price: Number(templateObj.double_addon_price) || 0,
        double_addon_points: Number(templateObj.double_addon_points) || 0,
        punctuality_bonus: Number(templateObj.punctuality_bonus) || 0,
        levels: this.validateLevels(templateObj.levels),
        prize_structures: this.validatePrizeStructures(
          templateObj.prize_structures || []
        ),
      };

      // Verificar si se aplicaron valores por defecto
      const originalKeys = Object.keys(templateObj);
      const expectedKeys = Object.keys(recoveredTemplate);
      const hasDefaults = expectedKeys.some(
        (key) =>
          !originalKeys.includes(key) ||
          templateObj[key] !== recoveredTemplate[key as keyof GameTemplate]
      );

      if (hasDefaults) {
        result.recovered = true;
        result.warnings.push(
          "Se aplicaron valores por defecto a campos faltantes"
        );
      }

      result.data = recoveredTemplate;
    } catch (error) {
      result.isValid = false;
      result.errors.push("Error validando estructura de plantilla");
    }

    return result;
  }

  // Validar niveles
  private static validateLevels(levels: unknown): GameTemplate["levels"] {
    if (!Array.isArray(levels) || levels.length === 0) {
      // Crear nivel por defecto
      return [
        {
          sb: 25,
          bb: 50,
          ante: 0,
          time: 20,
        },
      ];
    }

    return levels.map((level) => ({
      sb: Number(level.sb) || 25,
      bb: Number(level.bb) || 50,
      ante: Number(level.ante) || 0,
      time: Number(level.time) || 20,
    }));
  }

  // Validar estructuras de premios
  private static validatePrizeStructures(
    structures: unknown
  ): GameTemplate["prize_structures"] {
    if (!Array.isArray(structures)) {
      return [];
    }

    return structures.map((structure: unknown, index: number) => {
      const structureObj = structure as Record<string, unknown>;
      return {
        id: Number(structureObj.id) || index + 1,
        max_players: Number(structureObj.max_players) || 10,
        prizes: Array.isArray(structureObj.prizes)
          ? structureObj.prizes.map((prize: unknown, prizeIndex: number) => {
              const prizeObj = prize as Record<string, unknown>;
              return {
                id: Number(prizeObj.id) || prizeIndex + 1,
                percentaje: Number(prizeObj.percentaje) || 50,
              };
            })
          : [],
      };
    });
  }

  // Validar y recuperar juego actual
  static validateCurrentGame(data: unknown): DataValidationResult<Game> {
    const result: DataValidationResult<Game> = {
      isValid: true,
      data: null,
      errors: [],
      warnings: [],
      recovered: false,
    };

    try {
      if (!data || typeof data !== "object") {
        result.errors.push("Datos de juego inválidos");
        result.isValid = false;
        return result;
      }

      const gameObj = data as Record<string, unknown>;

      // Verificar campos críticos
      if (!gameObj.id || !gameObj.levels || !Array.isArray(gameObj.levels)) {
        result.errors.push("Estructura de juego corrupta");
        result.isValid = false;
        return result;
      }

      // Recuperar juego con valores seguros y todas las propiedades requeridas
      const recoveredGame: Game = {
        id: Number(gameObj.id) || 0,
        name: String(gameObj.name) || "Juego sin nombre",
        entry: Number(gameObj.entry) || 0,
        fee: Number(gameObj.fee) || 0,
        bubble: Number(gameObj.bubble) || 0,
        bounty: Number(gameObj.bounty) || 0,
        points: String(gameObj.points) || "1000",
        extrapot: Number(gameObj.extrapot) || 0,
        addon_price: Number(gameObj.addon_price) || 0,
        addon_points: Number(gameObj.addon_points) || 0,
        double_addon_price: Number(gameObj.double_addon_price) || 0,
        double_addon_points: Number(gameObj.double_addon_points) || 0,
        prize_structures: Array.isArray(gameObj.prize_structures)
          ? gameObj.prize_structures
          : [],
        current_level: gameObj.current_level || gameObj.levels[0],
        next_level: gameObj.next_level || gameObj.levels[1],
        levels: gameObj.levels,
        players: Number(gameObj.players) || 0,
        total_players: Number(gameObj.total_players) || 0,
        entries: Number(gameObj.entries) || 0,
        addons: Number(gameObj.addons) || 0,
        doubleaddons: Number(gameObj.doubleaddons) || 0,
        elapsed: Number(gameObj.elapsed) || 0,
        // Propiedades requeridas que faltaban
        playing: Boolean(gameObj.playing) || false,
        started: gameObj.started
          ? new Date(String(gameObj.started))
          : new Date(),
        final: gameObj.final
          ? (gameObj.final as Game["final"])
          : {
              total_pot: 0,
              fee: 0,
              players: 0,
              prizes: [],
            },
      };

      result.data = recoveredGame;
    } catch (error) {
      result.isValid = false;
      result.errors.push("Error crítico validando juego");
      ErrorHandler.getInstance().logError(
        error as Error,
        { gameData: data },
        "high"
      );
    }

    return result;
  }
}

// Utilidades para operaciones seguras con localStorage
export class SafeStorage {
  static getItem<T>(key: string, defaultValue: T): T {
    try {
      const item = localStorage.getItem(key);
      if (item === null) return defaultValue;
      return JSON.parse(item);
    } catch (error) {
      ErrorHandler.getInstance().logError(
        `Failed to get item from localStorage: ${key}`,
        { key, error },
        "low"
      );
      return defaultValue;
    }
  }

  static setItem(key: string, value: unknown): boolean {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      ErrorHandler.getInstance().logError(
        `Failed to set item in localStorage: ${key}`,
        { key, value, error },
        "medium"
      );
      return false;
    }
  }

  static removeItem(key: string): boolean {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      ErrorHandler.getInstance().logError(
        `Failed to remove item from localStorage: ${key}`,
        { key, error },
        "low"
      );
      return false;
    }
  }

  static clear(): boolean {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      ErrorHandler.getInstance().logError(
        "Failed to clear localStorage",
        { error },
        "medium"
      );
      return false;
    }
  }
}

// Hook para manejo de errores en componentes
export function useErrorHandler() {
  const errorHandler = ErrorHandler.getInstance();

  const handleError = (
    error: Error | string,
    context?: Record<string, unknown>,
    severity: ErrorLog["severity"] = "medium"
  ) => {
    return errorHandler.logError(error, context, severity);
  };

  const getErrors = (severity?: ErrorLog["severity"]) => {
    return errorHandler.getErrorLogs(severity);
  };

  const resolveError = (errorId: string) => {
    return errorHandler.resolveError(errorId);
  };

  return {
    handleError,
    getErrors,
    resolveError,
  };
}
