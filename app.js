import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import dbClient from "./src/Config/dbClinet.js";

const app = express();

const urlFront = process.env.URL_FRONT;

app.use(
  cors({
    origin: urlFront,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

import AdminRoutes from "./src/Routes/AdminRoutes.js";

import PlayerRoutes from "./src/Routes/PlayerRoutes.js";

import RuletaRoutes from "./src/Routes/Ruleta.js";


app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(morgan("dev"));

app.use("/api/v1/adminProtected", AdminRoutes);

app.use("/api/v1/playerProtected", PlayerRoutes , RuletaRoutes);

app.get("/", (req, res) => {
  res.send("API running");
});
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} 🚀`);
});

process.on("SIGINT", async () => {
  await dbClient.closeDB();
  server.close(() => {
    console.log("Servidor Express cerrado.");
    process.exit(0);
  });
});
