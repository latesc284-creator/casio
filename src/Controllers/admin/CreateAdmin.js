import { sendResponse } from "../../Hooks/responseHandler.js";
import AdminModel from "../../Models/Admin.js";
import bcrypt from "bcrypt";

export const createAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validación básica
    if (!email || !password) {
      return sendResponse(res, 400, "Email y password son requeridos");
    }

    // Verificar si ya existe
    const existeAdmin = await AdminModel.existeAdmin(email);
    if (existeAdmin) {
      return sendResponse(res, 400, "Email já cadastrado");
    }

    // Encriptar password 🔐
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear admin
    const admin = await AdminModel.createAdmin({
      email,
      password: hashedPassword,
    });

    return sendResponse(res, 201, "Admin cadastrado com sucesso", {
      id: admin._id,
      email: admin.email,
    });

  } catch (error) {
    console.error("Error en createAdmin:", error);
    return sendResponse(res, 500, "Erro ao criar admin");
  }
};