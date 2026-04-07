import mongoose from "mongoose";

import env from "../../../config/env.js";

if (!env.mongodbUri) {
  throw new Error("Missing MONGODB_URI");
}

const userPanelConnection = mongoose.createConnection(env.mongodbUri, {
  serverSelectionTimeoutMS: 5000,
});

userPanelConnection.on("error", (error) => {
  console.error("User panel MongoDB connection error", error);
});

export function getUserPanelConnection() {
  return userPanelConnection;
}

export default function getUserPanelModel(name, schema, collectionName) {
  if (userPanelConnection.models[name]) {
    return userPanelConnection.models[name];
  }

  return userPanelConnection.model(name, schema, collectionName);
}




