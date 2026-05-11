import { sendResponse } from "../../Hooks/responseHandler.js";
import PlayerModel from "../../Models/PlayerModels.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const isProduction = process.env.NODE_ENV === "production";

export const loginPlayer = async (req, res) => {
  try {
    const { UserName, password } = req.body;

    // Validación básica
    if (!UserName || !password) {
      return sendResponse(res, 400, "name or password incorrect");
    }

    // Buscar player
    const player = await PlayerModel.exsitPlayer(UserName);
    

    if (!player) {
      return sendResponse(res, 400, "name or password incorrect");
    }

    // Verificar contraseña
    const isPasswordCorrect = await bcrypt.compare(password, player.password);
    if (!isPasswordCorrect) {
      return sendResponse(res, 400, "name or password incorrect");
    }

    // Generar token
    const token = jwt.sign(
      {
        id: player._id,
        name: player.UserName,
      },
      process.env.TOKEN_SECRET,
      {
        expiresIn: "7d",
      },
    );

    // Guardar en cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
    });

    // Respuesta final
    return sendResponse(res, 200, "Login successful", {
      token,
      player: {
        id: player._id,
        name: player.name,
        role:player.role
      },
    });
  } catch (error) {
    console.error("Error en loginPlayer:", error);
    return sendResponse(res, 500, "Error logging in");
  }
};
