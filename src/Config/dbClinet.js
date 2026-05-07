import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

class DbClient {
  constructor() {
    this.connectDB();
  }

  async connectDB() {
    try {
      const queryString = process.env.URL_DATABASE;

      if (!queryString) {
        throw new Error("La URL de la base de datos no está definida en .env");
      }

      await mongoose.connect(queryString);
      console.log("Conectado a la base de datos con Mongoose 🚀");
    } catch (error) {
      console.error("Error conectando a la base de datos ❌:", error.message);
      process.exit(1);
    }
  }

  async closeDB() {
    await mongoose.connection.close();
    console.log("Conexión cerrada 🚨");
  }
}

export default new DbClient();
