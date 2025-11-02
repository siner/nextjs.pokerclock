"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import {
  Download,
  FileText,
  Database,
  BarChart3,
  Package,
  Calendar,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import {
  useDataExporter,
  type ExportOptions,
  type TournamentHistory,
} from "@/lib/export-utils";
import { GameTemplate } from "@/types";
import { ButtonLoading } from "@/components/ui/loading";
import { trackEvent } from "@/lib/analytics";

interface ExportDialogProps {
  children: React.ReactNode;
  templates: GameTemplate[];
  tournamentHistory?: TournamentHistory[];
}

type ExportType = "templates" | "history" | "statistics" | "all";

export function ExportDialog({
  children,
  templates,
  tournamentHistory = [],
}: ExportDialogProps) {
  const [open, setOpen] = useState(false);
  const [exportType, setExportType] = useState<ExportType>("templates");
  const [format, setFormat] = useState<"json" | "csv">("json");
  const [includeMetadata, setIncludeMetadata] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();
  const { exportTemplates, exportHistory, exportStatistics, exportAll } =
    useDataExporter();

  const exportOptions: ExportOptions = {
    format,
    includeMetadata,
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      let result;

      switch (exportType) {
        case "templates":
          result = await exportTemplates(templates, exportOptions);
          break;
        case "history":
          result = await exportHistory(tournamentHistory, exportOptions);
          break;
        case "statistics":
          result = await exportStatistics(
            templates,
            tournamentHistory,
            exportOptions
          );
          break;
        case "all":
          result = await exportAll(templates, tournamentHistory, exportOptions);
          break;
        default:
          throw new Error("Tipo de exportación no válido");
      }

      if (result.success) {
        if (exportType === "history") {
          trackEvent("history_export_success", {
            total: currentInfo.count,
            mode: "dialog",
            format,
          });
        } else {
          trackEvent("templates_export", {
            total: currentInfo.count,
            mode: "dialog",
            format,
            type: exportType,
          });
        }
        toast({
          title: "¡Exportación exitosa!",
          description: `Archivo "${result.filename}" descargado correctamente.`,
        });
        setOpen(false);
      } else {
        throw new Error(result.error || "Error desconocido");
      }
    } catch (error) {
      if (exportType === "history") {
        trackEvent("history_export_error", {
          mode: "dialog",
          format,
        });
      }
      toast({
        title: "Error en la exportación",
        description:
          error instanceof Error ? error.message : "Error desconocido",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const getExportTypeInfo = (type: ExportType) => {
    switch (type) {
      case "templates":
        return {
          title: "Plantillas de Torneos",
          description: "Exportar todas las plantillas configuradas",
          icon: FileText,
          count: templates.length,
          items: "plantillas",
        };
      case "history":
        return {
          title: "Historial de Torneos",
          description: "Exportar historial de torneos completados",
          icon: Database,
          count: tournamentHistory.length,
          items: "torneos",
        };
      case "statistics":
        return {
          title: "Estadísticas",
          description: "Exportar estadísticas y métricas calculadas",
          icon: BarChart3,
          count: 1,
          items: "reporte",
        };
      case "all":
        return {
          title: "Backup Completo",
          description:
            "Exportar todos los datos (plantillas + historial + estadísticas)",
          icon: Package,
          count: templates.length + tournamentHistory.length,
          items: "elementos",
        };
    }
  };

  const currentInfo = getExportTypeInfo(exportType);
  const IconComponent = currentInfo.icon;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Exportar Datos
          </DialogTitle>
          <DialogDescription>
            Selecciona qué datos exportar y en qué formato. Los archivos se
            descargarán automáticamente.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Selección de tipo de exportación */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Tipo de datos</Label>
            <div className="grid grid-cols-2 gap-3">
              {(
                ["templates", "history", "statistics", "all"] as ExportType[]
              ).map((type) => {
                const info = getExportTypeInfo(type);
                const Icon = info.icon;
                const isSelected = exportType === type;
                const isDisabled =
                  type === "history" && tournamentHistory.length === 0;

                return (
                  <Card
                    key={type}
                    className={`cursor-pointer transition-all ${
                      isSelected
                        ? "bg-primary/5 ring-2 ring-primary"
                        : "hover:bg-muted/50"
                    } ${isDisabled ? "cursor-not-allowed opacity-50" : ""}`}
                    onClick={() => !isDisabled && setExportType(type)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <Icon className="mt-0.5 h-5 w-5 text-primary" />
                        <div className="min-w-0 flex-1">
                          <h4 className="text-sm font-medium">{info.title}</h4>
                          <p className="mt-1 text-xs text-muted-foreground">
                            {info.description}
                          </p>
                          <div className="mt-2 flex items-center gap-1">
                            {isDisabled ? (
                              <AlertCircle className="h-3 w-3 text-orange-500" />
                            ) : (
                              <CheckCircle className="h-3 w-3 text-green-500" />
                            )}
                            <span className="text-xs text-muted-foreground">
                              {isDisabled
                                ? "Sin datos"
                                : `${info.count} ${info.items}`}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          <Separator />

          {/* Configuración de formato */}
          <div className="space-y-4">
            <Label className="text-base font-medium">Configuración</Label>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="format">Formato de archivo</Label>
                <Select
                  value={format}
                  onValueChange={(value: "json" | "csv") => setFormat(value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="json">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        JSON - Estructura completa
                      </div>
                    </SelectItem>
                    <SelectItem value="csv">
                      <div className="flex items-center gap-2">
                        <BarChart3 className="h-4 w-4" />
                        CSV - Para análisis
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Opciones adicionales</Label>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="metadata"
                    checked={includeMetadata}
                    onCheckedChange={(checked: boolean) =>
                      setIncludeMetadata(checked)
                    }
                  />
                  <Label htmlFor="metadata" className="text-sm">
                    Incluir metadatos
                  </Label>
                </div>
              </div>
            </div>
          </div>

          {/* Vista previa de la exportación */}
          <Card className="bg-muted/30">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm">
                <IconComponent className="h-4 w-4" />
                Vista previa de exportación
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tipo:</span>
                  <span className="font-medium">{currentInfo.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Formato:</span>
                  <span className="font-medium">{format.toUpperCase()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Elementos:</span>
                  <span className="font-medium">
                    {currentInfo.count} {currentInfo.items}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Metadatos:</span>
                  <span className="font-medium">
                    {includeMetadata ? "Incluidos" : "No incluidos"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Archivo:</span>
                  <span className="text-xs font-medium">
                    {exportType === "templates" &&
                      `plantillas-poker-${new Date().toISOString().split("T")[0]}.${format}`}
                    {exportType === "history" &&
                      `historial-torneos-${new Date().toISOString().split("T")[0]}.${format}`}
                    {exportType === "statistics" &&
                      `estadisticas-poker-${new Date().toISOString().split("T")[0]}.${format}`}
                    {exportType === "all" &&
                      `backup-completo-poker-${new Date().toISOString().split("T")[0]}.${format}`}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button
            onClick={handleExport}
            disabled={
              (exportType === "history" && tournamentHistory.length === 0) ||
              isExporting
            }
          >
            <ButtonLoading isLoading={isExporting} loadingText="Exportando...">
              <Download className="mr-2 h-4 w-4" />
              Exportar
            </ButtonLoading>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Componente simplificado para exportación rápida
export function QuickExportButton({
  templates,
  tournamentHistory = [],
  type = "templates",
  format = "json",
  children,
}: {
  templates: GameTemplate[];
  tournamentHistory?: TournamentHistory[];
  type?: ExportType;
  format?: "json" | "csv";
  children: React.ReactNode;
}) {
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();
  const { exportTemplates, exportHistory, exportStatistics, exportAll } =
    useDataExporter();

  const handleQuickExport = async () => {
    setIsExporting(true);
    try {
      const options: ExportOptions = { format, includeMetadata: true };
      let result;
      const totals: Record<ExportType, number> = {
        templates: templates.length,
        history: tournamentHistory.length,
        statistics: 1,
        all: templates.length + tournamentHistory.length,
      };

      switch (type) {
        case "templates":
          result = await exportTemplates(templates, options);
          break;
        case "history":
          result = await exportHistory(tournamentHistory, options);
          break;
        case "statistics":
          result = await exportStatistics(
            templates,
            tournamentHistory,
            options
          );
          break;
        case "all":
          result = await exportAll(templates, tournamentHistory, options);
          break;
      }

      if (result.success) {
        if (type === "history") {
          trackEvent("history_export_success", {
            total: totals.history,
            mode: "quick",
            format,
          });
        } else {
          trackEvent("templates_export", {
            total: totals[type],
            mode: "quick",
            format,
            type,
          });
        }
        toast({
          title: "¡Exportación exitosa!",
          description: `Archivo "${result.filename}" descargado correctamente.`,
        });
      } else {
        throw new Error(result.error || "Error desconocido");
      }
    } catch (error) {
      if (type === "history") {
        trackEvent("history_export_error", {
          mode: "quick",
          format,
        });
      }
      toast({
        title: "Error en la exportación",
        description:
          error instanceof Error ? error.message : "Error desconocido",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Button onClick={handleQuickExport} disabled={isExporting}>
      <ButtonLoading isLoading={isExporting} loadingText="Exportando...">
        {children}
      </ButtonLoading>
    </Button>
  );
}
