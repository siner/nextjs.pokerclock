# 🃏 Reloj de Poker - Gestor de Torneos

Una aplicación web moderna y completa para gestionar torneos de poker de manera profesional. Desarrollada con Next.js 14, TypeScript y Tailwind CSS.

## 🎯 Características Principales

### ⚡ Gestión Completa de Torneos

- **Plantillas personalizables**: Crea y guarda estructuras de torneo reutilizables
- **Configuración flexible**: Define buy-ins, comisiones, add-ons y estructuras de premios
- **Niveles de ciegas**: Configura SB/BB/Ante y tiempos para cada nivel
- **Múltiples estructuras de premios**: Adapta la distribución según el número de jugadores

### ⏱️ Reloj de Torneo en Tiempo Real

- **Cronómetro preciso**: Control automático de niveles con precisión al segundo
- **Controles intuitivos**: Play, pausa, avance manual y retroceso de niveles
- **Visualización clara**: Información del nivel actual y próximo siempre visible
- **Notificaciones sonoras**: Alertas automáticas de cambio de nivel
- **Tiempo total**: Seguimiento del tiempo transcurrido del torneo

### 👥 Gestión de Participantes

- **Control de jugadores**: Registro de activos, eliminados y total de participantes
- **Entradas y rebuys**: Gestión completa de entradas adicionales
- **Add-ons**: Control de add-ons simples y dobles con precios configurables
- **Cálculo automático**: Bote total, comisiones y premios en tiempo real

### 🏆 Sistema de Premios Inteligente

- **Selección automática**: Elige la estructura de premios según participantes
- **Cálculo dinámico**: Actualización en tiempo real según el bote acumulado
- **Múltiples estructuras**: Define diferentes distribuciones para distintos tamaños
- **Separación de comisiones**: Cálculo transparente de bote real vs comisiones

### 💾 Persistencia y Recuperación

- **Guardado automático**: Todos los datos se guardan automáticamente en localStorage
- **Recuperación de sesión**: Continúa automáticamente torneos interrumpidos
- **Sin servidor**: Funciona completamente offline, datos privados en tu dispositivo
- **Sincronización**: Estado consistente entre recargas de página

## 🚀 Inicio Rápido

### Instalación

```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/nextjs.pokerclock.git
cd nextjs.pokerclock

# Instalar dependencias
pnpm install

# Iniciar servidor de desarrollo
pnpm dev
```

### Uso Básico

1. **Crear una plantilla**:

   - Ve a "Crear plantilla"
   - Configura nombre, buy-in, comisiones
   - Define niveles de ciegas y tiempos
   - Establece estructuras de premios
   - Guarda la plantilla

2. **Iniciar un torneo**:

   - Selecciona "Empezar partida"
   - Elige una plantilla existente
   - Configura jugadores iniciales
   - Presiona Play para comenzar

3. **Durante el torneo**:
   - El cronómetro avanza automáticamente
   - Ajusta jugadores y entradas según sea necesario
   - Controla manualmente el avance de niveles si es necesario
   - Consulta premios en tiempo real

## 🛠️ Tecnologías Utilizadas

- **Framework**: Next.js 14 con App Router
- **Lenguaje**: TypeScript para type safety completo
- **Estilos**: Tailwind CSS para diseño responsive
- **Componentes**: Radix UI para accesibilidad y funcionalidad
- **Iconos**: Lucide React para iconografía moderna
- **Temas**: next-themes para modo oscuro/claro
- **Fechas**: date-fns para manipulación de tiempo

## 📱 Compatibilidad

- ✅ **Navegadores**: Chrome, Firefox, Safari, Edge (versiones modernas)
- ✅ **Dispositivos**: Desktop, tablet, móvil
- ✅ **Offline**: Funciona completamente sin conexión
- ✅ **PWA**: Instalable como aplicación nativa

## 🎨 Capturas de Pantalla

### Página Principal

Interfaz limpia con acceso directo a todas las funcionalidades principales.

### Gestión de Plantillas

Formulario completo para configurar todos los aspectos del torneo.

### Reloj de Torneo

Vista principal durante la ejecución con toda la información relevante.

## 📖 Documentación

La documentación completa del proyecto se encuentra en la carpeta `project-docs/`:

- [`overview.md`](project-docs/overview.md) - Descripción general y objetivos
- [`requirements.md`](project-docs/requirements.md) - Requisitos funcionales y técnicos
- [`tech-specs.md`](project-docs/tech-specs.md) - Especificaciones técnicas detalladas
- [`user-structure.md`](project-docs/user-structure.md) - Flujo de usuarios y arquitectura
- [`timeline.md`](project-docs/timeline.md) - Cronograma y progreso del proyecto
- [`TASKS.md`](project-docs/TASKS.md) - Gestión de tareas y roadmap

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

# Linting
pnpm lint
```

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📋 Roadmap

### v0.2.0 - Mejoras de Calidad (Próximo)

- [ ] Validaciones robustas de formularios
- [ ] Mejor manejo de errores
- [ ] Confirmaciones para acciones destructivas
- [ ] Estados de carga y feedback visual

### v0.3.0 - Funcionalidades Avanzadas

- [ ] Exportación/importación de datos
- [ ] Historial de torneos
- [ ] Plantillas predefinidas
- [ ] Modo presentación

### v1.0.0 - Release Estable

- [ ] Testing completo
- [ ] Optimización de rendimiento
- [ ] Documentación de usuario
- [ ] PWA completa

## ⚠️ Consideraciones Importantes

- **Datos locales**: Toda la información se guarda en el localStorage de tu navegador
- **Sin servidor**: No se envían datos a ningún servidor externo
- **Privacidad**: Tus datos permanecen completamente privados en tu dispositivo
- **Backup**: Considera exportar tus plantillas importantes (funcionalidad próximamente)

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🙏 Agradecimientos

- [Next.js](https://nextjs.org/) por el excelente framework
- [Radix UI](https://www.radix-ui.com/) por los componentes accesibles
- [Tailwind CSS](https://tailwindcss.com/) por el sistema de diseño
- [Lucide](https://lucide.dev/) por los iconos hermosos

---

**¿Tienes preguntas o sugerencias?** Abre un issue o contacta al equipo de desarrollo.

**¿Te gusta el proyecto?** ¡Dale una ⭐ en GitHub!
