import jwt from "jsonwebtoken";
import AdminModel from "../Models/Admin.js";
import PlayerModel from "../Models/PlayerModels.js";

export const verifyToken = async (req, res, next) => {
  try {
    const token = req.cookies?.token;
    if (!token) return res.status(401).json({ message: "No hay token" });

    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
    ;

    // IMPORTANTE: Usamos decoded.id porque es lo que viene en tu token
    // Buscamos en ambas colecciones por ID
    const [admin, player] = await Promise.all([
      AdminModel.existeAdmin(decoded.email),
      PlayerModel.exsitPlayer(decoded.name),
    ]);

    const usuarioEncontrado = admin || player;

    if (!usuarioEncontrado) {
      return res.status(401).json({ message: "Usuario no encontrado en DB" });
    }

    // Guardamos en req.user los datos normalizados
    req.user = {
      id: usuarioEncontrado._id,
      email: usuarioEncontrado.email || usuarioEncontrado.UserName, // Maneja ambos casos
      role: usuarioEncontrado.role, // Asegúrate que ambos modelos tengan el campo 'role'
    };

    next();
  } catch (error) {
    console.error("Error JWT:", error.message);
    return res.status(401).json({ message: "Token inválido" });
  }
};
