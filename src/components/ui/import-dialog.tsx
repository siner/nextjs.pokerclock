"use client";

import { useState, useRef } from "react";
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
  Upload,
  FileText,
  AlertTriangle,
  CheckCircle,
  XCircle,
  RefreshCw,
  Copy,
  FileX,
  Shield,
  Info,
} from "lucide-react";
import {
  useDataImporter,
  type ImportOptions,
  type ImportResult,
  type ImportConflict,
} from "@/lib/import-utils";
import { GameTemplate } from "@/types";
import { ButtonLoading } from "@/components/ui/loading";
import { trackEvent } from "@/lib/analytics";

interface ImportDialogProps {
  children: React.ReactNode;
  onImportComplete?: (result: ImportResult) => void;
}

type ImportStep =
  | "select"
  | "configure"
  | "conflicts"
  | "importing"
  | "results";

export function ImportDialog({
  children,
  onImportComplete,
}: ImportDialogProps) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<ImportStep>("select");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [importOptions, setImportOptions] = useState<ImportOptions>({
    strategy: "merge",
    validateStructure: true,
    createBackup: true,
  });
  const [conflicts, setConflicts] = useState<ImportConflict[]>([]);
  const [previewTemplates, setPreviewTemplates] = useState<GameTemplate[]>([]);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { importFromFile, detectConflicts } = useDataImporter();

  const handleFileSelect = async (file: File) => {
    setSelectedFile(file);

    try {
      // Leer y parsear archivo para preview
      const content = await readFileContent(file);
      const parsedData = JSON.parse(content);

      // Extraer plantillas para preview
      const templates = extractTemplatesFromData(parsedData);
      setPreviewTemplates(templates);

      if (templates.length === 0) {
        toast({
          title: "Archivo inválido",
          description: "No se encontraron plantillas válidas en el archivo.",
          variant: "destructive",
        });
        return;
      }

      // Detectar conflictos
      const existingTemplates = JSON.parse(
        localStorage.getItem("gameTemplates") || "[]"
      );
      const detectedConflicts = detectConflicts(templates, existingTemplates);
      setConflicts(detectedConflicts);

      setStep("configure");
    } catch (error) {
      toast({
        title: "Error leyendo archivo",
        description: "El archivo no es un JSON válido o está corrupto.",
        variant: "destructive",
      });
    }
  };

  const handleImport = async () => {
    if (!selectedFile) return;

    setIsImporting(true);
    setStep("importing");

    try {
      const result = await importFromFile(selectedFile, importOptions);
      setImportResult(result);
      setStep("results");

      if (result.success) {
        trackEvent("templates_import_success", {
          count: result.imported,
          skipped: result.skipped,
          mode: "dialog",
        });
        toast({
          title: "¡Importación exitosa!",
          description: `Se importaron ${result.imported} plantillas correctamente.`,
        });
        onImportComplete?.(result);
      } else {
        trackEvent("templates_import_error", {
          mode: "dialog",
          message: result.errors.join(", "),
        });
        toast({
          title: "Error en la importación",
          description: result.errors.join(", "),
          variant: "destructive",
        });
      }
    } catch (error) {
      trackEvent("templates_import_error", {
        mode: "dialog",
        message: error instanceof Error ? error.message : "unknown",
      });
      toast({
        title: "Error crítico",
        description: "Error inesperado durante la importación.",
        variant: "destructive",
      });
    } finally {
      setIsImporting(false);
    }
  };

  const resetDialog = () => {
    setStep("select");
    setSelectedFile(null);
    setPreviewTemplates([]);
    setConflicts([]);
    setImportResult(null);
    setIsImporting(false);
  };

  const handleClose = () => {
    setOpen(false);
    setTimeout(resetDialog, 300); // Delay para animación
  };

  // Funciones auxiliares
  const readFileContent = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = () => reject(new Error("Error leyendo archivo"));
      reader.readAsText(file);
    });
  };

  const extractTemplatesFromData = (data: unknown): GameTemplate[] => {
    if (Array.isArray(data)) return data;
    if (data && typeof data === "object") {
      const dataObj = data as Record<string, unknown>;
      if (Array.isArray(dataObj.templates)) return dataObj.templates;
      if (Array.isArray(dataObj.gameTemplates)) return dataObj.gameTemplates;
      if (dataObj.data && Array.isArray(dataObj.data)) return dataObj.data;
    }
    return [];
  };

  const getStrategyInfo = (strategy: ImportOptions["strategy"]) => {
    switch (strategy) {
      case "replace":
        return {
          title: "Reemplazar",
          description: "Sobrescribir plantillas existentes con las importadas",
          icon: RefreshCw,
          color: "text-orange-600",
        };
      case "merge":
        return {
          title: "Fusionar (Inteligente)",
          description: "Reemplazar si mismo nombre, renombrar si diferente",
          icon: CheckCircle,
          color: "text-green-600",
        };
      case "skip_duplicates":
        return {
          title: "Omitir Duplicados",
          description: "Mantener plantillas existentes, omitir duplicadas",
          icon: XCircle,
          color: "text-red-600",
        };
      case "rename_duplicates":
        return {
          title: "Renombrar Duplicados",
          description: "Crear nuevas plantillas con nombres únicos",
          icon: Copy,
          color: "text-blue-600",
        };
    }
  };

  const strategyInfo = getStrategyInfo(importOptions.strategy);
  const StrategyIcon = strategyInfo.icon;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Importar Plantillas
          </DialogTitle>
          <DialogDescription>
            Importa plantillas desde archivos JSON exportados previamente.
          </DialogDescription>
        </DialogHeader>

        {/* Paso 1: Seleccionar archivo */}
        {step === "select" && (
          <div className="space-y-6">
            <div className="rounded-lg border-2 border-dashed border-muted-foreground/25 p-8 text-center">
              <Upload className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="mb-2 text-lg font-medium">
                Selecciona un archivo
              </h3>
              <p className="mb-4 text-muted-foreground">
                Arrastra un archivo JSON aquí o haz clic para seleccionar
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileSelect(file);
                }}
                className="hidden"
              />
              <Button onClick={() => fileInputRef.current?.click()}>
                <FileText className="mr-2 h-4 w-4" />
                Seleccionar archivo
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
              <div className="space-y-2">
                <h4 className="flex items-center gap-2 font-medium">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  Formatos compatibles
                </h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Exportaciones de este sistema</li>
                  <li>• Arrays JSON de plantillas</li>
                  <li>• Backups completos</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="flex items-center gap-2 font-medium">
                  <Shield className="h-4 w-4 text-blue-600" />
                  Seguridad
                </h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Validación automática</li>
                  <li>• Backup antes de importar</li>
                  <li>• Manejo de conflictos</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Paso 2: Configurar importación */}
        {step === "configure" && selectedFile && (
          <div className="space-y-6">
            {/* Información del archivo */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <FileText className="h-4 w-4" />
                  Archivo seleccionado
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Nombre:</span>
                    <p className="font-medium">{selectedFile.name}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Plantillas:</span>
                    <p className="font-medium">{previewTemplates.length}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Tamaño:</span>
                    <p className="font-medium">
                      {(selectedFile.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Conflictos:</span>
                    <p
                      className={`font-medium ${conflicts.length > 0 ? "text-orange-600" : "text-green-600"}`}
                    >
                      {conflicts.length > 0
                        ? `${conflicts.length} detectados`
                        : "Ninguno"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Estrategia de importación */}
            <div className="space-y-3">
              <Label className="text-base font-medium">
                Estrategia de importación
              </Label>
              <Select
                value={importOptions.strategy}
                onValueChange={(value: ImportOptions["strategy"]) =>
                  setImportOptions({ ...importOptions, strategy: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(
                    [
                      "merge",
                      "replace",
                      "skip_duplicates",
                      "rename_duplicates",
                    ] as const
                  ).map((strategy) => {
                    const info = getStrategyInfo(strategy);
                    const Icon = info.icon;
                    return (
                      <SelectItem key={strategy} value={strategy}>
                        <div className="flex items-center gap-2">
                          <Icon className={`h-4 w-4 ${info.color}`} />
                          <div>
                            <div className="font-medium">{info.title}</div>
                            <div className="text-xs text-muted-foreground">
                              {info.description}
                            </div>
                          </div>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>

              <Card className="bg-muted/30">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <StrategyIcon
                      className={`mt-0.5 h-5 w-5 ${strategyInfo.color}`}
                    />
                    <div>
                      <h4 className="font-medium">{strategyInfo.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {strategyInfo.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Opciones adicionales */}
            <div className="space-y-3">
              <Label className="text-base font-medium">
                Opciones adicionales
              </Label>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="validate"
                    checked={importOptions.validateStructure}
                    onCheckedChange={(checked: boolean) =>
                      setImportOptions({
                        ...importOptions,
                        validateStructure: checked,
                      })
                    }
                  />
                  <Label htmlFor="validate" className="text-sm">
                    Validar estructura de plantillas
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="backup"
                    checked={importOptions.createBackup}
                    onCheckedChange={(checked: boolean) =>
                      setImportOptions({
                        ...importOptions,
                        createBackup: checked,
                      })
                    }
                  />
                  <Label htmlFor="backup" className="text-sm">
                    Crear backup automático (en localStorage)
                  </Label>
                </div>
              </div>
            </div>

            {/* Conflictos detectados */}
            {conflicts.length > 0 && (
              <Card className="border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-sm text-orange-700 dark:text-orange-300">
                    <AlertTriangle className="h-4 w-4" />
                    Conflictos detectados ({conflicts.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="max-h-32 space-y-2 overflow-y-auto">
                    {conflicts.slice(0, 5).map((conflict, index) => (
                      <div key={index} className="text-sm">
                        <span className="font-medium">
                          {conflict.importedTemplate.name}
                        </span>
                        <span className="text-muted-foreground">
                          {" "}
                          -{" "}
                          {conflict.conflictType === "both"
                            ? "ID y nombre"
                            : conflict.conflictType === "id"
                              ? "ID"
                              : "nombre"}{" "}
                          duplicado
                        </span>
                      </div>
                    ))}
                    {conflicts.length > 5 && (
                      <div className="text-xs text-muted-foreground">
                        ... y {conflicts.length - 5} más
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Paso 3: Importando */}
        {step === "importing" && (
          <div className="flex flex-col items-center justify-center space-y-4 py-12">
            <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-primary"></div>
            <h3 className="text-lg font-medium">Importando plantillas...</h3>
            <p className="text-center text-muted-foreground">
              Por favor espera mientras procesamos las plantillas.
              {importOptions.createBackup &&
                " Se está creando un backup automático en localStorage."}
            </p>
          </div>
        )}

        {/* Paso 4: Resultados */}
        {step === "results" && importResult && (
          <div className="space-y-6">
            <Card
              className={
                importResult.success
                  ? "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950"
                  : "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950"
              }
            >
              <CardHeader className="pb-3">
                <CardTitle
                  className={`flex items-center gap-2 text-sm ${importResult.success ? "text-green-700 dark:text-green-300" : "text-red-700 dark:text-red-300"}`}
                >
                  {importResult.success ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <XCircle className="h-4 w-4" />
                  )}
                  {importResult.success
                    ? "Importación exitosa"
                    : "Error en la importación"}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Importadas:</span>
                    <p className="font-medium text-green-600">
                      {importResult.imported}
                    </p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Omitidas:</span>
                    <p className="font-medium text-orange-600">
                      {importResult.skipped}
                    </p>
                  </div>
                  {importResult.backupCreated && (
                    <div className="col-span-2">
                      <span className="text-muted-foreground">
                        Backup creado:
                      </span>
                      <p className="text-xs font-medium text-blue-600">
                        Guardado en localStorage como{" "}
                        {importResult.backupCreated}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Errores */}
            {importResult.errors.length > 0 && (
              <Card className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-red-700 dark:text-red-300">
                    Errores ({importResult.errors.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <ul className="space-y-1 text-sm">
                    {importResult.errors.map((error, index) => (
                      <li
                        key={index}
                        className="text-red-600 dark:text-red-400"
                      >
                        • {error}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Advertencias */}
            {importResult.warnings.length > 0 && (
              <Card className="border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-orange-700 dark:text-orange-300">
                    Advertencias ({importResult.warnings.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <ul className="space-y-1 text-sm">
                    {importResult.warnings.map((warning, index) => (
                      <li
                        key={index}
                        className="text-orange-600 dark:text-orange-400"
                      >
                        • {warning}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Duplicados manejados */}
            {importResult.duplicates.length > 0 && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">
                    Duplicados manejados ({importResult.duplicates.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="max-h-32 space-y-2 overflow-y-auto">
                    {importResult.duplicates.map((duplicate, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between text-sm"
                      >
                        <span className="font-medium">
                          {duplicate.imported.name}
                        </span>
                        <span
                          className={`rounded px-2 py-1 text-xs ${
                            duplicate.action === "replaced"
                              ? "bg-orange-100 text-orange-700"
                              : duplicate.action === "renamed"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {duplicate.action === "replaced"
                            ? "Reemplazada"
                            : duplicate.action === "renamed"
                              ? "Renombrada"
                              : "Omitida"}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        <DialogFooter>
          {step === "select" && (
            <Button variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
          )}

          {step === "configure" && (
            <>
              <Button variant="outline" onClick={() => setStep("select")}>
                Atrás
              </Button>
              <Button onClick={handleImport}>
                <Upload className="mr-2 h-4 w-4" />
                Importar {previewTemplates.length} plantillas
              </Button>
            </>
          )}

          {step === "importing" && (
            <Button disabled>
              <ButtonLoading isLoading={true} loadingText="Importando...">
                Importando...
              </ButtonLoading>
            </Button>
          )}

          {step === "results" && (
            <>
              <Button variant="outline" onClick={resetDialog}>
                Importar más
              </Button>
              <Button onClick={handleClose}>Cerrar</Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Componente simplificado para importación rápida
export function QuickImportButton({
  children,
  onImportComplete,
}: {
  children: React.ReactNode;
  onImportComplete?: (result: ImportResult) => void;
}) {
  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { importFromFile } = useDataImporter();

  const handleQuickImport = async (file: File) => {
    setIsImporting(true);
    try {
      const result = await importFromFile(file, {
        strategy: "merge",
        validateStructure: true,
        createBackup: true,
      });

      if (result.success) {
        trackEvent("templates_import_success", {
          count: result.imported,
          skipped: result.skipped,
          mode: "quick",
        });
        toast({
          title: "¡Importación exitosa!",
          description: `Se importaron ${result.imported} plantillas correctamente.`,
        });
        onImportComplete?.(result);
      } else {
        trackEvent("templates_import_error", {
          mode: "quick",
          message: result.errors.join(", "),
        });
        toast({
          title: "Error en la importación",
          description: result.errors.join(", "),
          variant: "destructive",
        });
      }
    } catch (error) {
      trackEvent("templates_import_error", {
        mode: "quick",
        message: error instanceof Error ? error.message : "unknown",
      });
      toast({
        title: "Error crítico",
        description: "Error inesperado durante la importación.",
        variant: "destructive",
      });
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleQuickImport(file);
        }}
        className="hidden"
      />
      <Button
        onClick={() => fileInputRef.current?.click()}
        disabled={isImporting}
      >
        <ButtonLoading isLoading={isImporting} loadingText="Importando...">
          {children}
        </ButtonLoading>
      </Button>
    </>
  );
}
