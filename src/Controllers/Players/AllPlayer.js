import { sendResponse } from "../../Hooks/responseHandler.js";
import PlayerModel from "../../Models/Player.js";

export const AllPlayer = async (req, res) => {
  const idUser = req.user.id;
  try {
    if (!idUser) return sendResponse(res, 400, "Admin not found");
    const players = await PlayerModel.getAllPlayers();
    return sendResponse(res, 200, "Players found", players);
  } catch (error) {}
};
