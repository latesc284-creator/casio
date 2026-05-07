import express from "express";
import PlayerController from "../Controllers/Players.js";
import { verifyToken } from "../Middlewares/verifyToken.js";

const router = express.Router();

router.post("/login", PlayerController.loginPlayer);

router.get("/data", verifyToken, PlayerController.dataUser);

export default router;