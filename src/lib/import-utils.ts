import { GameTemplate } from "@/types";
import { DataRecovery, SafeStorage, ErrorHandler } from "@/lib/error-handling";

// Tipos para importación
export interface ImportOptions {
  strategy: "replace" | "merge" | "skip_duplicates" | "rename_duplicates";
  validateStructure?: boolean;
  createBackup?: boolean;
}

export interface ImportResult {
  success: boolean;
  imported: number;
  skipped: number;
  errors: string[];
  warnings: string[];
  duplicates: Array<{
    imported: GameTemplate;
    existing: GameTemplate;
    action: "replaced" | "skipped" | "renamed";
  }>;
  backupCreated?: string;
}

export interface ImportConflict {
  importedTemplate: GameTemplate;
  existingTemplate: GameTemplate;
  conflictType: "id" | "name" | "both";
}

// Clase principal para importación
export class DataImporter {
  // Importar plantillas desde archivo JSON
  static async importFromFile(
    file: File,
    options: ImportOptions = { strategy: "merge" }
  ): Promise<ImportResult> {
    const result: ImportResult = {
      success: false,
      imported: 0,
      skipped: 0,
      errors: [],
      warnings: [],
      duplicates: [],
    };

    try {
      // Leer contenido del archivo
      const content = await this.readFileContent(file);

      // Parsear JSON
      let parsedData;
      try {
        parsedData = JSON.parse(content);
      } catch (error) {
        result.errors.push("El archivo no contiene JSON válido");
        return result;
      }

      // Importar datos parseados
      return await this.importFromData(parsedData, options);
    } catch (error) {
      result.errors.push(
        error instanceof Error ? error.message : "Error desconocido"
      );
      ErrorHandler.getInstance().logError(
        error as Error,
        { fileName: file.name, options },
        "medium"
      );
      return result;
    }
  }

  // Importar desde datos ya parseados
  static async importFromData(
    data: unknown,
    options: ImportOptions = { strategy: "merge" }
  ): Promise<ImportResult> {
    const result: ImportResult = {
      success: false,
      imported: 0,
      skipped: 0,
      errors: [],
      warnings: [],
      duplicates: [],
    };

    try {
      // Crear backup si se solicita
      if (options.createBackup) {
        const backupResult = await this.createBackup();
        if (backupResult.success) {
          result.backupCreated = backupResult.filename;
        } else {
          result.warnings.push("No se pudo crear backup automático");
        }
      }

      // Extraer plantillas del formato de datos
      const extractedTemplates = this.extractTemplatesFromData(data);
      if (extractedTemplates.length === 0) {
        result.errors.push(
          "No se encontraron plantillas válidas en el archivo"
        );
        return result;
      }

      // Validar plantillas si se solicita
      let validatedTemplates = extractedTemplates;
      if (options.validateStructure) {
        const validationResult =
          DataRecovery.validateGameTemplates(extractedTemplates);
        if (!validationResult.isValid || !validationResult.data) {
          result.errors.push("Las plantillas no pasaron la validación");
          result.errors.push(...validationResult.errors);
          return result;
        }
        validatedTemplates = validationResult.data;
        if (validationResult.warnings.length > 0) {
          result.warnings.push(...validationResult.warnings);
        }
      }

      // Obtener plantillas existentes
      const existingTemplates = SafeStorage.getItem<GameTemplate[]>(
        "gameTemplates",
        []
      );

      // Procesar importación según estrategia
      const processResult = await this.processImportStrategy(
        validatedTemplates,
        existingTemplates,
        options.strategy
      );

      result.imported = processResult.imported;
      result.skipped = processResult.skipped;
      result.duplicates = processResult.duplicates;
      result.warnings.push(...processResult.warnings);

      // Guardar plantillas actualizadas
      const saveSuccess = SafeStorage.setItem(
        "gameTemplates",
        processResult.finalTemplates
      );
      if (!saveSuccess) {
        result.errors.push("Error guardando las plantillas importadas");
        return result;
      }

      result.success = true;
    } catch (error) {
      result.errors.push("Error crítico durante la importación");
      ErrorHandler.getInstance().logError(
        error as Error,
        { data, options },
        "high"
      );
    }

    return result;
  }

  // Detectar conflictos antes de importar
  static detectConflicts(
    importTemplates: GameTemplate[],
    existingTemplates: GameTemplate[]
  ): ImportConflict[] {
    const conflicts: ImportConflict[] = [];

    importTemplates.forEach((importTemplate) => {
      const existingById = existingTemplates.find(
        (t) => t.id === importTemplate.id
      );
      const existingByName = existingTemplates.find(
        (t) => t.name === importTemplate.name
      );

      if (
        existingById &&
        existingByName &&
        existingById.id === existingByName.id
      ) {
        // Conflicto completo (mismo ID y nombre)
        conflicts.push({
          importedTemplate: importTemplate,
          existingTemplate: existingById,
          conflictType: "both",
        });
      } else if (existingById) {
        // Conflicto por ID
        conflicts.push({
          importedTemplate: importTemplate,
          existingTemplate: existingById,
          conflictType: "id",
        });
      } else if (existingByName) {
        // Conflicto por nombre
        conflicts.push({
          importedTemplate: importTemplate,
          existingTemplate: existingByName,
          conflictType: "name",
        });
      }
    });

    return conflicts;
  }

  // Leer contenido del archivo
  private static readFileContent(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          resolve(e.target.result as string);
        } else {
          reject(new Error("No se pudo leer el archivo"));
        }
      };
      reader.onerror = () => reject(new Error("Error leyendo el archivo"));
      reader.readAsText(file);
    });
  }

  // Extraer plantillas de diferentes formatos de datos
  private static extractTemplatesFromData(data: unknown): GameTemplate[] {
    try {
      // Formato directo: array de plantillas
      if (Array.isArray(data)) {
        return data;
      }

      // Formato con metadata (exportación completa)
      if (data && typeof data === "object") {
        const dataObj = data as Record<string, unknown>;

        // Formato de exportación con templates
        if (Array.isArray(dataObj.templates)) {
          return dataObj.templates;
        }

        // Formato de backup completo
        if (Array.isArray(dataObj.gameTemplates)) {
          return dataObj.gameTemplates;
        }

        // Formato con metadata wrapper
        if (dataObj.data && Array.isArray(dataObj.data)) {
          return dataObj.data;
        }
      }

      return [];
    } catch (error) {
      ErrorHandler.getInstance().logError(error as Error, { data }, "medium");
      return [];
    }
  }

  // Procesar estrategia de importación
  private static async processImportStrategy(
    importTemplates: GameTemplate[],
    existingTemplates: GameTemplate[],
    strategy: ImportOptions["strategy"]
  ) {
    const result = {
      imported: 0,
      skipped: 0,
      duplicates: [] as ImportResult["duplicates"],
      warnings: [] as string[],
      finalTemplates: [...existingTemplates],
    };

    const conflicts = this.detectConflicts(importTemplates, existingTemplates);

    for (const template of importTemplates) {
      const conflict = conflicts.find(
        (c) => c.importedTemplate.id === template.id
      );

      if (!conflict) {
        // No hay conflicto, agregar directamente
        result.finalTemplates.push(template);
        result.imported++;
      } else {
        // Hay conflicto, aplicar estrategia
        switch (strategy) {
          case "replace":
            // Reemplazar plantilla existente
            const replaceIndex = result.finalTemplates.findIndex(
              (t) => t.id === conflict.existingTemplate.id
            );
            if (replaceIndex !== -1) {
              result.finalTemplates[replaceIndex] = template;
              result.imported++;
              result.duplicates.push({
                imported: template,
                existing: conflict.existingTemplate,
                action: "replaced",
              });
            }
            break;

          case "skip_duplicates":
            // Omitir plantilla duplicada
            result.skipped++;
            result.duplicates.push({
              imported: template,
              existing: conflict.existingTemplate,
              action: "skipped",
            });
            break;

          case "rename_duplicates":
            // Renombrar plantilla duplicada
            const renamedTemplate = this.createRenamedTemplate(
              template,
              result.finalTemplates
            );
            result.finalTemplates.push(renamedTemplate);
            result.imported++;
            result.duplicates.push({
              imported: renamedTemplate,
              existing: conflict.existingTemplate,
              action: "renamed",
            });
            break;

          case "merge":
          default:
            // Estrategia inteligente: reemplazar si es el mismo nombre, renombrar si es diferente
            if (
              conflict.conflictType === "both" ||
              conflict.conflictType === "name"
            ) {
              // Mismo nombre, reemplazar
              const mergeIndex = result.finalTemplates.findIndex(
                (t) => t.name === template.name
              );
              if (mergeIndex !== -1) {
                result.finalTemplates[mergeIndex] = template;
                result.imported++;
                result.duplicates.push({
                  imported: template,
                  existing: conflict.existingTemplate,
                  action: "replaced",
                });
              }
            } else {
              // Solo conflicto de ID, renombrar
              const mergedTemplate = this.createRenamedTemplate(
                template,
                result.finalTemplates
              );
              result.finalTemplates.push(mergedTemplate);
              result.imported++;
              result.duplicates.push({
                imported: mergedTemplate,
                existing: conflict.existingTemplate,
                action: "renamed",
              });
            }
            break;
        }
      }
    }

    return result;
  }

  // Crear plantilla renombrada para evitar conflictos
  private static createRenamedTemplate(
    template: GameTemplate,
    existingTemplates: GameTemplate[]
  ): GameTemplate {
    // Generar nuevo ID único
    let newId = Math.max(...existingTemplates.map((t) => t.id), 0) + 1;
    while (existingTemplates.some((t) => t.id === newId)) {
      newId++;
    }

    // Generar nuevo nombre único
    let newName = template.name;
    let counter = 1;
    while (existingTemplates.some((t) => t.name === newName)) {
      newName = `${template.name} (${counter})`;
      counter++;
    }

    return {
      ...template,
      id: newId,
      name: newName,
    };
  }

  // Crear backup antes de importar (solo en localStorage, no descarga)
  private static async createBackup(): Promise<{
    success: boolean;
    filename?: string;
  }> {
    try {
      const templates = SafeStorage.getItem<GameTemplate[]>(
        "gameTemplates",
        []
      );
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      const backupKey = `backup-pre-import-${timestamp}`;

      const backupData = {
        metadata: {
          type: "pre-import-backup",
          created: new Date().toISOString(),
          reason: "Backup automático antes de importación",
          totalTemplates: templates.length,
          originalKey: "gameTemplates",
        },
        templates,
      };

      // Guardar backup en localStorage con clave única
      const success = SafeStorage.setItem(backupKey, backupData);

      if (success) {
        // Limpiar backups antiguos (mantener solo los últimos 5)
        this.cleanOldBackups();
        return { success: true, filename: backupKey };
      } else {
        return { success: false };
      }
    } catch (error) {
      ErrorHandler.getInstance().logError(
        error as Error,
        { context: "Creating pre-import backup" },
        "medium"
      );
      return { success: false };
    }
  }

  // Limpiar backups antiguos para evitar saturar localStorage
  private static cleanOldBackups(): void {
    try {
      const allKeys = Object.keys(localStorage);
      const backupKeys = allKeys
        .filter((key) => key.startsWith("backup-pre-import-"))
        .sort()
        .reverse(); // Más recientes primero

      // Mantener solo los últimos 5 backups
      if (backupKeys.length > 5) {
        const keysToDelete = backupKeys.slice(5);
        keysToDelete.forEach((key) => {
          SafeStorage.removeItem(key);
        });
      }
    } catch (error) {
      ErrorHandler.getInstance().logError(
        error as Error,
        { context: "Cleaning old backups" },
        "low"
      );
    }
  }
}

// Tipos para backups
interface BackupData {
  metadata: {
    type: string;
    created: string;
    reason: string;
    totalTemplates: number;
    originalKey: string;
  };
  templates: GameTemplate[];
}

interface BackupInfo {
  key: string;
  metadata: BackupData["metadata"];
  created: string;
  totalTemplates: number;
}

// Utilidades para manejo de backups
export class BackupManager {
  // Listar todos los backups disponibles
  static getAvailableBackups(): BackupInfo[] {
    try {
      const allKeys = Object.keys(localStorage);
      const backupKeys = allKeys.filter((key) =>
        key.startsWith("backup-pre-import-")
      );

      return backupKeys
        .map((key) => {
          const backup = SafeStorage.getItem<BackupData | null>(key, null);
          return {
            key,
            metadata: backup?.metadata || {
              type: "unknown",
              created: "Desconocido",
              reason: "Backup desconocido",
              totalTemplates: 0,
              originalKey: "gameTemplates",
            },
            created: backup?.metadata?.created || "Desconocido",
            totalTemplates: backup?.metadata?.totalTemplates || 0,
          };
        })
        .sort(
          (a, b) =>
            new Date(b.created).getTime() - new Date(a.created).getTime()
        );
    } catch (error) {
      ErrorHandler.getInstance().logError(
        error as Error,
        { context: "Getting available backups" },
        "low"
      );
      return [];
    }
  }

  // Restaurar desde un backup específico
  static restoreFromBackup(backupKey: string): boolean {
    try {
      const backup = SafeStorage.getItem<BackupData | null>(backupKey, null);
      if (!backup || !backup.templates) {
        return false;
      }

      const success = SafeStorage.setItem("gameTemplates", backup.templates);
      if (success) {
        ErrorHandler.getInstance().logError(
          `Restored from backup: ${backupKey}`,
          { backupKey, templatesCount: backup.templates.length },
          "low"
        );
      }
      return success;
    } catch (error) {
      ErrorHandler.getInstance().logError(
        error as Error,
        { context: "Restoring from backup", backupKey },
        "medium"
      );
      return false;
    }
  }

  // Eliminar un backup específico
  static deleteBackup(backupKey: string): boolean {
    return SafeStorage.removeItem(backupKey);
  }
}

// Hook para usar el importador en componentes
export function useDataImporter() {
  const importFromFile = async (file: File, options?: ImportOptions) => {
    return DataImporter.importFromFile(file, options);
  };

  const importFromData = async (data: unknown, options?: ImportOptions) => {
    return DataImporter.importFromData(data, options);
  };

  const detectConflicts = (
    importTemplates: GameTemplate[],
    existingTemplates: GameTemplate[]
  ) => {
    return DataImporter.detectConflicts(importTemplates, existingTemplates);
  };

  return {
    importFromFile,
    importFromData,
    detectConflicts,
  };
}
