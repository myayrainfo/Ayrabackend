import mongoose from "mongoose";

import env from "./env.js";
import logger from "./logger.js";
import ensureMasterAdmin from "../internal/master/utils/ensureMasterAdmin.js";

export async function connectDatabase() {
  mongoose.set("strictQuery", true);

  if (!env.mongodbUri) {
    throw new Error("Missing MongoDB connection string. Set MONGODB_URI.");
  }

  const connection = await mongoose.connect(env.mongodbUri, {
    serverSelectionTimeoutMS: 5000,
  });

  logger.info(`MongoDB connected: ${connection.connection.host}/${connection.connection.name}`);
  await ensureMasterAdmin();

  return connection;
}

export async function disconnectDatabase() {
  await mongoose.disconnect();
  logger.info("MongoDB disconnected");
}

export default connectDatabase;


