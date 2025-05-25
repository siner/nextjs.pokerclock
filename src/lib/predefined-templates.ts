import { GameTemplate } from "@/types";

// Tipos para plantillas predefinidas
export interface PredefinedTemplate extends Omit<GameTemplate, "id"> {
  category:
    | "sit-and-go"
    | "mtt"
    | "turbo"
    | "hyper-turbo"
    | "deepstack"
    | "bounty"
    | "satellite";
  difficulty: "beginner" | "intermediate" | "advanced";
  description: string;
  tags: string[];
  popularity: number; // 1-5 estrellas
  estimatedPlayers: {
    min: number;
    max: number;
  };
  author: string;
  version: string;
}

// Plantillas predefinidas organizadas por categoría
export const PREDEFINED_TEMPLATES: PredefinedTemplate[] = [
  // === SIT & GO ===
  {
    name: "Sit & Go Clásico 9 Jugadores",
    category: "sit-and-go",
    difficulty: "beginner",
    description:
      "Estructura clásica de Sit & Go para 9 jugadores con niveles de 10 minutos. Ideal para principiantes.",
    tags: ["clásico", "9-max", "principiante"],
    popularity: 5,
    estimatedPlayers: { min: 6, max: 9 },
    author: "PokerClock",
    version: "1.0",
    entry: 25,
    fee: 10,
    bubble: 0,
    points: "1500",
    extrapot: 0,
    addon_price: 0,
    addon_points: 0,
    double_addon_price: 0,
    double_addon_points: 0,
    punctuality_bonus: 0,
    levels: [
      { sb: 100, bb: 200, ante: 0, time: 10 },
      { sb: 150, bb: 300, ante: 0, time: 10 },
      { sb: 200, bb: 400, ante: 0, time: 10 },
      { sb: 300, bb: 600, ante: 0, time: 10 },
      { sb: 400, bb: 800, ante: 0, time: 10 },
      { sb: 500, bb: 1000, ante: 1000, time: 10 },
      { sb: 600, bb: 1200, ante: 1200, time: 10 },
      { sb: 800, bb: 1600, ante: 1600, time: 10 },
      { sb: 1000, bb: 2000, ante: 2000, time: 10 },
      { sb: 1500, bb: 3000, ante: 3000, time: 10 },
    ],
    prize_structures: [
      {
        max_players: 9,
        prizes: [
          { id: 1, percentaje: 50 },
          { id: 2, percentaje: 30 },
          { id: 3, percentaje: 20 },
        ],
      },
    ],
  },

  {
    name: "Sit & Go Turbo 6-Max",
    category: "sit-and-go",
    difficulty: "intermediate",
    description:
      "Sit & Go turbo de 6 jugadores con niveles de 6 minutos. Acción rápida y emocionante.",
    tags: ["turbo", "6-max", "rápido"],
    popularity: 4,
    estimatedPlayers: { min: 4, max: 6 },
    author: "PokerClock",
    version: "1.0",
    entry: 50,
    fee: 5,
    bubble: 0,
    points: "1500",
    extrapot: 0,
    addon_price: 0,
    addon_points: 0,
    double_addon_price: 0,
    double_addon_points: 0,
    punctuality_bonus: 0,
    levels: [
      { sb: 100, bb: 200, ante: 0, time: 6 },
      { sb: 100, bb: 300, ante: 0, time: 6 },
      { sb: 200, bb: 400, ante: 0, time: 6 },
      { sb: 300, bb: 600, ante: 0, time: 6 },
      { sb: 400, bb: 800, ante: 0, time: 6 },
      { sb: 500, bb: 1000, ante: 1000, time: 6 },
      { sb: 600, bb: 1200, ante: 1200, time: 6 },
      { sb: 800, bb: 1600, ante: 1600, time: 6 },
      { sb: 1200, bb: 2400, ante: 2400, time: 6 },
      { sb: 1500, bb: 3000, ante: 3000, time: 6 },
    ],
    prize_structures: [
      {
        max_players: 6,
        prizes: [
          { id: 1, percentaje: 65 },
          { id: 2, percentaje: 35 },
        ],
      },
    ],
  },

  // === MULTI-TABLE TOURNAMENT ===
  {
    name: "MTT Clásico - Estructura Lenta",
    category: "mtt",
    difficulty: "beginner",
    description:
      "Torneo multi-mesa con estructura lenta de 20 minutos por nivel. Perfecto para torneos largos y estratégicos.",
    tags: ["MTT", "estructura-lenta", "estratégico"],
    popularity: 5,
    estimatedPlayers: { min: 20, max: 200 },
    author: "PokerClock",
    version: "1.0",
    entry: 100,
    fee: 10,
    bubble: 50,
    points: "10000",
    extrapot: 0,
    addon_price: 100,
    addon_points: 10000,
    double_addon_price: 0,
    double_addon_points: 0,
    punctuality_bonus: 1000,
    levels: [
      { sb: 100, bb: 200, ante: 0, time: 20 },
      { sb: 100, bb: 300, ante: 0, time: 20 },
      { sb: 200, bb: 400, ante: 0, time: 20 },
      { sb: 300, bb: 600, ante: 0, time: 20 },
      { sb: 400, bb: 800, ante: 0, time: 20 },
      { sb: 500, bb: 1000, ante: 1000, time: 20 },
      { sb: 600, bb: 1200, ante: 1200, time: 20 },
      { sb: 800, bb: 1600, ante: 1600, time: 20 },
      { sb: 1000, bb: 2000, ante: 2000, time: 20 },
      { sb: 1200, bb: 2400, ante: 2400, time: 20 },
      { sb: 1500, bb: 3000, ante: 3000, time: 20 },
      { sb: 2000, bb: 4000, ante: 4000, time: 20 },
      { sb: 2500, bb: 5000, ante: 5000, time: 20 },
      { sb: 3000, bb: 6000, ante: 6000, time: 20 },
      { sb: 4000, bb: 8000, ante: 8000, time: 20 },
    ],
    prize_structures: [
      {
        max_players: 50,
        prizes: [
          { id: 1, percentaje: 40 },
          { id: 2, percentaje: 25 },
          { id: 3, percentaje: 15 },
          { id: 4, percentaje: 10 },
          { id: 5, percentaje: 10 },
        ],
      },
      {
        max_players: 100,
        prizes: [
          { id: 1, percentaje: 30 },
          { id: 2, percentaje: 20 },
          { id: 3, percentaje: 15 },
          { id: 4, percentaje: 10 },
          { id: 5, percentaje: 8 },
          { id: 6, percentaje: 7 },
          { id: 7, percentaje: 5 },
          { id: 8, percentaje: 5 },
        ],
      },
    ],
  },

  // === TURBO ===
  {
    name: "Turbo Express",
    category: "turbo",
    difficulty: "intermediate",
    description:
      "Torneo turbo con niveles de 8 minutos. Estructura agresiva para jugadores experimentados.",
    tags: ["turbo", "agresivo", "8-minutos"],
    popularity: 4,
    estimatedPlayers: { min: 10, max: 50 },
    author: "PokerClock",
    version: "1.0",
    entry: 75,
    fee: 8,
    bubble: 25,
    points: "5000",
    extrapot: 0,
    addon_price: 75,
    addon_points: 5000,
    double_addon_price: 150,
    double_addon_points: 12000,
    punctuality_bonus: 500,
    levels: [
      { sb: 100, bb: 200, ante: 0, time: 8 },
      { sb: 100, bb: 300, ante: 0, time: 8 },
      { sb: 200, bb: 400, ante: 0, time: 8 },
      { sb: 300, bb: 600, ante: 0, time: 8 },
      { sb: 400, bb: 800, ante: 0, time: 8 },
      { sb: 500, bb: 1000, ante: 1000, time: 8 },
      { sb: 600, bb: 1200, ante: 1200, time: 8 },
      { sb: 800, bb: 1600, ante: 1600, time: 8 },
      { sb: 1000, bb: 2000, ante: 2000, time: 8 },
      { sb: 1200, bb: 2400, ante: 2400, time: 8 },
      { sb: 1500, bb: 3000, ante: 3000, time: 8 },
      { sb: 2000, bb: 4000, ante: 4000, time: 8 },
      { sb: 2500, bb: 5000, ante: 5000, time: 8 },
    ],
    prize_structures: [
      {
        max_players: 30,
        prizes: [
          { id: 1, percentaje: 45 },
          { id: 2, percentaje: 25 },
          { id: 3, percentaje: 15 },
          { id: 4, percentaje: 15 },
        ],
      },
    ],
  },

  // === HYPER TURBO ===
  {
    name: "Hyper Turbo Lightning",
    category: "hyper-turbo",
    difficulty: "advanced",
    description:
      "Hyper turbo extremo con niveles de 3 minutos. Solo para jugadores muy experimentados.",
    tags: ["hyper-turbo", "extremo", "3-minutos", "experto"],
    popularity: 3,
    estimatedPlayers: { min: 6, max: 18 },
    author: "PokerClock",
    version: "1.0",
    entry: 30,
    fee: 3,
    bubble: 0,
    points: "1500",
    extrapot: 0,
    addon_price: 0,
    addon_points: 0,
    double_addon_price: 0,
    double_addon_points: 0,
    punctuality_bonus: 0,
    levels: [
      { sb: 100, bb: 200, ante: 0, time: 3 },
      { sb: 100, bb: 300, ante: 0, time: 3 },
      { sb: 200, bb: 400, ante: 0, time: 3 },
      { sb: 300, bb: 600, ante: 0, time: 3 },
      { sb: 400, bb: 800, ante: 0, time: 3 },
      { sb: 500, bb: 1000, ante: 1000, time: 3 },
      { sb: 600, bb: 1200, ante: 1200, time: 3 },
      { sb: 800, bb: 1600, ante: 1600, time: 3 },
      { sb: 1000, bb: 2000, ante: 2000, time: 3 },
      { sb: 1200, bb: 2400, ante: 2400, time: 3 },
      { sb: 1500, bb: 3000, ante: 3000, time: 3 },
      { sb: 2000, bb: 4000, ante: 4000, time: 3 },
      { sb: 2500, bb: 5000, ante: 5000, time: 3 },
      { sb: 3000, bb: 6000, ante: 6000, time: 3 },
      { sb: 4000, bb: 8000, ante: 8000, time: 3 },
      { sb: 5000, bb: 10000, ante: 10000, time: 3 },
    ],
    prize_structures: [
      {
        max_players: 18,
        prizes: [
          { id: 1, percentaje: 50 },
          { id: 2, percentaje: 30 },
          { id: 3, percentaje: 20 },
        ],
      },
    ],
  },

  // === DEEPSTACK ===
  {
    name: "Deepstack Marathon",
    category: "deepstack",
    difficulty: "intermediate",
    description:
      "Torneo deepstack con niveles de 30 minutos y muchas fichas iniciales. Para jugadores que disfrutan del poker estratégico.",
    tags: ["deepstack", "30-minutos", "estratégico", "marathon"],
    popularity: 4,
    estimatedPlayers: { min: 15, max: 80 },
    author: "PokerClock",
    version: "1.0",
    entry: 150,
    fee: 15,
    bubble: 75,
    points: "20000",
    extrapot: 0,
    addon_price: 150,
    addon_points: 20000,
    double_addon_price: 0,
    double_addon_points: 0,
    punctuality_bonus: 2000,
    levels: [
      { sb: 100, bb: 200, ante: 0, time: 30 },
      { sb: 200, bb: 400, ante: 0, time: 30 },
      { sb: 300, bb: 600, ante: 0, time: 30 },
      { sb: 400, bb: 800, ante: 0, time: 30 },
      { sb: 500, bb: 1000, ante: 0, time: 30 },
      { sb: 600, bb: 1200, ante: 0, time: 30 },
      { sb: 800, bb: 1600, ante: 0, time: 30 },
      { sb: 1000, bb: 2000, ante: 2000, time: 30 },
      { sb: 2000, bb: 4000, ante: 4000, time: 30 },
      { sb: 3000, bb: 6000, ante: 6000, time: 30 },
      { sb: 4000, bb: 8000, ante: 8000, time: 30 },
      { sb: 5000, bb: 10000, ante: 10000, time: 30 },
      { sb: 6000, bb: 12000, ante: 12000, time: 30 },
      { sb: 8000, bb: 16000, ante: 16000, time: 30 },
      { sb: 10000, bb: 20000, ante: 20000, time: 30 },
      { sb: 12000, bb: 24000, ante: 24000, time: 30 },
      { sb: 15000, bb: 30000, ante: 30000, time: 30 },
    ],
    prize_structures: [
      {
        max_players: 50,
        prizes: [
          { id: 1, percentaje: 35 },
          { id: 2, percentaje: 22 },
          { id: 3, percentaje: 15 },
          { id: 4, percentaje: 10 },
          { id: 5, percentaje: 8 },
          { id: 6, percentaje: 6 },
          { id: 7, percentaje: 4 },
        ],
      },
    ],
  },

  // === BOUNTY ===
  {
    name: "Bounty Hunter",
    category: "bounty",
    difficulty: "intermediate",
    description:
      "Torneo con sistema de recompensas. Parte del buy-in va al bote de premios y parte como bounty por eliminar jugadores.",
    tags: ["bounty", "recompensas", "eliminaciones"],
    popularity: 4,
    estimatedPlayers: { min: 12, max: 60 },
    author: "PokerClock",
    version: "1.0",
    entry: 60, // 60€ al prize pool
    fee: 8,
    bubble: 0,
    bounty: 20, // 20€ bounty por eliminación
    points: "8000",
    extrapot: 0,
    addon_price: 80,
    addon_points: 8000,
    double_addon_price: 0,
    double_addon_points: 0,
    punctuality_bonus: 800,
    levels: [
      { sb: 100, bb: 200, ante: 0, time: 15 },
      { sb: 200, bb: 400, ante: 0, time: 15 },
      { sb: 300, bb: 600, ante: 0, time: 15 },
      { sb: 400, bb: 800, ante: 0, time: 15 },
      { sb: 500, bb: 1000, ante: 0, time: 15 },
      { sb: 600, bb: 1200, ante: 0, time: 15 },
      { sb: 800, bb: 1600, ante: 1600, time: 15 },
      { sb: 1000, bb: 2000, ante: 2000, time: 15 },
      { sb: 1500, bb: 3000, ante: 3000, time: 15 },
      { sb: 2000, bb: 4000, ante: 4000, time: 15 },
      { sb: 2500, bb: 5000, ante: 5000, time: 15 },
      { sb: 3000, bb: 6000, ante: 6000, time: 15 },
      { sb: 4000, bb: 8000, ante: 8000, time: 15 },
      { sb: 5000, bb: 10000, ante: 10000, time: 15 },
      { sb: 6000, bb: 12000, ante: 12000, time: 15 },
      { sb: 8000, bb: 16000, ante: 16000, time: 15 },
      { sb: 10000, bb: 20000, ante: 20000, time: 15 },
    ],
    prize_structures: [
      {
        max_players: 40,
        prizes: [
          { id: 1, percentaje: 40 },
          { id: 2, percentaje: 25 },
          { id: 3, percentaje: 15 },
          { id: 4, percentaje: 10 },
          { id: 5, percentaje: 10 },
        ],
      },
    ],
  },

  // === SATELLITE ===
  {
    name: "Satellite Qualifier",
    category: "satellite",
    difficulty: "beginner",
    description:
      "Torneo satélite para clasificar a eventos más grandes. Estructura diseñada para otorgar múltiples entradas.",
    tags: ["satellite", "qualifier", "clasificatorio"],
    popularity: 3,
    estimatedPlayers: { min: 20, max: 100 },
    author: "PokerClock",
    version: "1.0",
    entry: 25,
    fee: 3,
    bubble: 0,
    points: "3000",
    extrapot: 0,
    addon_price: 0,
    addon_points: 0,
    double_addon_price: 0,
    double_addon_points: 0,
    punctuality_bonus: 0,
    levels: [
      { sb: 100, bb: 200, ante: 0, time: 12 },
      { sb: 200, bb: 400, ante: 0, time: 12 },
      { sb: 300, bb: 600, ante: 0, time: 12 },
      { sb: 400, bb: 800, ante: 0, time: 12 },
      { sb: 500, bb: 1000, ante: 0, time: 12 },
      { sb: 600, bb: 1200, ante: 0, time: 12 },
      { sb: 800, bb: 1600, ante: 0, time: 12 },
      { sb: 1000, bb: 2000, ante: 2000, time: 12 },
      { sb: 1500, bb: 3000, ante: 3000, time: 12 },
      { sb: 2000, bb: 4000, ante: 4000, time: 12 },
      { sb: 2500, bb: 5000, ante: 5000, time: 12 },
      { sb: 3000, bb: 6000, ante: 6000, time: 12 },
      { sb: 4000, bb: 8000, ante: 8000, time: 12 },
      { sb: 5000, bb: 10000, ante: 10000, time: 12 },
      { sb: 6000, bb: 12000, ante: 12000, time: 12 },
      { sb: 8000, bb: 16000, ante: 16000, time: 12 },
    ],
    prize_structures: [
      {
        max_players: 50,
        prizes: [
          { id: 1, percentaje: 20 }, // 5 entradas de 20% cada una
          { id: 2, percentaje: 20 },
          { id: 3, percentaje: 20 },
          { id: 4, percentaje: 20 },
          { id: 5, percentaje: 20 },
        ],
      },
    ],
  },

  // === FREEROLL ===
  {
    name: "Freeroll Semanal",
    category: "sit-and-go",
    difficulty: "beginner",
    description:
      "Torneo gratuito semanal para principiantes. Excelente para practicar sin riesgo.",
    tags: ["freeroll", "gratuito", "práctica", "principiante"],
    popularity: 5,
    estimatedPlayers: { min: 10, max: 100 },
    author: "PokerClock",
    version: "1.0",
    entry: 0,
    fee: 0,
    bubble: 0,
    points: "2000",
    extrapot: 100, // 100€ de premio patrocinado añadido al bote
    addon_price: 0,
    addon_points: 0,
    double_addon_price: 0,
    double_addon_points: 0,
    punctuality_bonus: 200,
    levels: [
      { sb: 100, bb: 200, ante: 0, time: 15 },
      { sb: 200, bb: 400, ante: 0, time: 15 },
      { sb: 300, bb: 600, ante: 0, time: 15 },
      { sb: 400, bb: 800, ante: 0, time: 15 },
      { sb: 500, bb: 1000, ante: 0, time: 15 },
      { sb: 600, bb: 1200, ante: 0, time: 15 },
      { sb: 800, bb: 1600, ante: 0, time: 15 },
      { sb: 1000, bb: 2000, ante: 2000, time: 15 },
      { sb: 1500, bb: 3000, ante: 3000, time: 15 },
      { sb: 2000, bb: 4000, ante: 4000, time: 15 },
      { sb: 2500, bb: 5000, ante: 5000, time: 15 },
      { sb: 3000, bb: 6000, ante: 6000, time: 15 },
      { sb: 4000, bb: 8000, ante: 8000, time: 15 },
      { sb: 5000, bb: 10000, ante: 10000, time: 15 },
      { sb: 6000, bb: 12000, ante: 12000, time: 15 },
      { sb: 8000, bb: 16000, ante: 16000, time: 15 },
    ],
    prize_structures: [
      {
        max_players: 50,
        prizes: [
          { id: 1, percentaje: 50 },
          { id: 2, percentaje: 30 },
          { id: 3, percentaje: 20 },
        ],
      },
    ],
  },
];

// Utilidades para trabajar con plantillas predefinidas
export class PredefinedTemplateManager {
  // Obtener todas las plantillas
  static getAllTemplates(): PredefinedTemplate[] {
    return PREDEFINED_TEMPLATES;
  }

  // Filtrar por categoría
  static getByCategory(
    category: PredefinedTemplate["category"]
  ): PredefinedTemplate[] {
    return PREDEFINED_TEMPLATES.filter(
      (template) => template.category === category
    );
  }

  // Filtrar por dificultad
  static getByDifficulty(
    difficulty: PredefinedTemplate["difficulty"]
  ): PredefinedTemplate[] {
    return PREDEFINED_TEMPLATES.filter(
      (template) => template.difficulty === difficulty
    );
  }

  // Obtener las más populares
  static getPopular(limit: number = 5): PredefinedTemplate[] {
    return PREDEFINED_TEMPLATES.sort(
      (a, b) => b.popularity - a.popularity
    ).slice(0, limit);
  }

  // Buscar por texto
  static search(query: string): PredefinedTemplate[] {
    const searchTerm = query.toLowerCase();
    return PREDEFINED_TEMPLATES.filter(
      (template) =>
        template.name.toLowerCase().includes(searchTerm) ||
        template.description.toLowerCase().includes(searchTerm) ||
        template.tags.some((tag) => tag.toLowerCase().includes(searchTerm))
    );
  }

  // Filtrar por número de jugadores
  static getByPlayerCount(playerCount: number): PredefinedTemplate[] {
    return PREDEFINED_TEMPLATES.filter(
      (template) =>
        playerCount >= template.estimatedPlayers.min &&
        playerCount <= template.estimatedPlayers.max
    );
  }

  // Convertir plantilla predefinida a GameTemplate
  static toGameTemplate(
    predefinedTemplate: PredefinedTemplate,
    newId: number
  ): GameTemplate {
    const {
      category,
      difficulty,
      description,
      tags,
      popularity,
      estimatedPlayers,
      author,
      version,
      ...gameTemplateData
    } = predefinedTemplate;

    return {
      id: newId,
      ...gameTemplateData,
    };
  }

  // Obtener categorías disponibles
  static getCategories(): Array<{
    value: PredefinedTemplate["category"];
    label: string;
    description: string;
  }> {
    return [
      {
        value: "sit-and-go",
        label: "Sit & Go",
        description: "Torneos de mesa única que comienzan cuando se llenan",
      },
      {
        value: "mtt",
        label: "Multi-Table Tournament",
        description: "Torneos grandes con múltiples mesas",
      },
      {
        value: "turbo",
        label: "Turbo",
        description: "Torneos con niveles más rápidos",
      },
      {
        value: "hyper-turbo",
        label: "Hyper Turbo",
        description: "Torneos extremadamente rápidos",
      },
      {
        value: "deepstack",
        label: "Deepstack",
        description: "Torneos con muchas fichas y niveles largos",
      },
      {
        value: "bounty",
        label: "Bounty",
        description: "Torneos con recompensas por eliminaciones",
      },
      {
        value: "satellite",
        label: "Satellite",
        description: "Torneos clasificatorios para eventos más grandes",
      },
    ];
  }

  // Obtener niveles de dificultad
  static getDifficulties(): Array<{
    value: PredefinedTemplate["difficulty"];
    label: string;
    description: string;
  }> {
    return [
      {
        value: "beginner",
        label: "Principiante",
        description: "Estructuras simples y fáciles de seguir",
      },
      {
        value: "intermediate",
        label: "Intermedio",
        description: "Estructuras balanceadas para jugadores con experiencia",
      },
      {
        value: "advanced",
        label: "Avanzado",
        description: "Estructuras complejas para jugadores expertos",
      },
    ];
  }
}
