import jwt from "jsonwebtoken";
import AdminModel from "../Models/Admin.js";

export const verifyToken = async (req, res, next) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({ message: "No hay token" });
    }
    if (!process.env.TOKEN_SECRET) {
      console.error(
        "ERROR: TOKEN_SECRET no está definido en las variables de entorno",
      );
      return res.status(500).json({ message: "Error interno del servidor" });
    }

    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);

    if (decoded.role !== "user")
      return res
        .status(401)
        .json({ message: "No tienes permisos para acceder a esta ruta" });

    const admin = await AdminModel.existeAdmin(decoded.email);

    if (!admin) {
      return res
        .status(401)
        .json({ message: "El admin no existe en la base de datos" });
    }
    req.user = {
      id: admin._id,
      email: admin.email,
      role: admin.role,
    };
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token inválido o mal formado" });
  }
};
