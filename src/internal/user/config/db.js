import mongoose from "mongoose";

import env from "../../../config/env.js";

export default async function connectDatabase() {
  if (!env.mongodbUri) {
    throw new Error("Missing MONGODB_URI");
  }

  mongoose.set("strictQuery", true);
  await mongoose.connect(env.mongodbUri);
  console.log("Connected to MongoDB AYRAERP");
}




