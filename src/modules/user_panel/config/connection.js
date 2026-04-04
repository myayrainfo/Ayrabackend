import mongoose from "mongoose";

const userMongoUri =
  process.env.USER_MONGODB_URI ||
  process.env.MONGODB_URI ||
  process.env.MONGO_URI ||
  "mongodb://127.0.0.1:27017/AYRAERP";

const userPanelConnection = mongoose.createConnection(userMongoUri, {
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
