# 🃏 Reloj de Poker - Gestor de Torneos Profesional

Una aplicación web moderna y completa para gestionar torneos de poker de manera profesional. Desarrollada con Next.js 14, TypeScript y Tailwind CSS, con un enfoque en la experiencia de usuario y la robustez del sistema.

## 🎯 Características Principales

### ⚡ Gestión Completa de Torneos

- **Plantillas personalizables**: Crea y guarda estructuras de torneo reutilizables con validaciones robustas
- **Configuración flexible**: Define buy-ins, comisiones, add-ons, bounties y estructuras de premios
- **Niveles de ciegas**: Configura SB/BB/Ante y tiempos para cada nivel con progresión automática
- **Múltiples estructuras de premios**: Adapta la distribución según el número de jugadores automáticamente
- **Bono de puntualidad**: Sistema completo de puntos extra para jugadores que llegan a tiempo
- **Torneos bounty**: Soporte completo para torneos con recompensas por eliminación

### ⏱️ Reloj de Torneo en Tiempo Real

- **Cronómetro preciso**: Control automático de niveles con precisión al segundo
- **Controles intuitivos**: Play, pausa, avance manual y retroceso de niveles con atajos de teclado
- **Visualización clara**: Información del nivel actual y próximo siempre visible
- **Notificaciones sonoras**: Alertas automáticas de cambio de nivel y bono de puntualidad
- **Tiempo total**: Seguimiento del tiempo transcurrido del torneo
- **Interfaz moderna**: Cards con gradientes, iconos contextuales y diseño responsive

### 👥 Gestión de Participantes

- **Control de jugadores**: Registro de activos, eliminados y total de participantes
- **Entradas y rebuys**: Gestión completa de entradas adicionales con actualización en tiempo real
- **Add-ons**: Control de add-ons simples y dobles con precios configurables
- **Cálculo automático**: Bote total, comisiones, bounties y premios en tiempo real
- **Stack promedio**: Cálculo dinámico incluyendo fichas de bonos de puntualidad

### 🏆 Sistema de Premios Inteligente

- **Selección automática**: Elige la estructura de premios más apropiada según participantes
- **Cálculo dinámico**: Actualización en tiempo real según el bote acumulado
- **Múltiples estructuras**: Define diferentes distribuciones para distintos tamaños de torneo
- **Separación transparente**: Cálculo claro de bote real vs comisiones, bounties y extras

### 📊 Historial y Estadísticas

- **Guardado automático**: Todos los torneos completados se guardan automáticamente
- **Estadísticas completas**: Total de torneos, jugadores, botes y duraciones promedio
- **Filtros avanzados**: Búsqueda por fecha, nombre, número de jugadores
- **Vista detallada**: Información completa de cada torneo con ganadores y estadísticas
- **Exportación/Importación**: Sistema completo de backup y restauración de datos

### 💾 Persistencia y Recuperación

- **Guardado automático**: Todos los datos se guardan automáticamente en localStorage
- **Recuperación robusta**: Sistema avanzado de validación y recuperación de datos corruptos
- **Sin servidor**: Funciona completamente offline, datos privados en tu dispositivo
- **Sincronización**: Estado consistente entre recargas de página
- **Manejo de errores**: Sistema completo de error boundaries y logging

### 🎨 Experiencia de Usuario

- **Diseño moderno**: Interfaz con gradientes, Cards interactivas y animaciones suaves
- **Responsive design**: Optimizado para desktop, tablet y móvil
- **Modo oscuro/claro**: Tema automático según preferencias del sistema
- **Atajos de teclado**: 13 atajos para acciones comunes (Space, R, N, P, etc.)
- **Confirmaciones**: Diálogos de confirmación para acciones destructivas
- **Estados de carga**: Feedback visual completo con spinners y skeletons

## 🚀 Inicio Rápido

### Instalación

```bash
# Clonar el repositorio
git clone https://github.com/siner/nextjs.pokerclock.git
cd nextjs.pokerclock

# Instalar dependencias
pnpm install

# Iniciar servidor de desarrollo
pnpm dev
```

### Uso Básico

1. **Crear una plantilla**:

   - Ve a "Crear plantilla" desde la página principal
   - Configura nombre, buy-in, comisiones y bounty (opcional)
   - Define niveles de ciegas con progresión automática
   - Establece estructuras de premios para diferentes tamaños
   - Configura bono de puntualidad si es necesario
   - Guarda la plantilla con validaciones automáticas

2. **Iniciar un torneo**:

   - Selecciona "Empezar partida" desde el dashboard
   - Elige una plantilla existente o usa plantillas predefinidas
   - Configura jugadores iniciales y parámetros
   - Presiona Play para comenzar el cronómetro

3. **Durante el torneo**:

   - El cronómetro avanza automáticamente con notificaciones
   - Ajusta jugadores y entradas según sea necesario
   - Usa atajos de teclado para control rápido (Space para play/pause)
   - Consulta premios y estadísticas en tiempo real
   - Finaliza el torneo para guardarlo en el historial

4. **Gestión de datos**:
   - Exporta plantillas e historial como backup
   - Importa datos con estrategias de conflicto configurables
   - Consulta estadísticas detalladas en el historial
   - Usa plantillas predefinidas para empezar rápidamente

## 🛠️ Tecnologías Utilizadas

- **Framework**: Next.js 14 con App Router y Server Components
- **Lenguaje**: TypeScript para type safety completo
- **Estilos**: Tailwind CSS para diseño responsive y moderno
- **Componentes**: Radix UI para accesibilidad y funcionalidad avanzada
- **Iconos**: Lucide React para iconografía moderna y consistente
- **Temas**: next-themes para modo oscuro/claro automático
- **Fechas**: date-fns para manipulación de tiempo y fechas
- **Validaciones**: Sistema personalizado de validaciones con errores y advertencias

## 📱 Compatibilidad

- ✅ **Navegadores**: Chrome, Firefox, Safari, Edge (versiones modernas)
- ✅ **Dispositivos**: Desktop, tablet, móvil con diseño responsive completo
- ✅ **Offline**: Funciona completamente sin conexión a internet
- ✅ **PWA**: Preparado para instalación como aplicación nativa
- ✅ **Accesibilidad**: Componentes accesibles con soporte para lectores de pantalla

## 🎮 Atajos de Teclado

| Atajo             | Acción                    |
| ----------------- | ------------------------- |
| `Espacio`         | Play/Pause del cronómetro |
| `R`               | Reset del cronómetro      |
| `N`               | Siguiente nivel           |
| `P`               | Nivel anterior            |
| `+`               | Añadir jugador            |
| `-`               | Quitar jugador            |
| `Ctrl + +`        | Añadir entrada            |
| `Ctrl + -`        | Quitar entrada            |
| `A`               | Añadir add-on             |
| `Shift + A`       | Añadir doble add-on       |
| `F`               | Finalizar torneo          |
| `?` o `Shift + /` | Mostrar ayuda de atajos   |

## 🎨 Capturas de Pantalla

### Página Principal

Interfaz moderna con Cards de navegación interactivas, gradientes y guía rápida paso a paso.

### Gestión de Plantillas

Dashboard con estadísticas, tabla responsive y acciones rápidas de exportación/importación.

### Reloj de Torneo

Vista principal durante la ejecución con cronómetro integrado, estadísticas laterales y controles intuitivos.

### Historial de Torneos

Sistema completo de filtros, estadísticas globales y vista detallada de cada torneo.

## 📖 Documentación

La documentación completa del proyecto se encuentra en la carpeta `project-docs/`:

- [`overview.md`](project-docs/overview.md) - Descripción general y objetivos del proyecto
- [`requirements.md`](project-docs/requirements.md) - Requisitos funcionales y técnicos detallados
- [`tech-specs.md`](project-docs/tech-specs.md) - Especificaciones técnicas y arquitectura
- [`user-structure.md`](project-docs/user-structure.md) - Flujo de usuarios y estructura del proyecto
- [`timeline.md`](project-docs/timeline.md) - Cronograma y progreso del desarrollo
- [`TASKS.md`](project-docs/TASKS.md) - Gestión de tareas, roadmap y correcciones

## 🔧 Scripts Disponibles

```bash
# Desarrollo local
pnpm dev

# Desarrollo con HTTPS
pnpm dev-local

# Build de producción
pnpm build

# Iniciar servidor de producción
pnpm start

# Linting y formateo
pnpm lint
```

## 🚀 Estado del Proyecto

### ✅ Funcionalidades Completadas (v1.0)

- **Core**: Gestión completa de plantillas y torneos
- **Validaciones**: Sistema robusto con errores y advertencias
- **UX**: Confirmaciones, estados de carga y feedback visual
- **Cronómetro**: Optimizado con precisión y controles avanzados
- **Datos**: Exportación/importación completa con validaciones
- **Plantillas**: Biblioteca de 9 plantillas predefinidas
- **Historial**: Sistema completo con estadísticas y filtros
- **Estética**: Rediseño moderno con Cards, gradientes y responsive
- **Atajos**: 13 atajos de teclado para control rápido
- **Navegación**: Sistema consistente en todas las páginas
- **Responsive**: Optimización completa para móviles

### 🔧 Correcciones Recientes

- **CORRECCIÓN-012**: Actualización dinámica de bounties en tiempo real
- **CORRECCIÓN-011**: Integración de puntos de puntualidad en total de fichas
- **CORRECCIÓN-010**: Navegación consistente en todas las páginas
- **CORRECCIÓN-009**: Mejora del header y botones de control
- **CORRECCIÓN-008**: Integración de controles en el cronómetro
- **CORRECCIÓN-007**: Alineación visual perfecta de Cards
- **CORRECCIÓN-006**: Lógica correcta de selección de estructura de premios
- **CORRECCIÓN-005**: Espaciado y layout consistente
- **CORRECCIÓN-004**: Campo bounty guardado correctamente
- **CORRECCIÓN-003**: Indicador visual del bono de puntualidad

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

### 📋 Próximas Mejoras (v1.1)

- [ ] **Modo presentación**: Vista de pantalla completa para proyección
- [ ] **Tooltips contextuales**: Ayuda integrada en formularios
- [ ] **PWA completa**: Service worker y notificaciones push
- [ ] **Optimizaciones**: Mejoras de rendimiento y memoria

## ⚠️ Consideraciones Importantes

- **Datos locales**: Toda la información se guarda en el localStorage de tu navegador
- **Sin servidor**: No se envían datos a ningún servidor externo
- **Privacidad**: Tus datos permanecen completamente privados en tu dispositivo
- **Backup**: Usa la función de exportación para crear copias de seguridad regulares
- **Compatibilidad**: Requiere navegadores modernos con soporte para ES2020+

## 📊 Métricas del Proyecto

- **Tareas Completadas**: 47/51 (92%)
- **Líneas de Código**: ~15,000 líneas TypeScript/TSX
- **Componentes**: 50+ componentes reutilizables
- **Páginas**: 6 páginas principales con navegación completa
- **Funcionalidades**: 20+ características principales implementadas

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🙏 Agradecimientos

- [Next.js](https://nextjs.org/) por el excelente framework de React
- [Radix UI](https://www.radix-ui.com/) por los componentes accesibles y robustos
- [Tailwind CSS](https://tailwindcss.com/) por el sistema de diseño moderno
- [Lucide](https://lucide.dev/) por los iconos hermosos y consistentes
- [Vercel](https://vercel.com/) por la plataforma de deployment

---

**¿Tienes preguntas o sugerencias?** Abre un issue o contacta al equipo de desarrollo.

**¿Te gusta el proyecto?** ¡Dale una ⭐ en GitHub!

**¿Quieres contribuir?** Revisa las tareas pendientes en [`TASKS.md`](project-docs/TASKS.md) y únete al desarrollo.
