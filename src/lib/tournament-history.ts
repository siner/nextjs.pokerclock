import { SafeStorage } from "@/lib/error-handling";
import { GameTemplate, Game } from "@/types";
import { TournamentHistory } from "@/lib/export-utils";

// Clase para gestionar el historial de torneos
export class TournamentHistoryManager {
  private static readonly STORAGE_KEY = "tournamentHistory";

  // Obtener todo el historial
  static getHistory(): TournamentHistory[] {
    return SafeStorage.getItem(this.STORAGE_KEY, []);
  }

  // Agregar un torneo completado al historial
  static addCompletedTournament(
    game: Game,
    template: GameTemplate,
    winners: Array<{ position: number; prize: number }> = []
  ): boolean {
    try {
      const history = this.getHistory();

      const tournamentRecord: TournamentHistory = {
        id: Date.now(), // Simple ID basado en timestamp
        templateId: template.id,
        templateName: template.name,
        startDate: new Date().toISOString(),
        endDate: new Date().toISOString(),
        duration: this.calculateDuration(game),
        totalPlayers: game.total_players,
        finalPlayers: game.players,
        totalPot: this.calculateTotalPot(game, template),
        winners,
        status: "completed",
      };

      history.push(tournamentRecord);
      return SafeStorage.setItem(this.STORAGE_KEY, history);
    } catch (error) {
      console.error("Error adding tournament to history:", error);
      return false;
    }
  }

  // Agregar un torneo abandonado al historial
  static addAbandonedTournament(game: Game, template: GameTemplate): boolean {
    try {
      const history = this.getHistory();

      const tournamentRecord: TournamentHistory = {
        id: Date.now(),
        templateId: template.id,
        templateName: template.name,
        startDate: new Date().toISOString(),
        duration: this.calculateDuration(game),
        totalPlayers: game.total_players,
        finalPlayers: game.players,
        totalPot: this.calculateTotalPot(game, template),
        winners: [],
        status: "abandoned",
      };

      history.push(tournamentRecord);
      return SafeStorage.setItem(this.STORAGE_KEY, history);
    } catch (error) {
      console.error("Error adding abandoned tournament to history:", error);
      return false;
    }
  }

  // Eliminar un registro del historial
  static removeFromHistory(tournamentId: number): boolean {
    try {
      const history = this.getHistory();
      const filteredHistory = history.filter((t) => t.id !== tournamentId);
      return SafeStorage.setItem(this.STORAGE_KEY, filteredHistory);
    } catch (error) {
      console.error("Error removing tournament from history:", error);
      return false;
    }
  }

  // Limpiar todo el historial
  static clearHistory(): boolean {
    try {
      return SafeStorage.setItem(this.STORAGE_KEY, []);
    } catch (error) {
      console.error("Error clearing tournament history:", error);
      return false;
    }
  }

  // Obtener estadísticas del historial
  static getStatistics() {
    const history = this.getHistory();
    const completedTournaments = history.filter(
      (t) => t.status === "completed"
    );

    if (completedTournaments.length === 0) {
      return {
        totalTournaments: history.length,
        completedTournaments: 0,
        abandonedTournaments: history.filter((t) => t.status === "abandoned")
          .length,
        averageDuration: 0,
        averagePlayers: 0,
        totalPrizesMoney: 0,
        mostUsedTemplate: null,
      };
    }

    const averageDuration =
      completedTournaments.reduce((sum, t) => sum + t.duration, 0) /
      completedTournaments.length;
    const averagePlayers =
      completedTournaments.reduce((sum, t) => sum + t.totalPlayers, 0) /
      completedTournaments.length;
    const totalPrizesMoney = completedTournaments.reduce(
      (sum, t) => sum + t.totalPot,
      0
    );

    // Encontrar plantilla más usada
    const templateUsage = new Map<number, { count: number; name: string }>();
    history.forEach((tournament) => {
      const current = templateUsage.get(tournament.templateId) || {
        count: 0,
        name: tournament.templateName,
      };
      templateUsage.set(tournament.templateId, {
        count: current.count + 1,
        name: tournament.templateName,
      });
    });

    let mostUsedTemplate = null;
    if (templateUsage.size > 0) {
      const [templateId, data] = Array.from(templateUsage.entries()).sort(
        (a, b) => b[1].count - a[1].count
      )[0];

      mostUsedTemplate = {
        id: templateId,
        name: data.name,
        usageCount: data.count,
      };
    }

    return {
      totalTournaments: history.length,
      completedTournaments: completedTournaments.length,
      abandonedTournaments: history.filter((t) => t.status === "abandoned")
        .length,
      averageDuration: Math.round(averageDuration),
      averagePlayers: Math.round(averagePlayers),
      totalPrizesMoney,
      mostUsedTemplate,
    };
  }

  // Obtener historial filtrado por plantilla
  static getHistoryByTemplate(templateId: number): TournamentHistory[] {
    const history = this.getHistory();
    return history.filter((t) => t.templateId === templateId);
  }

  // Obtener historial filtrado por rango de fechas
  static getHistoryByDateRange(
    startDate: Date,
    endDate: Date
  ): TournamentHistory[] {
    const history = this.getHistory();
    return history.filter((tournament) => {
      const tournamentDate = new Date(tournament.startDate);
      return tournamentDate >= startDate && tournamentDate <= endDate;
    });
  }

  // Calcular duración del torneo en minutos
  private static calculateDuration(game: Game): number {
    // Si el juego tiene tiempo transcurrido, usarlo
    if (game.elapsed) {
      return Math.floor(game.elapsed / 60); // Convertir segundos a minutos
    }

    // Si no, calcular basado en el nivel actual
    // Por simplicidad, asumimos 15 minutos por nivel como estimación
    return 15; // Valor por defecto
  }

  // Calcular pot total
  private static calculateTotalPot(game: Game, template: GameTemplate): number {
    const entryPot = game.total_players * template.entry;
    const rebuyPot = (game.entries - game.total_players) * template.entry; // Rebuys = entradas extra
    const addonPot = (game.addons || 0) * (template.addon_price || 0);
    const doubleAddonPot =
      (game.doubleaddons || 0) * (template.double_addon_price || 0);
    const extraPot = template.extrapot || 0;

    return entryPot + rebuyPot + addonPot + doubleAddonPot + extraPot;
  }
}

// Hook para usar el historial en componentes
export function useTournamentHistory() {
  const getHistory = () => TournamentHistoryManager.getHistory();

  const addCompleted = (
    game: Game,
    template: GameTemplate,
    winners: Array<{ position: number; prize: number }> = []
  ) => {
    return TournamentHistoryManager.addCompletedTournament(
      game,
      template,
      winners
    );
  };

  const addAbandoned = (game: Game, template: GameTemplate) => {
    return TournamentHistoryManager.addAbandonedTournament(game, template);
  };

  const removeFromHistory = (tournamentId: number) => {
    return TournamentHistoryManager.removeFromHistory(tournamentId);
  };

  const clearHistory = () => {
    return TournamentHistoryManager.clearHistory();
  };

  const getStatistics = () => {
    return TournamentHistoryManager.getStatistics();
  };

  const getByTemplate = (templateId: number) => {
    return TournamentHistoryManager.getHistoryByTemplate(templateId);
  };

  const getByDateRange = (startDate: Date, endDate: Date) => {
    return TournamentHistoryManager.getHistoryByDateRange(startDate, endDate);
  };

  return {
    getHistory,
    addCompleted,
    addAbandoned,
    removeFromHistory,
    clearHistory,
    getStatistics,
    getByTemplate,
    getByDateRange,
  };
}
