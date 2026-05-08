// ─── Controller: GET /api/ruleta/saldo ───────────────────────
// Ruta auxiliar para que el front consulte el saldo actual
export async function getSaldo(req, res) {
  try {
    const { userId } = req.query; // o req.user.id si viene del JWT

    const player = await Players.findById(userId).select("credits UserName status");
    if (!player) return res.status(404).json({ error: "Jugador no encontrado" });

    return res.status(200).json({
      userId: player._id,
      userName: player.UserName,
      credits: player.credits,
      status: player.status,
    });
  } catch (error) {
    console.error("Error en getSaldo:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
}