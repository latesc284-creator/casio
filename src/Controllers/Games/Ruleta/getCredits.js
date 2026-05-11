import { sendResponse } from "../../../Hooks/responseHandler.js";
import Players from "../../../Models/PlayerModels.js";

export async function getSaldo(req, res) {
  const idUser = req.user.id;

  try {
    if (!idUser)
      sendResponse(res, 401, "No autentificado", null, {
        message: "No autentificado",
      });
   
      const player = await Players.searchId(idUser);

      if (!player)
        sendResponse(res, 404, "No encontrado", null, {
          message: "No encontrado",
        });

        const saldo= {
          creditos: player.credits
        }
         
        sendResponse(res, 200, "Saldo correcto", saldo);

  } catch (error) {
    console.error("Error en getSaldo:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
}
