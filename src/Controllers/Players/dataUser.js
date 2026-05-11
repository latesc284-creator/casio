import { sendResponse } from "../../Hooks/responseHandler.js";
import PlayerModel from "../../Models/PlayerModels.js";

export const dataUser = async (req, res) => {
  const iduser = req.user.id;

  try {
    if (!iduser) return sendResponse(res, 400, "Admin not found");

    const player = await PlayerModel.searchId(iduser);
    console.log(player)
    if (!player) return sendResponse(res, 400, "Player not found");


     const data ={
        id: player._id,
        name: player.UserName,
        credits: player.credits,
        password: player.changePassword,
     }


    sendResponse(res, 200, "Player exit", data);
  } catch (error) {
    console.error("Error en dataUser:", error);
    return sendResponse(res, 500, "Error getting player");
  }
};
