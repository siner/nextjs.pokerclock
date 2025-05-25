import { GameTemplate, Game } from "@/types";

// Tipos para exportación
export interface ExportOptions {
  format: "json" | "csv";
  includeMetadata?: boolean;
  dateRange?: {
    start: Date;
    end: Date;
  };
}

export interface ExportResult {
  success: boolean;
  filename: string;
  error?: string;
}

export interface TournamentHistory {
  id: number;
  templateId: number;
  templateName: string;
  startDate: string;
  endDate?: string;
  duration: number; // en minutos
  totalPlayers: number;
  finalPlayers: number;
  totalPot: number;
  winners: Array<{
    position: number;
    prize: number;
  }>;
  status: "completed" | "abandoned" | "in_progress";
}

export interface ExportStatistics {
  totalTemplates: number;
  totalTournaments: number;
  averageDuration: number;
  averagePlayers: number;
  totalPrizesMoney: number;
  mostUsedTemplate: {
    id: number;
    name: string;
    usageCount: number;
  };
  exportDate: string;
}

// Clase principal para exportación
export class DataExporter {
  // Exportar plantillas de juego
  static async exportGameTemplates(
    templates: GameTemplate[],
    options: ExportOptions = { format: "json" }
  ): Promise<ExportResult> {
    try {
      const timestamp = new Date().toISOString().split("T")[0];
      const filename = `plantillas-poker-${timestamp}.${options.format}`;

      let content: string;
      let mimeType: string;

      if (options.format === "json") {
        const exportData = {
          metadata: options.includeMetadata
            ? {
                exportDate: new Date().toISOString(),
                version: "1.0",
                totalTemplates: templates.length,
                application: "Poker Clock",
              }
            : undefined,
          templates: templates,
        };

        content = JSON.stringify(exportData, null, 2);
        mimeType = "application/json";
      } else {
        // CSV format
        content = this.convertTemplatesToCSV(templates);
        mimeType = "text/csv";
      }

      this.downloadFile(content, filename, mimeType);

      return {
        success: true,
        filename,
      };
    } catch (error) {
      return {
        success: false,
        filename: "",
        error: error instanceof Error ? error.message : "Error desconocido",
      };
    }
  }

  // Exportar historial de torneos
  static async exportTournamentHistory(
    history: TournamentHistory[],
    options: ExportOptions = { format: "json" }
  ): Promise<ExportResult> {
    try {
      const timestamp = new Date().toISOString().split("T")[0];
      const filename = `historial-torneos-${timestamp}.${options.format}`;

      // Filtrar por rango de fechas si se especifica
      let filteredHistory = history;
      if (options.dateRange) {
        filteredHistory = history.filter((tournament) => {
          const tournamentDate = new Date(tournament.startDate);
          return (
            tournamentDate >= options.dateRange!.start &&
            tournamentDate <= options.dateRange!.end
          );
        });
      }

      let content: string;
      let mimeType: string;

      if (options.format === "json") {
        const exportData = {
          metadata: options.includeMetadata
            ? {
                exportDate: new Date().toISOString(),
                version: "1.0",
                totalTournaments: filteredHistory.length,
                dateRange: options.dateRange,
                application: "Poker Clock",
              }
            : undefined,
          tournaments: filteredHistory,
        };

        content = JSON.stringify(exportData, null, 2);
        mimeType = "application/json";
      } else {
        // CSV format
        content = this.convertTournamentHistoryToCSV(filteredHistory);
        mimeType = "text/csv";
      }

      this.downloadFile(content, filename, mimeType);

      return {
        success: true,
        filename,
      };
    } catch (error) {
      return {
        success: false,
        filename: "",
        error: error instanceof Error ? error.message : "Error desconocido",
      };
    }
  }

  // Exportar estadísticas completas
  static async exportStatistics(
    templates: GameTemplate[],
    history: TournamentHistory[],
    options: ExportOptions = { format: "json" }
  ): Promise<ExportResult> {
    try {
      const timestamp = new Date().toISOString().split("T")[0];
      const filename = `estadisticas-poker-${timestamp}.${options.format}`;

      const statistics = this.calculateStatistics(templates, history);

      let content: string;
      let mimeType: string;

      if (options.format === "json") {
        content = JSON.stringify(statistics, null, 2);
        mimeType = "application/json";
      } else {
        // CSV format
        content = this.convertStatisticsToCSV(statistics);
        mimeType = "text/csv";
      }

      this.downloadFile(content, filename, mimeType);

      return {
        success: true,
        filename,
      };
    } catch (error) {
      return {
        success: false,
        filename: "",
        error: error instanceof Error ? error.message : "Error desconocido",
      };
    }
  }

  // Exportar todo (plantillas + historial + estadísticas)
  static async exportAll(
    templates: GameTemplate[],
    history: TournamentHistory[],
    options: ExportOptions = { format: "json" }
  ): Promise<ExportResult> {
    try {
      const timestamp = new Date().toISOString().split("T")[0];
      const filename = `backup-completo-poker-${timestamp}.${options.format}`;

      const statistics = this.calculateStatistics(templates, history);

      const exportData = {
        metadata: {
          exportDate: new Date().toISOString(),
          version: "1.0",
          application: "Poker Clock",
          totalTemplates: templates.length,
          totalTournaments: history.length,
        },
        templates,
        tournaments: history,
        statistics,
      };

      let content: string;
      let mimeType: string;

      if (options.format === "json") {
        content = JSON.stringify(exportData, null, 2);
        mimeType = "application/json";
      } else {
        // Para CSV, crear un ZIP con múltiples archivos sería ideal
        // Por simplicidad, exportamos las plantillas en CSV
        content = this.convertTemplatesToCSV(templates);
        mimeType = "text/csv";
      }

      this.downloadFile(content, filename, mimeType);

      return {
        success: true,
        filename,
      };
    } catch (error) {
      return {
        success: false,
        filename: "",
        error: error instanceof Error ? error.message : "Error desconocido",
      };
    }
  }

  // Convertir plantillas a CSV
  private static convertTemplatesToCSV(templates: GameTemplate[]): string {
    if (templates.length === 0) {
      return "No hay plantillas para exportar";
    }

    const headers = [
      "ID",
      "Nombre",
      "Buy-in",
      "Comisión (%)",
      "Burbuja",
      "Puntos",
      "Pot Extra",
      "Precio Addon",
      "Puntos Addon",
      "Precio Doble Addon",
      "Puntos Doble Addon",
      "Bono Puntualidad",
      "Niveles",
      "Duración Total (min)",
      "Estructuras de Premios",
    ];

    const rows = templates.map((template) => {
      const totalDuration = template.levels.reduce(
        (total, level) => total + level.time,
        0
      );

      const levelsInfo = template.levels
        .map(
          (level) => `${level.sb}/${level.bb}/${level.ante}/${level.time}min`
        )
        .join("; ");

      const prizeStructuresInfo = template.prize_structures
        .map(
          (structure) =>
            `${structure.max_players}p:${structure.prizes
              .map((p) => `${p.percentaje}%`)
              .join(",")}`
        )
        .join("; ");

      return [
        template.id,
        `"${template.name}"`,
        template.entry,
        template.fee,
        template.bubble,
        template.points,
        template.extrapot,
        template.addon_price,
        template.addon_points,
        template.double_addon_price,
        template.double_addon_points,
        template.punctuality_bonus || 0,
        template.levels.length,
        totalDuration,
        `"${levelsInfo}"`,
        `"${prizeStructuresInfo}"`,
      ];
    });

    return [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");
  }

  // Convertir historial de torneos a CSV
  private static convertTournamentHistoryToCSV(
    history: TournamentHistory[]
  ): string {
    if (history.length === 0) {
      return "No hay historial de torneos para exportar";
    }

    const headers = [
      "ID Torneo",
      "ID Plantilla",
      "Nombre Plantilla",
      "Fecha Inicio",
      "Fecha Fin",
      "Duración (min)",
      "Jugadores Totales",
      "Jugadores Finales",
      "Pot Total",
      "Estado",
      "Ganadores",
    ];

    const rows = history.map((tournament) => {
      const winnersInfo = tournament.winners
        .map((winner) => `${winner.position}:€${winner.prize}`)
        .join("; ");

      return [
        tournament.id,
        tournament.templateId,
        `"${tournament.templateName}"`,
        tournament.startDate,
        tournament.endDate || "",
        tournament.duration,
        tournament.totalPlayers,
        tournament.finalPlayers,
        tournament.totalPot,
        tournament.status,
        `"${winnersInfo}"`,
      ];
    });

    return [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");
  }

  // Convertir estadísticas a CSV
  private static convertStatisticsToCSV(statistics: ExportStatistics): string {
    const data = [
      ["Métrica", "Valor"],
      ["Total Plantillas", statistics.totalTemplates],
      ["Total Torneos", statistics.totalTournaments],
      ["Duración Promedio (min)", statistics.averageDuration],
      ["Jugadores Promedio", statistics.averagePlayers],
      ["Total Premios (€)", statistics.totalPrizesMoney],
      ["Plantilla Más Usada", statistics.mostUsedTemplate.name],
      ["Usos de Plantilla Más Usada", statistics.mostUsedTemplate.usageCount],
      ["Fecha de Exportación", statistics.exportDate],
    ];

    return data.map((row) => row.join(",")).join("\n");
  }

  // Calcular estadísticas
  private static calculateStatistics(
    templates: GameTemplate[],
    history: TournamentHistory[]
  ): ExportStatistics {
    const completedTournaments = history.filter(
      (t) => t.status === "completed"
    );

    const averageDuration =
      completedTournaments.length > 0
        ? completedTournaments.reduce((sum, t) => sum + t.duration, 0) /
          completedTournaments.length
        : 0;

    const averagePlayers =
      completedTournaments.length > 0
        ? completedTournaments.reduce((sum, t) => sum + t.totalPlayers, 0) /
          completedTournaments.length
        : 0;

    const totalPrizesMoney = completedTournaments.reduce(
      (sum, t) => sum + t.totalPot,
      0
    );

    // Encontrar plantilla más usada
    const templateUsage = new Map<number, number>();
    history.forEach((tournament) => {
      const count = templateUsage.get(tournament.templateId) || 0;
      templateUsage.set(tournament.templateId, count + 1);
    });

    let mostUsedTemplate = {
      id: 0,
      name: "Ninguna",
      usageCount: 0,
    };

    if (templateUsage.size > 0) {
      const [mostUsedId, usageCount] = Array.from(templateUsage.entries()).sort(
        (a, b) => b[1] - a[1]
      )[0];

      const template = templates.find((t) => t.id === mostUsedId);
      if (template) {
        mostUsedTemplate = {
          id: mostUsedId,
          name: template.name,
          usageCount,
        };
      }
    }

    return {
      totalTemplates: templates.length,
      totalTournaments: history.length,
      averageDuration: Math.round(averageDuration),
      averagePlayers: Math.round(averagePlayers),
      totalPrizesMoney,
      mostUsedTemplate,
      exportDate: new Date().toISOString(),
    };
  }

  // Descargar archivo
  private static downloadFile(
    content: string,
    filename: string,
    mimeType: string
  ): void {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}

// Hook para usar el exportador en componentes
export function useDataExporter() {
  const exportTemplates = async (
    templates: GameTemplate[],
    options?: ExportOptions
  ) => {
    return DataExporter.exportGameTemplates(templates, options);
  };

  const exportHistory = async (
    history: TournamentHistory[],
    options?: ExportOptions
  ) => {
    return DataExporter.exportTournamentHistory(history, options);
  };

  const exportStatistics = async (
    templates: GameTemplate[],
    history: TournamentHistory[],
    options?: ExportOptions
  ) => {
    return DataExporter.exportStatistics(templates, history, options);
  };

  const exportAll = async (
    templates: GameTemplate[],
    history: TournamentHistory[],
    options?: ExportOptions
  ) => {
    return DataExporter.exportAll(templates, history, options);
  };

  return {
    exportTemplates,
    exportHistory,
    exportStatistics,
    exportAll,
  };
}
