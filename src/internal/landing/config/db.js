import mongoose from "mongoose";

import env from "../../../config/env.js";

async function connectDB() {
  try {
    if (!env.mongodbUri) {
      throw new Error("Missing MONGODB_URI");
    }
    await mongoose.connect(env.mongodbUri);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
  }
}

export default connectDB;




