"use client";

import { useState, useEffect } from "react";
import { TournamentHistory, TournamentStats } from "@/types";
import { useTournamentHistory } from "@/lib/tournament-history";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { LoadingOverlay } from "@/components/ui/loading";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import {
  TrophyIcon,
  UsersIcon,
  DollarSignIcon,
  ClockIcon,
  DownloadIcon,
  UploadIcon,
  TrashIcon,
  FilterIcon,
  EyeIcon,
  ArrowLeftIcon,
  HomeIcon,
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export default function HistoryPageClient() {
  const { toast } = useToast();
  const {
    getHistory,
    getStats,
    filterHistory,
    deleteTournament,
    clearHistory,
    exportHistory,
    importHistory,
  } = useTournamentHistory();

  const [history, setHistory] = useState<TournamentHistory[]>([]);
  const [filteredHistory, setFilteredHistory] = useState<TournamentHistory[]>(
    []
  );
  const [stats, setStats] = useState<TournamentStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTournament, setSelectedTournament] =
    useState<TournamentHistory | null>(null);

  // Filtros
  const [filters, setFilters] = useState({
    search: "",
    dateFrom: "",
    dateTo: "",
    minPlayers: "",
    maxPlayers: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [history, filters]);

  const loadData = () => {
    setIsLoading(true);
    try {
      const historyData = getHistory();
      const statsData = getStats();

      setHistory(historyData);
      setStats(statsData);
    } catch (error) {
      console.error("Error loading history:", error);
      toast({
        title: "Error",
        description: "No se pudo cargar el historial de torneos.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = history;

    // Filtro de búsqueda por nombre
    if (filters.search) {
      filtered = filtered.filter(
        (t) =>
          t.name.toLowerCase().includes(filters.search.toLowerCase()) ||
          t.template_name.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    // Filtros de fecha y jugadores
    const filterCriteria: {
      dateFrom?: Date;
      dateTo?: Date;
      minPlayers?: number;
      maxPlayers?: number;
    } = {};
    if (filters.dateFrom) filterCriteria.dateFrom = new Date(filters.dateFrom);
    if (filters.dateTo) filterCriteria.dateTo = new Date(filters.dateTo);
    if (filters.minPlayers)
      filterCriteria.minPlayers = parseInt(filters.minPlayers);
    if (filters.maxPlayers)
      filterCriteria.maxPlayers = parseInt(filters.maxPlayers);

    if (Object.keys(filterCriteria).length > 0) {
      filtered = filterHistory(filterCriteria);
    }

    setFilteredHistory(filtered);
  };

  const handleDeleteTournament = async (tournamentId: number) => {
    try {
      deleteTournament(tournamentId);
      loadData();
      toast({
        title: "Torneo eliminado",
        description: "El torneo se eliminó correctamente del historial.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar el torneo.",
        variant: "destructive",
      });
    }
  };

  const handleClearHistory = async () => {
    try {
      clearHistory();
      loadData();
      toast({
        title: "Historial limpiado",
        description: "Se eliminó todo el historial de torneos.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo limpiar el historial.",
        variant: "destructive",
      });
    }
  };

  const handleExport = () => {
    try {
      const data = exportHistory();
      const blob = new Blob([data], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `historial-torneos-${format(new Date(), "yyyy-MM-dd")}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Historial exportado",
        description: "El archivo se descargó correctamente.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo exportar el historial.",
        variant: "destructive",
      });
    }
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        importHistory(content);
        loadData();
        toast({
          title: "Historial importado",
          description: "Los datos se importaron correctamente.",
        });
      } catch (error) {
        toast({
          title: "Error",
          description:
            "No se pudo importar el historial. Verifica el formato del archivo.",
          variant: "destructive",
        });
      }
    };
    reader.readAsText(file);
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString("es-ES", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 0,
    });
  };

  if (isLoading) {
    return (
      <LoadingOverlay isLoading={true} text="Cargando historial...">
        <div />
      </LoadingOverlay>
    );
  }

  return (
    <div className="container mx-auto space-y-6 p-6">
      {/* Header con navegación */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        {/* Botones de navegación */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => (window.location.href = "/")}
            className="flex items-center gap-2 border-slate-300 text-slate-600 hover:bg-slate-100 dark:border-slate-600 dark:text-slate-400 dark:hover:bg-slate-800"
            title="Ir al inicio"
          >
            <HomeIcon className="size-4" />
            <span className="hidden sm:inline">Inicio</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => (window.location.href = "/gametemplates")}
            className="flex items-center gap-2 border-slate-300 text-slate-600 hover:bg-slate-100 dark:border-slate-600 dark:text-slate-400 dark:hover:bg-slate-800"
            title="Ir a plantillas"
          >
            <ArrowLeftIcon className="size-4" />
            <span className="hidden sm:inline">Plantillas</span>
          </Button>
        </div>

        {/* Título */}
        <div className="flex-1 text-center lg:text-left">
          <h1 className="text-2xl font-bold sm:text-3xl">
            Historial de Torneos
          </h1>
          <p className="text-sm text-muted-foreground sm:text-base">
            Consulta y gestiona el historial completo de torneos
          </p>
        </div>

        {/* Controles de gestión */}
        <div className="flex flex-wrap gap-2">
          <Button onClick={handleExport} variant="outline" size="sm">
            <DownloadIcon className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Exportar</span>
            <span className="sm:hidden">Export</span>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <label htmlFor="import-file" className="cursor-pointer">
              <UploadIcon className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Importar</span>
              <span className="sm:hidden">Import</span>
              <input
                id="import-file"
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
              />
            </label>
          </Button>
          <ConfirmationDialog
            title="Limpiar historial"
            description="¿Estás seguro de que quieres eliminar todo el historial? Esta acción no se puede deshacer."
            onConfirm={handleClearHistory}
          >
            <Button variant="destructive" size="sm">
              <TrashIcon className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Limpiar</span>
              <span className="sm:hidden">Clear</span>
            </Button>
          </ConfirmationDialog>
        </div>
      </div>

      {/* Estadísticas */}
      {stats && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Torneos
              </CardTitle>
              <TrophyIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.total_tournaments}
              </div>
              <p className="text-xs text-muted-foreground">
                {stats.recent_activity.tournaments_this_month} este mes
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Jugadores
              </CardTitle>
              <UsersIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total_players}</div>
              <p className="text-xs text-muted-foreground">
                Promedio: {Math.round(stats.avg_players_per_tournament)} por
                torneo
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Bote Total</CardTitle>
              <DollarSignIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(stats.total_prize_pool)}
              </div>
              <p className="text-xs text-muted-foreground">
                Torneo más grande:{" "}
                {formatCurrency(stats.biggest_tournament.prize_pool)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Duración Promedio
              </CardTitle>
              <ClockIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatDuration(Math.round(stats.avg_duration))}
              </div>
              <p className="text-xs text-muted-foreground">
                Plantilla popular: {stats.most_popular_template}
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FilterIcon className="h-4 w-4" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-5">
            <Input
              placeholder="Buscar por nombre..."
              value={filters.search}
              onChange={(e) =>
                setFilters({ ...filters, search: e.target.value })
              }
            />
            <Input
              type="date"
              placeholder="Fecha desde"
              value={filters.dateFrom}
              onChange={(e) =>
                setFilters({ ...filters, dateFrom: e.target.value })
              }
            />
            <Input
              type="date"
              placeholder="Fecha hasta"
              value={filters.dateTo}
              onChange={(e) =>
                setFilters({ ...filters, dateTo: e.target.value })
              }
            />
            <Input
              type="number"
              placeholder="Min. jugadores"
              value={filters.minPlayers}
              onChange={(e) =>
                setFilters({ ...filters, minPlayers: e.target.value })
              }
            />
            <Input
              type="number"
              placeholder="Max. jugadores"
              value={filters.maxPlayers}
              onChange={(e) =>
                setFilters({ ...filters, maxPlayers: e.target.value })
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Tabla de historial */}
      <Card>
        <CardHeader>
          <CardTitle>Historial de Torneos ({filteredHistory.length})</CardTitle>
          <CardDescription>
            Lista completa de torneos jugados con detalles y estadísticas
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredHistory.length === 0 ? (
            <div className="py-8 text-center">
              <TrophyIcon className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="mb-2 text-lg font-medium">
                No hay torneos en el historial
              </h3>
              <p className="text-muted-foreground">
                Los torneos completados aparecerán aquí automáticamente
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Torneo</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Jugadores</TableHead>
                  <TableHead>Duración</TableHead>
                  <TableHead>Bote</TableHead>
                  <TableHead>Ganador</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredHistory.map((tournament) => (
                  <TableRow key={tournament.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{tournament.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {tournament.template_name}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {format(
                        new Date(tournament.date_completed),
                        "dd/MM/yyyy HH:mm",
                        {
                          locale: es,
                        }
                      )}
                    </TableCell>
                    <TableCell>{tournament.total_players}</TableCell>
                    <TableCell>
                      {formatDuration(tournament.duration_minutes)}
                    </TableCell>
                    <TableCell>{formatCurrency(tournament.real_pot)}</TableCell>
                    <TableCell>
                      {tournament.winners.length > 0 ? (
                        <div>
                          <div className="font-medium">
                            {tournament.winners[0].name}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {formatCurrency(tournament.winners[0].prize || 0)}
                          </div>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">Sin datos</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedTournament(tournament)}
                            >
                              <EyeIcon className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>{tournament.name}</DialogTitle>
                              <DialogDescription>
                                Detalles completos del torneo
                              </DialogDescription>
                            </DialogHeader>
                            {selectedTournament && (
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <h4 className="mb-2 font-medium">
                                      Información General
                                    </h4>
                                    <div className="space-y-1 text-sm">
                                      <div>
                                        Plantilla:{" "}
                                        {selectedTournament.template_name}
                                      </div>
                                      <div>
                                        Fecha:{" "}
                                        {format(
                                          new Date(
                                            selectedTournament.date_completed
                                          ),
                                          "dd/MM/yyyy HH:mm",
                                          { locale: es }
                                        )}
                                      </div>
                                      <div>
                                        Duración:{" "}
                                        {formatDuration(
                                          selectedTournament.duration_minutes
                                        )}
                                      </div>
                                      <div>
                                        Jugadores:{" "}
                                        {selectedTournament.total_players}
                                      </div>
                                    </div>
                                  </div>
                                  <div>
                                    <h4 className="mb-2 font-medium">
                                      Premios
                                    </h4>
                                    <div className="space-y-1 text-sm">
                                      <div>
                                        Bote total:{" "}
                                        {formatCurrency(
                                          selectedTournament.total_pot
                                        )}
                                      </div>
                                      <div>
                                        Comisión:{" "}
                                        {formatCurrency(selectedTournament.fee)}
                                      </div>
                                      <div>
                                        Bote real:{" "}
                                        {formatCurrency(
                                          selectedTournament.real_pot
                                        )}
                                      </div>
                                      {selectedTournament.extrapot > 0 && (
                                        <div>
                                          Bote extra:{" "}
                                          {formatCurrency(
                                            selectedTournament.extrapot
                                          )}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                {selectedTournament.winners.length > 0 && (
                                  <div>
                                    <h4 className="mb-2 font-medium">
                                      Ganadores
                                    </h4>
                                    <div className="space-y-2">
                                      {selectedTournament.winners.map(
                                        (winner, index) => (
                                          <div
                                            key={index}
                                            className="flex items-center justify-between rounded bg-muted p-2"
                                          >
                                            <span>
                                              {winner.place}º - {winner.name}
                                            </span>
                                            <span className="font-medium">
                                              {formatCurrency(
                                                winner.prize || 0
                                              )}
                                            </span>
                                          </div>
                                        )
                                      )}
                                    </div>
                                  </div>
                                )}

                                <div>
                                  <h4 className="mb-2 font-medium">
                                    Estadísticas
                                  </h4>
                                  <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                      Stack promedio:{" "}
                                      {Math.round(
                                        selectedTournament.statistics.avg_stack
                                      ).toLocaleString()}
                                    </div>
                                    <div>
                                      Niveles jugados:{" "}
                                      {
                                        selectedTournament.statistics
                                          .levels_played
                                      }
                                    </div>
                                    <div>
                                      % Addons:{" "}
                                      {selectedTournament.statistics.addon_percentage.toFixed(
                                        1
                                      )}
                                      %
                                    </div>
                                    <div>
                                      % Doble Addons:{" "}
                                      {selectedTournament.statistics.double_addon_percentage.toFixed(
                                        1
                                      )}
                                      %
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>

                        <ConfirmationDialog
                          title="Eliminar torneo"
                          description="¿Estás seguro de que quieres eliminar este torneo del historial?"
                          onConfirm={() =>
                            handleDeleteTournament(tournament.id)
                          }
                        >
                          <Button variant="outline" size="sm">
                            <TrashIcon className="h-4 w-4" />
                          </Button>
                        </ConfirmationDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
