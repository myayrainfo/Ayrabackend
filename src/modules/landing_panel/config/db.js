import mongoose from "mongoose";

async function connectDB() {
  try {
    const mongoUri =
      process.env.LANDING_MONGODB_URI ||
      process.env.MONGODB_URI ||
      "mongodb://127.0.0.1:27017/ayra_erp";
    await mongoose.connect(mongoUri);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
  }
}

export default connectDB;
