import mongoose from "mongoose";

const AdminPlataformSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "ella",
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("AdminPlataform", AdminPlataformSchema);
