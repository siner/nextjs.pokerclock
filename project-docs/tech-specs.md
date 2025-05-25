# Especificaciones Técnicas

## Pila Tecnológica

### Frontend Framework

- **Next.js 14.2.13**: Framework React con App Router
- **React 18**: Biblioteca de interfaz de usuario
- **TypeScript 5**: Tipado estático para JavaScript

### Styling y UI

- **Tailwind CSS 3.4.1**: Framework de CSS utility-first
- **Radix UI**: Componentes primitivos accesibles
  - `@radix-ui/react-accordion`
  - `@radix-ui/react-dialog`
  - `@radix-ui/react-dropdown-menu`
  - `@radix-ui/react-icons`
  - `@radix-ui/react-label`
  - `@radix-ui/react-popover`
  - `@radix-ui/react-select`
  - `@radix-ui/react-slot`
  - `@radix-ui/react-toast`
- **Lucide React**: Iconografía moderna
- **class-variance-authority**: Gestión de variantes de componentes
- **clsx**: Utilidad para clases condicionales
- **tailwind-merge**: Fusión inteligente de clases Tailwind

### Utilidades

- **date-fns 4.1.0**: Manipulación de fechas
- **next-themes 0.3.0**: Gestión de temas (modo oscuro/claro)

### Herramientas de Desarrollo

- **ESLint**: Linting de código
- **Prettier**: Formateo de código
- **PostCSS**: Procesamiento de CSS

## Arquitectura del Sistema

### Estructura de Directorios

```
src/
├── app/                    # App Router de Next.js
│   ├── gametemplates/     # Gestión de plantillas
│   │   ├── [id]/         # Edición de plantilla específica
│   │   ├── create/       # Creación de nueva plantilla
│   │   └── page.tsx      # Lista de plantillas
│   ├── play/             # Reloj de torneo
│   ├── fonts/            # Fuentes personalizadas
│   ├── globals.css       # Estilos globales
│   ├── layout.tsx        # Layout principal
│   ├── manifest.ts       # PWA manifest
│   └── page.tsx          # Página de inicio
├── components/           # Componentes reutilizables
│   ├── ui/              # Componentes base de UI
│   ├── tables/          # Componentes específicos de tablas
│   ├── play-game.tsx    # Componente principal del reloj
│   ├── theme-provider.tsx
│   └── theme-toggle.tsx
├── hooks/               # Custom hooks
├── lib/                 # Utilidades y configuraciones
├── types/               # Definiciones de tipos TypeScript
└── ...
```

### Patrones de Arquitectura

#### 1. Component-Based Architecture

- **Componentes funcionales** con hooks
- **Separación de responsabilidades** entre UI y lógica
- **Composición** sobre herencia
- **Props drilling** minimizado con estado local

#### 2. Client-Side State Management

- **useState** para estado local de componentes
- **useEffect** para efectos secundarios y sincronización
- **localStorage** como única fuente de persistencia
- **Custom hooks** para lógica reutilizable

#### 3. Type-Safe Development

- **TypeScript estricto** en toda la aplicación
- **Interfaces bien definidas** para todas las entidades
- **Type guards** para validación de datos
- **Generics** para componentes reutilizables

## Modelo de Datos

### Entidades Principales

#### GameTemplate

```typescript
type GameTemplate = {
  id: number; // Identificador único
  name: string; // Nombre de la plantilla
  entry: number; // Buy-in del torneo
  fee: number; // Comisión de la casa
  bubble: number; // Posición de la burbuja
  points: string; // Puntos de torneo
  extrapot: number; // Bote extra inicial
  addon_price: number; // Precio del add-on
  addon_points: number; // Puntos del add-on
  double_addon_price: number; // Precio del add-on doble
  double_addon_points: number; // Puntos del add-on doble
  levels: Level[]; // Estructura de niveles
  prize_structures: PrizeStructure[]; // Estructuras de premios
};
```

#### Level

```typescript
type Level = {
  sb: number; // Ciega pequeña
  bb: number; // Ciega grande
  ante: number; // Ante
  time: number; // Duración en minutos
};
```

#### PrizeStructure

```typescript
type PrizeStructure = {
  max_players: number; // Máximo de jugadores para esta estructura
  prizes: Prize[]; // Distribución de premios
};

type Prize = {
  id: number;
  percentaje: number; // Porcentaje del bote
};
```

#### Game

```typescript
type Game = {
  id: number;
  name: string;
  // ... configuración heredada de GameTemplate
  current_level: Level;
  next_level: Level;
  players: number; // Jugadores activos
  total_players: number; // Total de jugadores
  entries: number; // Número de entradas
  addons: number; // Add-ons vendidos
  doubleaddons: number; // Add-ons dobles vendidos
  elapsed: number; // Tiempo transcurrido en segundos
  // ... otros campos de estado
};
```

## Estándares de Codificación

### TypeScript Guidelines

#### 1. Naming Conventions

```typescript
// Interfaces y Types: PascalCase
interface GameTemplate {}
type Level = {};

// Variables y funciones: camelCase
const currentLevel = getCurrentLevel();
function calculatePrizes() {}

// Constantes: UPPER_SNAKE_CASE
const MAX_PLAYERS = 1000;

// Componentes: PascalCase
function PlayGame() {}
```

#### 2. Type Definitions

```typescript
// Preferir interfaces para objetos
interface Props {
  template: string;
  onUpdate: (game: Game) => void;
}

// Usar types para uniones y primitivos
type Status = "playing" | "paused" | "finished";
type PlayerId = number;
```

#### 3. Function Signatures

```typescript
// Parámetros opcionales al final
function createGame(template: GameTemplate, options?: GameOptions): Game;

// Return types explícitos para funciones públicas
function calculateTotalPot(entries: number, addons: number): number;
```

### React Patterns

#### 1. Component Structure

```typescript
// Props interface
interface ComponentProps {
  // props definition
}

// Component function
export default function Component({ prop1, prop2 }: ComponentProps) {
  // 1. Hooks
  const [state, setState] = useState();

  // 2. Effects
  useEffect(() => {
    // effect logic
  }, [dependencies]);

  // 3. Event handlers
  function handleEvent() {
    // handler logic
  }

  // 4. Render
  return (
    // JSX
  );
}
```

#### 2. State Management

```typescript
// Estado local para componentes específicos
const [isPlaying, setIsPlaying] = useState(false);

// Custom hooks para lógica compleja
function useGameTimer(initialTime: number) {
  const [time, setTime] = useState(initialTime);
  // timer logic
  return { time, start, pause, reset };
}
```

#### 3. Event Handling

```typescript
// Handlers específicos y descriptivos
function handlePlayPause() {
  setIsPlaying(!isPlaying);
}

function handleLevelAdvance() {
  setCurrentLevel(nextLevel);
}
```

### CSS/Styling Guidelines

#### 1. Tailwind Conventions

```tsx
// Orden de clases: layout -> spacing -> styling -> responsive
<div className="flex flex-col gap-4 p-6 bg-white rounded-lg md:flex-row">

// Usar componentes para estilos repetitivos
<Button variant="outline" size="lg">
```

#### 2. Component Variants

```typescript
// Usar class-variance-authority para variantes
const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground",
        outline: "border border-input bg-background",
      },
      size: {
        default: "h-10 px-4 py-2",
        lg: "h-11 rounded-md px-8",
      },
    },
  }
);
```

## Configuración del Entorno

### Scripts de Desarrollo

```json
{
  "dev": "next dev", // Desarrollo local
  "dev-local": "next dev --experimental-https", // HTTPS local
  "build": "next build", // Build de producción
  "start": "next start", // Servidor de producción
  "lint": "next lint" // Linting
}
```

### Configuración de Next.js

```javascript
// next.config.mjs
const nextConfig = {
  // Configuración específica del proyecto
};
```

### Configuración de TypeScript

```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true
    // ... otras opciones estrictas
  }
}
```

## Persistencia de Datos

### LocalStorage Strategy

```typescript
// Estructura de almacenamiento
localStorage.setItem("gameTemplates", JSON.stringify(templates));
localStorage.setItem("game", JSON.stringify(currentGame));

// Recuperación con fallbacks
const templates = JSON.parse(
  localStorage.getItem("gameTemplates") || "[]"
) as GameTemplate[];
```

### Data Validation

```typescript
// Validación de datos recuperados
function isValidGameTemplate(obj: any): obj is GameTemplate {
  return (
    obj &&
    typeof obj.id === "number" &&
    typeof obj.name === "string" &&
    Array.isArray(obj.levels)
  );
}
```

## Consideraciones de Rendimiento

### 1. Optimización de Re-renders

- **useCallback** para funciones que se pasan como props
- **useMemo** para cálculos costosos
- **React.memo** para componentes que no cambian frecuentemente

### 2. Gestión de Estado

- Estado local en lugar de contexto global
- Actualizaciones granulares del estado
- Debouncing para inputs frecuentes

### 3. Bundle Optimization

- Tree shaking automático de Next.js
- Importaciones específicas de librerías
- Code splitting por rutas

## Seguridad y Privacidad

### 1. Client-Side Only

- Sin comunicación con servidores externos
- Datos completamente locales
- Sin cookies ni tracking

### 2. Data Sanitization

- Validación de inputs del usuario
- Escape de contenido dinámico
- Límites en tamaños de datos

### 3. Error Handling

- Try-catch en operaciones críticas
- Fallbacks para datos corruptos
- Logging de errores para debugging
