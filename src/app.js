import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";

import corsOptions from "./config/cors.js";
import env from "./config/env.js";
import errorHandler from "./core/middleware/errorHandler.js";
import notFound from "./core/middleware/notFound.js";
import createApiRoutes from "./routes/index.js";

const app = express();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { ok: false, message: "Too many requests. Please try again later." },
});

app.disable("x-powered-by");
app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(morgan(env.isProduction ? "combined" : "dev"));

app.get("/", (_req, res) => {
  res.json({
    ok: true,
    service: "ayra-education-api",
    docs: "/api/health",
  });
});

app.use("/api/auth", authLimiter);
app.use("/api", createApiRoutes());
app.use(notFound);
app.use(errorHandler);

export default app;
