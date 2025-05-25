# Requisitos y Características del Sistema

## Requisitos Funcionales

### 1. Gestión de Plantillas de Torneo

#### 1.1 Creación de Plantillas

- **RF-001**: El sistema debe permitir crear plantillas de torneo con nombre personalizado
- **RF-002**: Debe permitir configurar el buy-in (entrada) y fee (comisión)
- **RF-003**: Debe permitir definir puntos de torneo y bote extra
- **RF-004**: Debe permitir configurar add-ons simples y dobles con precios y puntos
- **RF-005**: Debe permitir definir el número de jugadores para la burbuja

#### 1.2 Estructura de Niveles

- **RF-006**: Debe permitir crear niveles con ciega pequeña (SB), ciega grande (BB) y ante
- **RF-007**: Cada nivel debe tener un tiempo configurable en minutos
- **RF-008**: Debe permitir agregar, eliminar y reordenar niveles
- **RF-009**: Debe validar que los niveles tengan una progresión lógica

#### 1.3 Estructura de Premios

- **RF-010**: Debe permitir crear múltiples estructuras de premios según número de jugadores
- **RF-011**: Cada estructura debe definir porcentajes de premio para diferentes posiciones
- **RF-012**: Debe permitir agregar y eliminar posiciones premiadas
- **RF-013**: Debe validar que los porcentajes sumen 100%

#### 1.4 Gestión de Plantillas

- **RF-014**: Debe mostrar lista de todas las plantillas creadas
- **RF-015**: Debe permitir editar plantillas existentes
- **RF-016**: Debe permitir eliminar plantillas
- **RF-017**: Debe permitir duplicar plantillas para crear variaciones

### 2. Reloj de Torneo

#### 2.1 Control de Tiempo

- **RF-018**: Debe mostrar cronómetro del nivel actual en formato MM:SS
- **RF-019**: Debe permitir iniciar, pausar y reanudar el cronómetro
- **RF-020**: Debe avanzar automáticamente al siguiente nivel cuando termine el tiempo
- **RF-021**: Debe permitir avance manual al siguiente nivel
- **RF-022**: Debe permitir retroceder al nivel anterior

#### 2.2 Visualización de Información

- **RF-023**: Debe mostrar información del nivel actual (SB/BB/Ante)
- **RF-024**: Debe mostrar información del próximo nivel
- **RF-025**: Debe mostrar el número de nivel actual
- **RF-026**: Debe mostrar tiempo total transcurrido del torneo

#### 2.3 Notificaciones

- **RF-027**: Debe reproducir sonido al cambiar de nivel
- **RF-028**: Debe mostrar notificaciones visuales de cambio de nivel
- **RF-029**: Debe permitir configurar alertas antes del cambio de nivel

### 3. Gestión de Participantes

#### 3.1 Control de Jugadores

- **RF-030**: Debe permitir registrar número de jugadores activos
- **RF-031**: Debe permitir registrar total de jugadores que participaron
- **RF-032**: Debe permitir incrementar/decrementar jugadores durante el torneo
- **RF-033**: Debe calcular promedio de fichas por jugador

#### 3.2 Control de Entradas y Add-ons

- **RF-034**: Debe permitir registrar número de entradas (rebuys)
- **RF-035**: Debe permitir registrar add-ons simples y dobles
- **RF-036**: Debe calcular automáticamente el bote total
- **RF-037**: Debe separar el cálculo de comisiones del bote de premios

### 4. Cálculo de Premios

#### 4.1 Distribución Automática

- **RF-038**: Debe seleccionar automáticamente la estructura de premios según jugadores
- **RF-039**: Debe calcular montos exactos de cada posición premiada
- **RF-040**: Debe mostrar tabla completa de premios
- **RF-041**: Debe actualizar premios en tiempo real según cambios en el bote

#### 4.2 Información Financiera

- **RF-042**: Debe mostrar bote total acumulado
- **RF-043**: Debe mostrar total de comisiones recaudadas
- **RF-044**: Debe mostrar bote real para premios (sin comisiones)

### 5. Persistencia y Recuperación

#### 5.1 Almacenamiento Local

- **RF-045**: Debe guardar todas las plantillas en localStorage
- **RF-046**: Debe guardar estado actual del juego automáticamente
- **RF-047**: Debe recuperar automáticamente partidas en curso al recargar
- **RF-048**: Debe permitir resetear completamente una partida

#### 5.2 Gestión de Sesiones

- **RF-049**: Debe mantener estado del cronómetro entre recargas
- **RF-050**: Debe mantener todos los contadores de jugadores y entradas
- **RF-051**: Debe mantener el nivel actual y progreso del torneo

## Requisitos No Funcionales

### 1. Rendimiento

- **RNF-001**: La aplicación debe cargar en menos de 3 segundos
- **RNF-002**: Las actualizaciones del cronómetro deben ser precisas al segundo
- **RNF-003**: Los cálculos de premios deben ser instantáneos

### 2. Usabilidad

- **RNF-004**: La interfaz debe ser responsive para tablets y móviles
- **RNF-005**: Debe soportar modo oscuro y claro
- **RNF-006**: Los controles principales deben ser accesibles con un toque/click
- **RNF-007**: La información crítica debe ser visible sin scroll

### 3. Compatibilidad

- **RNF-008**: Debe funcionar en Chrome, Firefox, Safari y Edge
- **RNF-009**: Debe funcionar sin conexión a internet
- **RNF-010**: Debe ser compatible con dispositivos táctiles

### 4. Seguridad y Privacidad

- **RNF-011**: Todos los datos deben permanecer en el dispositivo del usuario
- **RNF-012**: No debe enviar información a servidores externos
- **RNF-013**: Debe funcionar completamente offline

## Reglas de Negocio

### 1. Estructura de Torneo

- **RN-001**: Los niveles deben tener una progresión creciente de ciegas
- **RN-002**: El ante no puede ser mayor que la ciega pequeña
- **RN-003**: La ciega grande debe ser al menos el doble de la pequeña
- **RN-004**: Los tiempos de nivel deben ser múltiplos de 5 minutos

### 2. Cálculo de Premios

- **RN-005**: Los porcentajes de premio deben sumar exactamente 100%
- **RN-006**: El primer lugar debe recibir el mayor porcentaje
- **RN-007**: Las comisiones se calculan sobre entradas, no sobre add-ons
- **RN-008**: Los add-ons van íntegramente al bote de premios

### 3. Gestión de Jugadores

- **RN-009**: El número de jugadores activos no puede ser mayor al total
- **RN-010**: No se pueden tener números negativos de jugadores o entradas
- **RN-011**: La burbuja debe ser menor al número total de jugadores

## Casos Límite

### 1. Datos Extremos

- **CL-001**: Torneo con 1 solo jugador (heads-up desde el inicio)
- **CL-002**: Torneo con más de 1000 jugadores
- **CL-003**: Niveles con tiempo de 1 minuto o menos
- **CL-004**: Niveles con ciegas muy altas (millones)

### 2. Situaciones de Error

- **CL-005**: Pérdida de datos del localStorage
- **CL-006**: Cierre inesperado del navegador durante partida
- **CL-007**: Cambio de dispositivo durante torneo
- **CL-008**: Datos corruptos en localStorage

### 3. Uso Atípico

- **CL-009**: Pausar torneo por horas o días
- **CL-010**: Retroceder múltiples niveles
- **CL-011**: Modificar plantilla durante torneo activo
- **CL-012**: Múltiples torneos simultáneos en el mismo navegador
