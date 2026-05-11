import mongoose from "mongoose";

const PlayersSchema = new mongoose.Schema(
  {
    UserName: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    credits: {
      type: Number,
      default: 0,
    },
    status: {
      type: Boolean,
      default: true,
    },
    changePassword :{
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      default: "user",
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Players", PlayersSchema);
