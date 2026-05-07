import { sendResponse } from "../../Hooks/responseHandler.js";
import PlayerModel from "../../Models/Player.js";
import AdminModel from "../../Models/Admin.js";

export const removeCredits = async (req, res) => {
  try {
    const { UserName, amount } = req.body;
    const idAdmin = req.user.id;
 
    console.log(UserName, amount);

    if (!idAdmin) return sendResponse(res, 400, "Admin not found");

    if (!UserName || !amount) {
      return sendResponse(res, 400, "Invalid data");
    }


    const admin = await AdminModel.searchId(idAdmin);

    if (!admin) {
      return sendResponse(res, 400, "Admin not found");
    }


    const player = await PlayerModel.exsitPlayer(UserName);
    if (!player) {
      return sendResponse(res, 404, "Player not found");
    }

    if (player.credits < amount) {
  return sendResponse(res, 400, "Insufficient credits");
}
    // 🔥 incremento seguro
    const updatedPlayer = await PlayerModel.updateCredits(
      player._id,
      -amount
    );

    return sendResponse(res, 200, "Credits added", {
    UserName: updatedPlayer.UserName,
      credits: updatedPlayer.credits,
    });

  } catch (error) {
    console.error("addCredits error:", error);
    return sendResponse(res, 500, "Error adding credits");
  }
};