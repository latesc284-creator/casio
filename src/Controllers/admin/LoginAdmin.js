import { sendResponse } from "../../Hooks/responseHandler.js";
import AdminModel from "../../Models/Admin.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const isProduction = process.env.NODE_ENV === "production";

export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return sendResponse(res, 400, "Email ou senha incorretos");
    }
    const admin = await AdminModel.existeAdmin(email);

    if (!admin) {
      return sendResponse(res, 400, "Email ou senha incorretos");
    }

    const isPasswordCorrect = await bcrypt.compare(password, admin.password);
    if (!isPasswordCorrect) {
      return sendResponse(res, 400, "Email ou senha incorretos");
    }

    const token = jwt.sign(
      {
        id: admin._id,
        email: admin.email,
        role: admin.role,
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
    return sendResponse(res, 200, "Login com sucesso", {
      token,
      admin: {
        id: admin._id,
        email: admin.email,
      },
    });
  } catch (error) {
    console.error("Error en loginAdmin:", error);
    return sendResponse(res, 500, "Erro ao fazer login");
  }
};
