/**
 * Ejemplos de Configuraciones de Validación
 *
 * Este archivo contiene ejemplos de configuraciones válidas e inválidas
 * para demostrar el comportamiento del sistema de validaciones.
 */

import { FormGameTemplate } from "@/lib/validations";

// ✅ CONFIGURACIONES VÁLIDAS (Sin errores, pueden tener advertencias)

export const configuracionClasica: FormGameTemplate = {
  name: "Torneo Clásico",
  entry: "20",
  fee: "10",
  points: "10000",
  levels: [
    { sb: "25", bb: "50", ante: "0", time: "20" },
    { sb: "50", bb: "100", ante: "0", time: "20" },
    { sb: "75", bb: "150", ante: "0", time: "20" },
    { sb: "100", bb: "200", ante: "0", time: "20" },
  ],
  prize_structures: [
    {
      max_players: "10",
      prizes: [{ percentaje: "60" }, { percentaje: "40" }],
    },
  ],
};

export const configuracionProgresionGradual: FormGameTemplate = {
  name: "Progresión Gradual",
  entry: "15",
  points: "8000",
  levels: [
    { sb: "25", bb: "50", ante: "0", time: "15" },
    { sb: "50", bb: "75", ante: "0", time: "15" }, // BB < SB * 2 (válido)
    { sb: "75", bb: "100", ante: "0", time: "15" },
    { sb: "100", bb: "150", ante: "0", time: "15" },
  ],
  prize_structures: [
    {
      max_players: "8",
      prizes: [
        { percentaje: "50" },
        { percentaje: "30" },
        { percentaje: "20" },
      ],
    },
  ],
};

export const configuracionSbIgualBb: FormGameTemplate = {
  name: "SB = BB Válido",
  entry: "25",
  points: "12000",
  levels: [
    { sb: "50", bb: "100", ante: "0", time: "20" },
    { sb: "100", bb: "100", ante: "0", time: "20" }, // SB = BB (válido)
    { sb: "100", bb: "200", ante: "0", time: "20" }, // SB igual al anterior (válido después de SB=BB)
    { sb: "150", bb: "300", ante: "0", time: "20" },
  ],
  prize_structures: [
    {
      max_players: "12",
      prizes: [
        { percentaje: "45" },
        { percentaje: "25" },
        { percentaje: "20" },
        { percentaje: "10" },
      ],
    },
  ],
};

export const configuracionAnteAlto: FormGameTemplate = {
  name: "Ante Alto",
  entry: "30",
  points: "15000",
  levels: [
    { sb: "100", bb: "200", ante: "0", time: "20" },
    { sb: "150", bb: "300", ante: "100", time: "20" }, // Ante = SB (válido)
    { sb: "200", bb: "400", ante: "200", time: "20" }, // Ante = SB (válido)
    { sb: "300", bb: "600", ante: "500", time: "20" }, // ⚠️ Ante > SB * 2 (advertencia, pero válido)
  ],
  prize_structures: [
    {
      max_players: "15",
      prizes: [
        { percentaje: "40" },
        { percentaje: "25" },
        { percentaje: "15" },
        { percentaje: "10" },
        { percentaje: "10" },
      ],
    },
  ],
};

// ⚠️ CONFIGURACIONES CON ADVERTENCIAS (Válidas pero con warnings)

export const configuracionConAdvertencias: FormGameTemplate = {
  name: "Con Advertencias Válidas",
  entry: "50",
  points: "20000",
  levels: [
    { sb: "100", bb: "200", ante: "0", time: "20" },
    { sb: "200", bb: "1200", ante: "0", time: "20" }, // ⚠️ BB > SB * 5 (advertencia)
    { sb: "500", bb: "1000", ante: "1200", time: "20" }, // ⚠️ Ante > SB * 2 (advertencia)
    { sb: "1500", bb: "3000", ante: "0", time: "20" }, // ⚠️ Aumento > 300% (advertencia)
  ],
  prize_structures: [
    {
      max_players: "6",
      prizes: [
        { percentaje: "30" }, // ⚠️ Primer lugar no es el mayor
        { percentaje: "25" },
        { percentaje: "20" },
        { percentaje: "15" },
        { percentaje: "10" }, // ⚠️ Muchos premios para pocos jugadores
      ],
    },
  ],
};

// ❌ CONFIGURACIONES INVÁLIDAS (Con errores que bloquean guardado)

export const configuracionInvalida: FormGameTemplate = {
  name: "", // ❌ Error: Nombre vacío
  entry: "0", // ❌ Error: Entrada muy baja
  points: "50", // ❌ Error: Puntos muy bajos
  levels: [
    { sb: "100", bb: "50", ante: "0", time: "20" }, // ❌ Error: BB < SB
    { sb: "50", bb: "100", ante: "-10", time: "20" }, // ❌ Error: Ante negativo
    { sb: "25", bb: "50", ante: "0", time: "0" }, // ❌ Error: Tiempo inválido
  ],
  prize_structures: [
    {
      max_players: "0", // ❌ Error: Jugadores inválido
      prizes: [
        { percentaje: "60" },
        { percentaje: "50" }, // ❌ Error: No suma 100%
      ],
    },
  ],
};

// 🧪 CASOS DE PRUEBA ESPECÍFICOS

export const casoProgresionDespuesSbBb: FormGameTemplate = {
  name: "Progresión después SB=BB",
  entry: "20",
  points: "10000",
  levels: [
    { sb: "50", bb: "100", ante: "0", time: "20" },
    { sb: "100", bb: "100", ante: "0", time: "20" }, // SB = BB
    { sb: "100", bb: "200", ante: "0", time: "20" }, // ✅ SB igual al anterior (válido)
    { sb: "150", bb: "300", ante: "0", time: "20" },
  ],
  prize_structures: [
    {
      max_players: "10",
      prizes: [{ percentaje: "60" }, { percentaje: "40" }],
    },
  ],
};

export const casoAdvertenciasSinBloqueo: FormGameTemplate = {
  name: "Advertencias Sin Bloqueo",
  entry: "25",
  points: "12000",
  levels: [
    { sb: "100", bb: "100", ante: "0", time: "20" }, // SB = BB
    { sb: "100", bb: "200", ante: "0", time: "20" }, // ⚠️ SB igual al anterior (advertencia)
    { sb: "200", bb: "1500", ante: "0", time: "20" }, // ⚠️ BB muy alto (advertencia)
    { sb: "400", bb: "800", ante: "1000", time: "20" }, // ⚠️ Ante alto (advertencia)
  ],
  prize_structures: [
    {
      max_players: "8",
      prizes: [
        { percentaje: "50" },
        { percentaje: "30" },
        { percentaje: "20" },
      ],
    },
  ],
};

/**
 * RESULTADOS ESPERADOS:
 *
 * configuracionClasica: ✅ Válida, sin errores ni advertencias
 * configuracionProgresionGradual: ✅ Válida, sin errores ni advertencias
 * configuracionSbIgualBb: ✅ Válida, sin errores ni advertencias
 * configuracionAnteAlto: ✅ Válida, con 1 advertencia (ante alto)
 * configuracionConAdvertencias: ✅ Válida, con múltiples advertencias
 * configuracionInvalida: ❌ Inválida, con múltiples errores
 * casoProgresionDespuesSbBb: ✅ Válida, sin errores ni advertencias
 * casoAdvertenciasSinBloqueo: ✅ Válida, con advertencias pero guardado permitido
 *
 * COMPORTAMIENTO ESPERADO:
 * - Solo configuracionInvalida debe bloquear el guardado
 * - Todas las demás deben permitir guardado (incluso con advertencias)
 * - Las advertencias deben mostrarse pero no impedir la funcionalidad
 */
