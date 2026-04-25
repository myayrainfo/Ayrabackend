import mongoose from "mongoose";

import env from "../../config/env.js";
import logger from "../../config/logger.js";

let databaseState = {
  connected: false,
  host: "",
  name: "",
  error: "",
};

export async function connectDatabase() {
  mongoose.set("strictQuery", true);

  if (!process.env.MONGO_URI && !env.mongoUri) {
    databaseState = {
      connected: false,
      host: "",
      name: "",
      error: "Missing MONGO_URI. Unable to start ayra-education-api.",
    };
    logger.error(databaseState.error);
    throw new Error(databaseState.error);
  }

  try {
    const connection = await mongoose.connect(process.env.MONGO_URI || env.mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });

    databaseState = {
      connected: true,
      host: connection.connection.host,
      name: connection.connection.name,
      error: "",
    };

    logger.info(`MongoDB connected: ${databaseState.host}/${databaseState.name}`);
    return connection;
  } catch (error) {
    databaseState = {
      connected: false,
      host: "",
      name: "",
      error: error.message,
    };
    logger.error("MongoDB connection failed.", { error: error.message });
    throw error;
  }
}

export function getDatabaseState() {
  return { ...databaseState };
}

export async function disconnectDatabase() {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }

  databaseState = {
    connected: false,
    host: "",
    name: "",
    error: "",
  };
}

export default connectDatabase;
