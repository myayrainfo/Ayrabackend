import mongoose from "mongoose";
import ensureMasterAdmin from "./modules/master_admin/utils/ensureMasterAdmin.js";

export default async function connectDatabase() {
  const mongoUri =
    process.env.MONGODB_URI ||
    process.env.MONGO_URI ||
    "mongodb://127.0.0.1:27017/AYRAERP";

  mongoose.set("strictQuery", true);
  await mongoose.connect(mongoUri, {
    serverSelectionTimeoutMS: 5000,
  });
  await ensureMasterAdmin();
}
