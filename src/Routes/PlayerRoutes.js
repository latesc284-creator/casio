import express from "express";
import PlayerController from "../Controllers/Players.js";

const router = express.Router();

router.post("/login", PlayerController.loginPlayer);

export default router;