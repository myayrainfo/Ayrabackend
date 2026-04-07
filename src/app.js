import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";

import env from "./config/env.js";
import corsOptions from "./config/cors.js";
import createApiRoutes from "./routes/index.js";
import errorMiddleware from "./common/middleware/error.middleware.js";
import notFoundMiddleware from "./common/middleware/not-found.middleware.js";

const app = express();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { success: false, message: "Too many login attempts. Please try again later." },
});

app.disable("x-powered-by");
app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(morgan(env.isProduction ? "combined" : "dev"));
app.use("/api", createApiRoutes({ authLimiter }));
app.use(notFoundMiddleware);
app.use(errorMiddleware);

export default app;


