# Flujo de Usuarios y Estructura del Proyecto

## Recorrido del Usuario

### 1. Flujo Principal de Uso

#### 1.1 Primera Visita

```
Página de Inicio
    ↓
[Crear plantilla] → Formulario de Plantilla → Guardar → Lista de Plantillas
    ↓
[Gestionar plantillas] → Lista de Plantillas
    ↓
[Empezar partida] → Selección de Plantilla → Reloj de Torneo
```

#### 1.2 Usuario Recurrente

```
Página de Inicio
    ↓
[Empezar partida] → Selección de Plantilla → Reloj de Torneo
    ↓
(Recuperación automática de partida en curso si existe)
```

### 2. Flujos Detallados por Funcionalidad

#### 2.1 Gestión de Plantillas

**Crear Nueva Plantilla:**

```
Inicio → [Crear plantilla]
    ↓
Formulario de Plantilla:
├── Información Básica (nombre, buy-in, fee, etc.)
├── Configuración de Niveles (SB/BB/Ante/Tiempo)
├── Estructura de Premios (por número de jugadores)
└── [Guardar] → Lista de Plantillas
```

**Gestionar Plantillas Existentes:**

```
Inicio → [Gestionar plantillas]
    ↓
Lista de Plantillas:
├── Ver todas las plantillas creadas
├── [Editar] → Formulario de Edición → [Guardar]
├── [Eliminar] → Confirmación → Eliminación
├── [Duplicar] → Nueva plantilla basada en existente
└── [Usar en torneo] → Reloj de Torneo
```

#### 2.2 Ejecución de Torneo

**Inicio de Torneo:**

```
Lista de Plantillas → [Empezar partida con plantilla X]
    ↓
Reloj de Torneo:
├── Configuración inicial automática
├── Nivel 1 cargado
├── Cronómetro en 00:00
└── Controles disponibles
```

**Durante el Torneo:**

```
Reloj de Torneo:
├── Control de Tiempo:
│   ├── [Play/Pause] → Iniciar/Pausar cronómetro
│   ├── [Siguiente Nivel] → Avance manual
│   ├── [Nivel Anterior] → Retroceso manual
│   └── [Reset] → Reiniciar torneo
├── Gestión de Jugadores:
│   ├── [+/-] Jugadores activos
│   ├── [+/-] Total de jugadores
│   ├── [+/-] Entradas (rebuys)
│   ├── [+/-] Add-ons simples
│   └── [+/-] Add-ons dobles
└── Información en Tiempo Real:
    ├── Nivel actual (SB/BB/Ante)
    ├── Próximo nivel
    ├── Tiempo restante
    ├── Bote total
    ├── Estructura de premios
    └── Tiempo total transcurrido
```

### 3. Estados de la Aplicación

#### 3.1 Estados de Navegación

- **Inicio**: Página principal con opciones principales
- **Lista de Plantillas**: Gestión de plantillas existentes
- **Formulario de Plantilla**: Creación/edición de plantillas
- **Reloj de Torneo**: Ejecución activa de torneo

#### 3.2 Estados del Torneo

- **Sin Iniciar**: Plantilla seleccionada, cronómetro en 00:00
- **En Curso**: Cronómetro activo, nivel progresando
- **Pausado**: Cronómetro detenido, estado preservado
- **Finalizado**: Torneo completado (implementación futura)

#### 3.3 Estados de Persistencia

- **Datos Limpios**: Sin plantillas ni torneos guardados
- **Con Plantillas**: Plantillas guardadas en localStorage
- **Torneo Activo**: Partida en curso guardada automáticamente
- **Recuperación**: Restauración automática al recargar página

## Flujo de Datos

### 1. Arquitectura de Datos

```
localStorage
    ├── gameTemplates: GameTemplate[]
    └── game: Game (torneo actual)
        ↓
React State (componentes)
    ├── Formularios → Validación → localStorage
    ├── Reloj → Actualización continua → localStorage
    └── Listas → Lectura → Renderizado
```

### 2. Ciclo de Vida de los Datos

#### 2.1 Plantillas

```
Creación:
Usuario → Formulario → Validación → GameTemplate → localStorage

Lectura:
localStorage → GameTemplate[] → Lista → Renderizado

Edición:
Lista → Selección → Formulario → Validación → Actualización → localStorage

Eliminación:
Lista → Confirmación → Filtrado → localStorage
```

#### 2.2 Torneo Activo

```
Inicio:
GameTemplate → Game (estado inicial) → localStorage

Ejecución:
Timer → Estado actualizado → Game → localStorage (cada segundo)

Controles:
Usuario → Acción → Estado modificado → Game → localStorage

Recuperación:
Recarga → localStorage → Game → Estado restaurado
```

### 3. Sincronización de Estado

#### 3.1 Componente PlayGame

```
useEffect (inicialización):
├── Verificar torneo en curso
├── Cargar desde localStorage
└── Configurar estado inicial

useEffect (persistencia):
├── Escuchar cambios en game
├── Guardar automáticamente
└── Mantener sincronización

useEffect (timer):
├── Intervalo cada segundo
├── Actualizar tiempo transcurrido
├── Verificar cambio de nivel
└── Guardar estado
```

## Estructura del Proyecto

### 1. Organización de Archivos

#### 1.1 Rutas de la Aplicación (App Router)

```
src/app/
├── page.tsx                    # Página de inicio
├── layout.tsx                  # Layout principal con providers
├── globals.css                 # Estilos globales y variables CSS
├── manifest.ts                 # Configuración PWA
├── favicon.ico                 # Icono de la aplicación
│
├── gametemplates/              # Gestión de plantillas
│   ├── page.tsx               # Lista de plantillas
│   ├── gametemplate-form.tsx  # Formulario reutilizable
│   ├── create/                # Creación de plantilla
│   │   └── page.tsx
│   └── [id]/                  # Edición de plantilla específica
│       └── page.tsx
│
├── play/                      # Reloj de torneo
│   └── page.tsx              # Página del reloj
│
└── fonts/                     # Fuentes personalizadas
    └── GeistVF.woff
```

#### 1.2 Componentes Reutilizables

```
src/components/
├── ui/                        # Componentes base de Radix UI
│   ├── button.tsx
│   ├── input.tsx
│   ├── label.tsx
│   ├── dialog.tsx
│   ├── select.tsx
│   ├── accordion.tsx
│   ├── alert.tsx
│   └── toast.tsx
│
├── tables/                    # Componentes específicos de tablas
│   └── (componentes de tabla si existen)
│
├── play-game.tsx             # Componente principal del reloj
├── theme-provider.tsx        # Provider de temas
├── theme-toggle.tsx          # Selector de tema
└── service-worker.tsx        # Configuración PWA
```

#### 1.3 Utilidades y Configuración

```
src/
├── types/
│   └── index.ts              # Definiciones TypeScript centralizadas
│
├── hooks/
│   └── use-toast.ts          # Hook para notificaciones
│
└── lib/
    └── utils.ts              # Utilidades generales (cn, etc.)
```

### 2. Patrones de Organización

#### 2.1 Separación de Responsabilidades

- **Páginas (app/)**: Routing y layout de alto nivel
- **Componentes (components/)**: Lógica de UI reutilizable
- **Tipos (types/)**: Definiciones de datos centralizadas
- **Hooks (hooks/)**: Lógica de estado reutilizable
- **Utilidades (lib/)**: Funciones helper

#### 2.2 Convenciones de Nomenclatura

- **Archivos de página**: `page.tsx`
- **Componentes**: `PascalCase.tsx`
- **Hooks**: `use-kebab-case.ts`
- **Utilidades**: `kebab-case.ts`
- **Tipos**: `index.ts` (exportación centralizada)

#### 2.3 Estructura de Componentes

```typescript
// Estructura estándar de componente
interface ComponentProps {
  // Props tipadas
}

export default function Component({ props }: ComponentProps) {
  // 1. Hooks de estado
  // 2. Hooks de efecto
  // 3. Funciones de manejo de eventos
  // 4. Funciones auxiliares
  // 5. Return JSX
}
```

### 3. Flujo de Desarrollo

#### 3.1 Ciclo de Desarrollo de Funcionalidades

```
1. Definir tipos en src/types/index.ts
2. Crear/modificar componentes en src/components/
3. Implementar páginas en src/app/
4. Añadir estilos con Tailwind CSS
5. Probar funcionalidad en desarrollo
6. Validar persistencia en localStorage
```

#### 3.2 Gestión de Estado

```
Componente Individual:
├── useState para estado local
├── useEffect para efectos secundarios
└── localStorage para persistencia

Comunicación entre Componentes:
├── Props para datos descendentes
├── Callbacks para eventos ascendentes
└── localStorage como fuente de verdad compartida
```

### 4. Consideraciones de UX

#### 4.1 Responsive Design

- **Mobile First**: Diseño optimizado para móviles
- **Tablet Friendly**: Especialmente importante para uso durante torneos
- **Desktop Enhanced**: Funcionalidad completa en pantallas grandes

#### 4.2 Accesibilidad

- **Radix UI**: Componentes accesibles por defecto
- **Keyboard Navigation**: Navegación completa por teclado
- **Screen Reader**: Etiquetas y roles ARIA apropiados
- **Color Contrast**: Cumplimiento de estándares WCAG

#### 4.3 Experiencia de Usuario

- **Feedback Inmediato**: Respuesta visual a todas las acciones
- **Estado de Carga**: Indicadores durante operaciones
- **Recuperación de Errores**: Manejo graceful de errores
- **Persistencia Transparente**: Guardado automático sin intervención del usuario
