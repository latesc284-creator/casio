import { sendResponse } from "../../Hooks/responseHandler.js";
import PlayerModel from "../../Models/PlayerModels.js";
import bcrypt from "bcrypt";

export const updatePlayerPassword = async (req, res) => {
  try {
    const { newPassword } = req.body;
    const userId = req.user.id;

    if (!newPassword) {
      return sendResponse(res, 400, "La nueva contraseña es requerida");
    }

    // 1. Encriptar la nueva contraseña 🔐
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // 2. Actualizar en la base de datos
    // Usamos el ID para encontrar al jugador y actualizamos:
    // password -> la nueva encriptada
    // changePassword -> true (para marcar que ya la cambió)
    const updatedPlayer = await PlayerModel.changePassword(
      userId,
      hashedPassword,
    );

    if (!updatedPlayer) {
      return sendResponse(res, 404, "Jugador no encontrado");
    }

    return sendResponse(res, 200, "Contraseña actualizada correctamente");
  } catch (error) {
    console.error("Error updatePlayerPassword:", error);
    return sendResponse(res, 500, "Error interno al actualizar contraseña");
  }
};
