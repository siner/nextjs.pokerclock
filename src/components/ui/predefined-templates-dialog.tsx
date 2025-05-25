"use client";

import { useState, useMemo } from "react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import {
  Search,
  Star,
  Users,
  Clock,
  Trophy,
  Filter,
  Download,
  Eye,
  Zap,
  Target,
  Award,
  Coins,
  Timer,
  Layers,
} from "lucide-react";
import {
  PredefinedTemplateManager,
  type PredefinedTemplate,
} from "@/lib/predefined-templates";
import { GameTemplate } from "@/types";
import { SafeStorage } from "@/lib/error-handling";

interface PredefinedTemplatesDialogProps {
  children: React.ReactNode;
  onTemplateSelect?: (template: GameTemplate) => void;
}

export function PredefinedTemplatesDialog({
  children,
  onTemplateSelect,
}: PredefinedTemplatesDialogProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");
  const [selectedTemplate, setSelectedTemplate] =
    useState<PredefinedTemplate | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const { toast } = useToast();

  // Filtrar plantillas
  const filteredTemplates = useMemo(() => {
    let templates = PredefinedTemplateManager.getAllTemplates();

    // Filtrar por búsqueda
    if (searchQuery.trim()) {
      templates = PredefinedTemplateManager.search(searchQuery);
    }

    // Filtrar por categoría
    if (selectedCategory !== "all") {
      templates = templates.filter(
        (template) => template.category === selectedCategory
      );
    }

    // Filtrar por dificultad
    if (selectedDifficulty !== "all") {
      templates = templates.filter(
        (template) => template.difficulty === selectedDifficulty
      );
    }

    // Ordenar por popularidad
    return templates.sort((a, b) => b.popularity - a.popularity);
  }, [searchQuery, selectedCategory, selectedDifficulty]);

  const handleTemplateSelect = (predefinedTemplate: PredefinedTemplate) => {
    try {
      // Obtener plantillas existentes para generar nuevo ID
      const existingTemplates = SafeStorage.getItem<GameTemplate[]>(
        "gameTemplates",
        []
      );
      const newId = Math.max(...existingTemplates.map((t) => t.id), 0) + 1;

      // Convertir a GameTemplate
      const gameTemplate = PredefinedTemplateManager.toGameTemplate(
        predefinedTemplate,
        newId
      );

      // Agregar a la colección del usuario
      const updatedTemplates = [...existingTemplates, gameTemplate];
      const success = SafeStorage.setItem("gameTemplates", updatedTemplates);

      if (success) {
        toast({
          title: "¡Plantilla agregada!",
          description: `"${predefinedTemplate.name}" se agregó a tu colección.`,
        });
        onTemplateSelect?.(gameTemplate);
        setOpen(false);
      } else {
        toast({
          title: "Error",
          description: "No se pudo agregar la plantilla.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Error inesperado al agregar la plantilla.",
        variant: "destructive",
      });
    }
  };

  const handlePreview = (template: PredefinedTemplate) => {
    setSelectedTemplate(template);
    setShowPreview(true);
  };

  const getCategoryIcon = (category: PredefinedTemplate["category"]) => {
    switch (category) {
      case "sit-and-go":
        return <Users className="h-4 w-4" />;
      case "mtt":
        return <Layers className="h-4 w-4" />;
      case "turbo":
        return <Zap className="h-4 w-4" />;
      case "hyper-turbo":
        return <Timer className="h-4 w-4" />;
      case "deepstack":
        return <Target className="h-4 w-4" />;
      case "bounty":
        return <Award className="h-4 w-4" />;
      case "satellite":
        return <Trophy className="h-4 w-4" />;
      default:
        return <Coins className="h-4 w-4" />;
    }
  };

  const getDifficultyColor = (difficulty: PredefinedTemplate["difficulty"]) => {
    switch (difficulty) {
      case "beginner":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "intermediate":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "advanced":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  const formatCurrency = (amount: number) => {
    return amount === 0 ? "Gratis" : `€${amount}`;
  };

  const formatDuration = (levels: PredefinedTemplate["levels"]) => {
    const totalMinutes = levels.reduce((sum, level) => sum + level.time, 0);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return hours > 0 ? `~${hours}h ${minutes}m` : `~${minutes}m`;
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-h-[90vh] max-w-6xl overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Plantillas Predefinidas
          </DialogTitle>
          <DialogDescription>
            Explora nuestra biblioteca de estructuras de torneo populares y
            agrégalas a tu colección.
          </DialogDescription>
        </DialogHeader>

        {/* Vista previa de plantilla */}
        {showPreview && selectedTemplate && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <Card className="max-h-[90vh] max-w-4xl overflow-y-auto bg-background">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {getCategoryIcon(selectedTemplate.category)}
                      {selectedTemplate.name}
                    </CardTitle>
                    <p className="mt-1 text-muted-foreground">
                      {selectedTemplate.description}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowPreview(false)}
                  >
                    ✕
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Información general */}
                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                  <div>
                    <Label className="text-xs text-muted-foreground">
                      Buy-in
                    </Label>
                    <p className="font-medium">
                      {formatCurrency(selectedTemplate.entry)}
                    </p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">
                      Fichas iniciales
                    </Label>
                    <p className="font-medium">{selectedTemplate.points}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">
                      Niveles
                    </Label>
                    <p className="font-medium">
                      {selectedTemplate.levels.length}
                    </p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">
                      Duración estimada
                    </Label>
                    <p className="font-medium">
                      {formatDuration(selectedTemplate.levels)}
                    </p>
                  </div>
                </div>

                {/* Estructura de niveles */}
                <div>
                  <Label className="text-sm font-medium">
                    Estructura de Niveles
                  </Label>
                  <div className="mt-2 max-h-48 overflow-y-auto">
                    <div className="mb-2 grid grid-cols-4 gap-2 text-xs font-medium text-muted-foreground">
                      <div>SB/BB</div>
                      <div>Ante</div>
                      <div>Tiempo</div>
                      <div>Nivel</div>
                    </div>
                    {selectedTemplate.levels.map((level, index) => (
                      <div
                        key={index}
                        className="grid grid-cols-4 gap-2 border-b border-border/50 py-1 text-sm"
                      >
                        <div>
                          {level.sb}/{level.bb}
                        </div>
                        <div>{level.ante || "-"}</div>
                        <div>{level.time}m</div>
                        <div className="text-muted-foreground">
                          Nivel {index + 1}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Estructura de premios */}
                <div>
                  <Label className="text-sm font-medium">
                    Estructura de Premios
                  </Label>
                  <div className="mt-2 space-y-2">
                    {selectedTemplate.prize_structures.map(
                      (structure, index) => (
                        <div key={index} className="rounded border p-3">
                          <div className="mb-2 text-sm font-medium">
                            Hasta {structure.max_players} jugadores
                          </div>
                          <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
                            {structure.prizes.map((prize) => (
                              <div
                                key={prize.id}
                                className="rounded bg-muted p-2 text-center text-sm"
                              >
                                <div className="font-medium">{prize.id}°</div>
                                <div className="text-muted-foreground">
                                  {prize.percentaje}%
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowPreview(false)}
                  >
                    Cerrar
                  </Button>
                  <Button
                    onClick={() => handleTemplateSelect(selectedTemplate)}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Agregar a mi colección
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Filtros y búsqueda */}
        <div className="space-y-4">
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Buscar plantillas..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las categorías</SelectItem>
                  {PredefinedTemplateManager.getCategories().map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={selectedDifficulty}
                onValueChange={setSelectedDifficulty}
              >
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Dificultad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  {PredefinedTemplateManager.getDifficulties().map(
                    (difficulty) => (
                      <SelectItem
                        key={difficulty.value}
                        value={difficulty.value}
                      >
                        {difficulty.label}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Estadísticas de filtros */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>
              {filteredTemplates.length} plantilla
              {filteredTemplates.length !== 1 ? "s" : ""} encontrada
              {filteredTemplates.length !== 1 ? "s" : ""}
            </span>
            {(searchQuery ||
              selectedCategory !== "all" ||
              selectedDifficulty !== "all") && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                  setSelectedDifficulty("all");
                }}
              >
                <Filter className="mr-1 h-3 w-3" />
                Limpiar filtros
              </Button>
            )}
          </div>
        </div>

        <Separator />

        {/* Lista de plantillas */}
        <div className="max-h-96 overflow-y-auto">
          {filteredTemplates.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">
              <Trophy className="mx-auto mb-4 h-12 w-12 opacity-50" />
              <p>No se encontraron plantillas con los filtros seleccionados.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredTemplates.map((template, index) => (
                <Card key={index} className="transition-shadow hover:shadow-md">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="mb-2 flex items-center gap-2">
                          {getCategoryIcon(template.category)}
                          <h3 className="font-medium">{template.name}</h3>
                          <div className="flex items-center gap-1">
                            {Array.from({ length: template.popularity }).map(
                              (_, i) => (
                                <Star
                                  key={i}
                                  className="h-3 w-3 fill-yellow-400 text-yellow-400"
                                />
                              )
                            )}
                          </div>
                        </div>
                        <p className="mb-3 text-sm text-muted-foreground">
                          {template.description}
                        </p>
                        <div className="mb-3 flex flex-wrap items-center gap-2">
                          <Badge
                            className={getDifficultyColor(template.difficulty)}
                          >
                            {template.difficulty === "beginner"
                              ? "Principiante"
                              : template.difficulty === "intermediate"
                                ? "Intermedio"
                                : "Avanzado"}
                          </Badge>
                          {template.tags.slice(0, 3).map((tag) => (
                            <Badge key={tag} variant="outline">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
                          <div className="flex items-center gap-1">
                            <Coins className="h-3 w-3 text-muted-foreground" />
                            <span>{formatCurrency(template.entry)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-3 w-3 text-muted-foreground" />
                            <span>
                              {template.estimatedPlayers.min}-
                              {template.estimatedPlayers.max}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3 text-muted-foreground" />
                            <span>{formatDuration(template.levels)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Layers className="h-3 w-3 text-muted-foreground" />
                            <span>{template.levels.length} niveles</span>
                          </div>
                        </div>
                      </div>
                      <div className="ml-4 flex flex-col gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePreview(template)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleTemplateSelect(template)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cerrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Componente simplificado para acceso rápido
export function QuickTemplateButton({
  children,
  onTemplateSelect,
}: {
  children: React.ReactNode;
  onTemplateSelect?: (template: GameTemplate) => void;
}) {
  const { toast } = useToast();

  const handleQuickAdd = () => {
    // Agregar la plantilla más popular automáticamente
    const popularTemplate = PredefinedTemplateManager.getPopular(1)[0];

    if (popularTemplate) {
      try {
        const existingTemplates = SafeStorage.getItem<GameTemplate[]>(
          "gameTemplates",
          []
        );
        const newId = Math.max(...existingTemplates.map((t) => t.id), 0) + 1;
        const gameTemplate = PredefinedTemplateManager.toGameTemplate(
          popularTemplate,
          newId
        );

        const updatedTemplates = [...existingTemplates, gameTemplate];
        const success = SafeStorage.setItem("gameTemplates", updatedTemplates);

        if (success) {
          toast({
            title: "¡Plantilla agregada!",
            description: `"${popularTemplate.name}" se agregó a tu colección.`,
          });
          onTemplateSelect?.(gameTemplate);
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "No se pudo agregar la plantilla.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <Button onClick={handleQuickAdd} variant="outline">
      {children}
    </Button>
  );
}
