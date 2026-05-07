import { sendResponse } from "../../Hooks/responseHandler.js";
import AdmonModel from "../../Models/Admin.js";
import PlayerModel from "../../Models/PlayerModels.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const createPlayer = async (req, res) => {
  try {
    const { UserName } = req.body;
    const idAdmin = req.user.id;
    const password = process.env.PASSWORD_PLAYER;

    if (!idAdmin) return sendResponse(res, 400, "Admin not found");

    if (!UserName || !password) {
      return sendResponse(res, 400, "name user and password are required");
    }

    const admin = await AdmonModel.searchId(idAdmin);

    if (!admin) {
      return sendResponse(res, 400, "Admin not found");
    }

    // Verificar si ya existe
    const existePlayer = await PlayerModel.exsitPlayer(UserName);
    if (existePlayer) {
      return sendResponse(res, 400, "Player already exists");
    }
    // Encriptar password 🔐
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear player
    const player = await PlayerModel.createPlayer({
      UserName,
      password: hashedPassword,
    });

    return sendResponse(res, 201, "Player created successfully", {
      id: player._id,
      name: player.name,
    });
  } catch (error) {
    console.error("Error createPlayer:", error);
    return sendResponse(res, 500, " error creating player");
  }
};
