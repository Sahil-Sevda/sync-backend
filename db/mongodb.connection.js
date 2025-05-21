import mongoose from "mongoose";
import { ENV } from "../configs/constant.js";

export const connectDB = async () => {
  try {
    await mongoose.connect(ENV.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected successfully.");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};
