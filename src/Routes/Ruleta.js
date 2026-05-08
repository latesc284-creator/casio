import express from "express";
import RuletaController from "../Controllers/Ruleta.js";
import { verifyToken } from "../Middlewares/verifyToken.js";

const router = express.Router();

router.post("/girarRuleta", verifyToken, RuletaController.girarRuleta);

export default router;
