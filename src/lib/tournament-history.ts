import { TournamentHistory, TournamentStats, Game, Winner } from "@/types";
import { SafeStorage } from "./error-handling";

const HISTORY_STORAGE_KEY = "tournament_history";

export class TournamentHistoryManager {
  /**
   * Guarda un torneo completado en el historial
   */
  static saveTournament(
    game: Game,
    winners: Winner[],
    finalLevel: { sb: number; bb: number; ante: number },
    durationMinutes: number
  ): void {
    try {
      const history = this.getHistory();

      const tournament: TournamentHistory = {
        id: Date.now(), // Usar timestamp como ID único
        name: game.name,
        template_name: game.name, // Asumimos que el nombre del juego es el de la plantilla
        date_started: game.started,
        date_completed: new Date(),
        duration_minutes: durationMinutes,
        total_players: game.total_players,
        entries: game.entries,
        addons: game.addons,
        doubleaddons: game.doubleaddons,
        total_pot: game.final.total_pot,
        fee: game.final.fee,
        real_pot: game.final.total_pot - game.final.fee,
        extrapot: game.extrapot || 0,
        bounty: game.bounty,
        punctuality_bonus: game.punctuality_bonus,
        bubble: game.bubble,
        winners,
        final_level: finalLevel,
        statistics: {
          avg_stack:
            game.total_players > 0
              ? (game.entries * parseInt(game.points)) / game.total_players
              : 0,
          levels_played: this.calculateLevelsPlayed(game, durationMinutes),
          addon_percentage:
            game.entries > 0 ? (game.addons / game.entries) * 100 : 0,
          double_addon_percentage:
            game.entries > 0 ? (game.doubleaddons / game.entries) * 100 : 0,
        },
      };

      history.push(tournament);
      SafeStorage.setItem(HISTORY_STORAGE_KEY, history);
    } catch (error) {
      console.error("Error saving tournament to history:", error);
      throw new Error("No se pudo guardar el torneo en el historial");
    }
  }

  /**
   * Obtiene todo el historial de torneos
   */
  static getHistory(): TournamentHistory[] {
    try {
      const history = SafeStorage.getItem(HISTORY_STORAGE_KEY, []);
      return Array.isArray(history) ? history : [];
    } catch (error) {
      console.error("Error loading tournament history:", error);
      return [];
    }
  }

  /**
   * Filtra el historial por criterios específicos
   */
  static filterHistory(filters: {
    dateFrom?: Date;
    dateTo?: Date;
    templateName?: string;
    minPlayers?: number;
    maxPlayers?: number;
  }): TournamentHistory[] {
    const history = this.getHistory();

    return history.filter((tournament) => {
      if (
        filters.dateFrom &&
        new Date(tournament.date_completed) < filters.dateFrom
      ) {
        return false;
      }
      if (
        filters.dateTo &&
        new Date(tournament.date_completed) > filters.dateTo
      ) {
        return false;
      }
      if (
        filters.templateName &&
        !tournament.template_name
          .toLowerCase()
          .includes(filters.templateName.toLowerCase())
      ) {
        return false;
      }
      if (filters.minPlayers && tournament.total_players < filters.minPlayers) {
        return false;
      }
      if (filters.maxPlayers && tournament.total_players > filters.maxPlayers) {
        return false;
      }
      return true;
    });
  }

  /**
   * Calcula estadísticas generales del historial
   */
  static calculateStats(): TournamentStats {
    const history = this.getHistory();

    if (history.length === 0) {
      return {
        total_tournaments: 0,
        total_players: 0,
        total_prize_pool: 0,
        avg_duration: 0,
        avg_players_per_tournament: 0,
        most_popular_template: "N/A",
        biggest_tournament: {
          name: "N/A",
          players: 0,
          prize_pool: 0,
        },
        recent_activity: {
          tournaments_this_month: 0,
          tournaments_this_week: 0,
        },
      };
    }

    const totalPlayers = history.reduce((sum, t) => sum + t.total_players, 0);
    const totalPrizePool = history.reduce((sum, t) => sum + t.real_pot, 0);
    const totalDuration = history.reduce(
      (sum, t) => sum + t.duration_minutes,
      0
    );

    // Plantilla más popular
    const templateCounts = history.reduce(
      (acc, t) => {
        acc[t.template_name] = (acc[t.template_name] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    const mostPopularTemplate =
      Object.entries(templateCounts).sort(([, a], [, b]) => b - a)[0]?.[0] ||
      "N/A";

    // Torneo más grande
    const biggestTournament = history.reduce(
      (biggest, current) => {
        return current.real_pot > biggest.prize_pool
          ? {
              name: current.name,
              players: current.total_players,
              prize_pool: current.real_pot,
            }
          : biggest;
      },
      { name: "N/A", players: 0, prize_pool: 0 }
    );

    // Actividad reciente
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const tournamentsThisWeek = history.filter(
      (t) => new Date(t.date_completed) >= oneWeekAgo
    ).length;

    const tournamentsThisMonth = history.filter(
      (t) => new Date(t.date_completed) >= oneMonthAgo
    ).length;

    return {
      total_tournaments: history.length,
      total_players: totalPlayers,
      total_prize_pool: totalPrizePool,
      avg_duration: totalDuration / history.length,
      avg_players_per_tournament: totalPlayers / history.length,
      most_popular_template: mostPopularTemplate,
      biggest_tournament: biggestTournament,
      recent_activity: {
        tournaments_this_month: tournamentsThisMonth,
        tournaments_this_week: tournamentsThisWeek,
      },
    };
  }

  /**
   * Elimina un torneo del historial
   */
  static deleteTournament(tournamentId: number): void {
    try {
      const history = this.getHistory();
      const filteredHistory = history.filter((t) => t.id !== tournamentId);
      SafeStorage.setItem(HISTORY_STORAGE_KEY, filteredHistory);
    } catch (error) {
      console.error("Error deleting tournament from history:", error);
      throw new Error("No se pudo eliminar el torneo del historial");
    }
  }

  /**
   * Limpia todo el historial
   */
  static clearHistory(): void {
    try {
      SafeStorage.setItem(HISTORY_STORAGE_KEY, []);
    } catch (error) {
      console.error("Error clearing tournament history:", error);
      throw new Error("No se pudo limpiar el historial");
    }
  }

  /**
   * Exporta el historial en formato JSON
   */
  static exportHistory(): string {
    const history = this.getHistory();
    return JSON.stringify(history, null, 2);
  }

  /**
   * Importa historial desde JSON
   */
  static importHistory(jsonData: string): void {
    try {
      const importedHistory = JSON.parse(jsonData);

      if (!Array.isArray(importedHistory)) {
        throw new Error("El formato del historial no es válido");
      }

      // Validar estructura básica
      for (const tournament of importedHistory) {
        if (!tournament.id || !tournament.name || !tournament.date_completed) {
          throw new Error("El historial contiene datos incompletos");
        }
      }

      const currentHistory = this.getHistory();
      const mergedHistory = [...currentHistory, ...importedHistory];

      // Eliminar duplicados por ID
      const uniqueHistory = mergedHistory.filter(
        (tournament, index, self) =>
          index === self.findIndex((t) => t.id === tournament.id)
      );

      SafeStorage.setItem(HISTORY_STORAGE_KEY, uniqueHistory);
    } catch (error) {
      console.error("Error importing tournament history:", error);
      throw new Error("No se pudo importar el historial");
    }
  }

  /**
   * Calcula el número de niveles jugados basado en la duración
   */
  private static calculateLevelsPlayed(
    game: Game,
    durationMinutes: number
  ): number {
    let totalTime = 0;
    let levelsPlayed = 0;

    for (const level of game.levels) {
      totalTime += level.time;
      levelsPlayed++;

      if (totalTime >= durationMinutes) {
        break;
      }
    }

    return levelsPlayed;
  }
}

// Hook para usar el historial en componentes
export function useTournamentHistory() {
  const getHistory = () => TournamentHistoryManager.getHistory();
  const getStats = () => TournamentHistoryManager.calculateStats();
  const filterHistory = (
    filters: Parameters<typeof TournamentHistoryManager.filterHistory>[0]
  ) => TournamentHistoryManager.filterHistory(filters);
  const deleteTournament = (id: number) =>
    TournamentHistoryManager.deleteTournament(id);
  const clearHistory = () => TournamentHistoryManager.clearHistory();
  const exportHistory = () => TournamentHistoryManager.exportHistory();
  const importHistory = (data: string) =>
    TournamentHistoryManager.importHistory(data);

  return {
    getHistory,
    getStats,
    filterHistory,
    deleteTournament,
    clearHistory,
    exportHistory,
    importHistory,
  };
}
