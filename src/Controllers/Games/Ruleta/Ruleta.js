// ============================================================
//  ruleta.controller.js
//  Lógica del servidor para la Ruleta de Chocolates
// ============================================================

import Players from "../../../Models/PlayerModels.js"; // ajustá el path a tu modelo

const HISTORIAL_LIMITE = 10;
let historialGlobal = [];

// ─── Constantes (igual que el front, pero acá son la verdad) ─
const ROJOS = new Set([
  1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36,
]);

const ZONAS_VALIDAS = new Set([
  // Números individuales 0-36
  ...Array.from({ length: 37 }, (_, i) => String(i)),
  // Apuestas externas
  "Rojo",
  "Negro",
  "PAR",
  "IMPAR",
  "1-18",
  "19-36",
  "1-12",
  "13-24",
  "25-36",
  "COL1",
  "COL2",
  "COL3",
]);

const RIGGED_CHANCE = 30;
// Multiplicadores por zona
// El front ya tenía esta lógica, acá es la versión autoritativa
function calcPremio(num, apuestas) {
  const esRojo = ROJOS.has(num);
  let totalPremio = 0;
  const desglose = {}; // para loggear o devolver al front si querés

  for (const [zona, monto] of Object.entries(apuestas)) {
    let ganancia = 0;
    const n = parseInt(zona);

    if (!isNaN(n) && zona === String(n)) {
      // Pleno (número exacto) — paga 35:1, o sea devuelve x36
      if (n === num) ganancia = monto * 36;
    } else if (num === 0) {
      // El 0 solo gana en pleno; todas las externas pierden
      ganancia = 0;
    } else {
      switch (zona) {
        case "Rojo":
          if (esRojo) ganancia = monto * 2;
          break;
        case "Negro":
          if (!esRojo) ganancia = monto * 2;
          break;
        case "PAR":
          if (num % 2 === 0) ganancia = monto * 2;
          break;
        case "IMPAR":
          if (num % 2 !== 0) ganancia = monto * 2;
          break;
        case "1-18":
          if (num >= 1 && num <= 18) ganancia = monto * 2;
          break;
        case "19-36":
          if (num >= 19 && num <= 36) ganancia = monto * 2;
          break;
        case "1-12":
          if (num >= 1 && num <= 12) ganancia = monto * 3;
          break;
        case "13-24":
          if (num >= 13 && num <= 24) ganancia = monto * 3;
          break;
        case "25-36":
          if (num >= 25 && num <= 36) ganancia = monto * 3;
          break;
        case "COL1":
          if (num % 3 === 0) ganancia = monto * 3;
          break;
        case "COL2":
          if (num % 3 === 2) ganancia = monto * 3;
          break;
        case "COL3":
          if (num % 3 === 1) ganancia = monto * 3;
          break;
      }
    }

    if (ganancia > 0) desglose[zona] = ganancia;
    totalPremio += ganancia;
  }

  return { totalPremio, desglose };
}

// ─── Límites de apuesta (ajustá según tu negocio) ────────────
const APUESTA_MIN = 100;
const APUESTA_MAX_POR_ZONA = 100000; // máximo por zona individual
const APUESTA_MAX_TOTAL = 1000000; // máximo total por tirada

// ─── Controller: POST /api/ruleta/girar ──────────────────────
/**
 * Body esperado:
 * {
 *   userId: "...",           // ID del jugador (o sacarlo del JWT)
 *   apuestas: {              // objeto zona → monto
 *     "Rojo": 50,
 *     "15":   25,
 *     "PAR":  100
 *   }
 * }
 */
export const girarRuleta = async (req, res) => {
  try {
    // 1. ── Extraer datos ──────────────────────────────────────
    // Si usás JWT, el userId debería venir del middleware de auth:
    // const userId = req.user.id;
    const { apuestas } = req.body;

    const userId = req.user.id;

    if (!userId || !apuestas || typeof apuestas !== "object") {
      return res.status(400).json({ error: "Datos inválidos" });
    }

    // 2. ── Validar zonas y montos ─────────────────────────────
    const entradasApuestas = Object.entries(apuestas);

    if (entradasApuestas.length === 0) {
      return res.status(400).json({ error: "No hay apuestas" });
    }

    for (const [zona, monto] of entradasApuestas) {
      if (!ZONAS_VALIDAS.has(zona)) {
        return res.status(400).json({ error: `Zona inválida: ${zona}` });
      }
      if (!Number.isInteger(monto) || monto < APUESTA_MIN) {
        return res
          .status(400)
          .json({ error: `Monto inválido en zona ${zona}` });
      }
      if (monto > APUESTA_MAX_POR_ZONA) {
        return res
          .status(400)
          .json({ error: `Apuesta máxima por zona: ${APUESTA_MAX_POR_ZONA}` });
      }
    }

    const totalApuesta = entradasApuestas.reduce((sum, [, m]) => sum + m, 0);

    if (totalApuesta > APUESTA_MAX_TOTAL) {
      return res
        .status(400)
        .json({ error: `Apuesta total máxima: ${APUESTA_MAX_TOTAL}` });
    }

    // 3. ── Buscar el jugador ──────────────────────────────────
    const player = await Players.searchId(userId);

    if (!player) {
      return res.status(404).json({ error: "Jugador no encontrado" });
    }
    if (!player.status) {
      return res.status(403).json({ error: "Cuenta inactiva" });
    }

    // 4. ── Validar saldo ──────────────────────────────────────
    if (player.credits < totalApuesta) {
      return res.status(400).json({
        error: "Saldo insuficiente",
        saldo: player.credits,
        necesario: totalApuesta,
      });
    }

    // 5. ── Generar número ganador (EL BACK MANDA) ─────────────
    let numeroGanador;
    const debePerder = Math.random() * 100 < RIGGED_CHANCE;

    if (debePerder) {
      // Intentamos buscar un número que no dé premios
      const numerosPosibles = Array.from({ length: 37 }, (_, i) => i);
      // Mezclamos el array para que no siempre elija el mismo número perdedor
      numerosPosibles.sort(() => Math.random() - 0.5);

      // Buscamos el primer número de la lista que resulte en premio $0
      const numeroPerdedorEncontrado = numerosPosibles.find((n) => {
        const { totalPremio } = calcPremio(n, apuestas);
        return totalPremio === 0;
      });

      // Si encontramos un número que lo hace perder, lo asignamos.
      // Si el usuario apostó a TODO, numeroPerdedorEncontrado será undefined,
      // en ese caso cae al azar normal (el casino no puede hacer magia si cubren todo).
      numeroGanador =
        numeroPerdedorEncontrado !== undefined
          ? numeroPerdedorEncontrado
          : Math.floor(Math.random() * 37);
    } else {
      // Azar puro (Fair play)
      numeroGanador = Math.floor(Math.random() * 37);
    }

    // Guardar en historial
    historialGlobal.unshift(numeroGanador);

    if (historialGlobal.length > HISTORIAL_LIMITE) historialGlobal.pop();

    // 6. ── Calcular premio ────────────────────────────────────
    const { totalPremio, desglose } = calcPremio(numeroGanador, apuestas);

    // 7. ── Actualizar créditos atómicamente ───────────────────
    //   Descontamos apuesta, sumamos premio en una sola operación
    const diferencia = totalPremio - totalApuesta; // puede ser negativo

    const playerActualizado = await Players.updateCredits(userId, diferencia);

    // 8. ── Responder al front ─────────────────────────────────
    return res.status(200).json({
      numeroGanador,
      apuestasRecibidas: apuestas,
      totalApuesta,
      totalPremio,
      desglose,
      historial: historialGlobal,
      ganancia: diferencia,
      creditosAnteriores: player.credits,
      creditosActuales: playerActualizado.credits,
    });
  } catch (error) {
    console.error("Error en girarRuleta:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};
