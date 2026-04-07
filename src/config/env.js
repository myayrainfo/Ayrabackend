import dotenv from "dotenv";

dotenv.config();

function parseOrigins(value) {
  return (value || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
}

export const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  isProduction: (process.env.NODE_ENV || "development") === "production",
  port: Number(process.env.PORT) || 5000,
  mongodbUri: process.env.MONGODB_URI || "",
  jwtSecret: process.env.JWT_SECRET || "change-me",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || process.env.JWT_EXPIRE || "7d",
  frontendUrl: process.env.FRONTEND_URL || "",
  corsOrigins: parseOrigins(process.env.CORS_ORIGIN),
  defaultTenant: process.env.DEFAULT_TENANT || "cgu",
};

export default env;


