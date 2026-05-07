import express from "express";
import AdminController from "../Controllers/Admin.js";
import { verifyToken } from "../Middlewares/verifyToken.js";
import playerController from "../Controllers/Players.js";

const router = express.Router();

router.post("/create", AdminController.createAdmin);
router.post("/login", AdminController.loginAdmin);


// --- RUTA DE VERIFICACIÓN (Para el AuthContext de React) ---
router.get("/verify", verifyToken, (req, res) => {
    res.json({
        authenticated: true,
        email: req.user.email,
        role: req.user.role,
    });
});



//crear un nuevo jugador
router.post("/createPlayer", verifyToken, playerController.createPlayer);
//agregar creditos al jugador
router.post("/addCredits", verifyToken, AdminController.addCredits);
//remover creditos al jugador
router.post("/removeCredits", verifyToken, AdminController.removeCredits);
//obtener todos los jugadores
router.get("/allPlayers", verifyToken, AdminController.AllPlayer);



export default router;
