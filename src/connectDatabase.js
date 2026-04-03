import mongoose from "mongoose";

export default async function connectDatabase() {
  const mongoUri =
    process.env.MONGODB_URI ||
    process.env.MONGO_URI ||
    "mongodb://127.0.0.1:27017/AYRAERP";

  mongoose.set("strictQuery", true);
  await mongoose.connect(mongoUri, {
    serverSelectionTimeoutMS: 5000,
  });
}
