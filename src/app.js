import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";

import landingAuthRoutes from "./modules/landing_panel/routes/auth.js";
import landingContactRoutes from "./modules/landing_panel/routes/contact.js";

import masterAcademicsRoutes from "./modules/master_admin/routes/academicsRoutes.js";
import masterAdminRoutes from "./modules/master_admin/routes/adminRoutes.js";
import masterAuthRoutes from "./modules/master_admin/routes/authRoutes.js";
import masterCommunicationRoutes from "./modules/master_admin/routes/communicationRoutes.js";
import masterDashboardRoutes from "./modules/master_admin/routes/dashboardRoutes.js";
import masterFinanceRoutes from "./modules/master_admin/routes/financeRoutes.js";
import masterStudentRoutes from "./modules/master_admin/routes/studentRoutes.js";
import masterTeacherRoutes from "./modules/master_admin/routes/teacherRoutes.js";
import masterErrorHandler from "./modules/master_admin/middleware/errorHandler.js";

import superAdminRoutes from "./modules/super_admin/routes/adminRoutes.js";
import superAuthRoutes from "./modules/super_admin/routes/authRoutes.js";
import superMonitoringRoutes from "./modules/super_admin/routes/monitoringRoutes.js";
import superRoleRoutes from "./modules/super_admin/routes/roleRoutes.js";
import superSettingsRoutes from "./modules/super_admin/routes/settingsRoutes.js";
import superTenantRoutes from "./modules/super_admin/routes/tenantRoutes.js";
import { errorHandler as superErrorHandler } from "./modules/super_admin/middleware/errorHandler.js";

import userAcademicRoutes from "./modules/user_panel/routes/academic.routes.js";
import userAuthRoutes from "./modules/user_panel/routes/auth.routes.js";
import userCalendarRoutes from "./modules/user_panel/routes/calendar.routes.js";
import userCommunicationRoutes from "./modules/user_panel/routes/communication.routes.js";
import userStudentRoutes from "./modules/user_panel/routes/student.routes.js";
import userTeacherRoutes from "./modules/user_panel/routes/teacher.routes.js";
import {
  errorHandler as userErrorHandler,
  notFoundHandler as userNotFoundHandler,
} from "./modules/user_panel/middleware/errorHandler.js";

const app = express();

const allowedOrigins = Array.from(
  new Set(
    [
      process.env.FRONTEND_URL,
      process.env.CORS_ORIGIN,
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:3000",
    ]
      .flatMap((value) => (value ? value.split(",") : []))
      .map((origin) => origin.trim())
      .filter(Boolean),
  ),
);

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { success: false, message: "Too many login attempts. Please try again later." },
});

app.disable("x-powered-by");
app.use(helmet());
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  }),
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

app.get("/api/health", (_req, res) => {
  res.json({
    ok: true,
    service: "AYRA ERP unified backend",
    panels: ["landing", "master", "super", "user"],
    timestamp: new Date().toISOString(),
  });
});

const landingRouter = express.Router();
landingRouter.get("/health", (_req, res) => {
  res.json({ ok: true, service: "landing" });
});
landingRouter.use("/contact", landingContactRoutes);
landingRouter.use("/auth", landingAuthRoutes);
app.use("/api/landing", landingRouter);

const masterRouter = express.Router();
masterRouter.get("/health", (_req, res) => {
  res.json({ ok: true, service: "master_admin" });
});
masterRouter.use("/auth", authLimiter, masterAuthRoutes);
masterRouter.use("/students", masterStudentRoutes);
masterRouter.use("/teachers", masterTeacherRoutes);
masterRouter.use("/academics", masterAcademicsRoutes);
masterRouter.use("/finance", masterFinanceRoutes);
masterRouter.use("/communication", masterCommunicationRoutes);
masterRouter.use("/dashboard", masterDashboardRoutes);
masterRouter.use("/admins", masterAdminRoutes);
masterRouter.use(masterErrorHandler);
app.use("/api/master", masterRouter);

const superRouter = express.Router();
superRouter.get("/health", (_req, res) => {
  res.json({ ok: true, service: "super_admin" });
});
superRouter.use("/auth", authLimiter, superAuthRoutes);
superRouter.use("/admins", superAdminRoutes);
superRouter.use("/tenants", superTenantRoutes);
superRouter.use("/roles", superRoleRoutes);
superRouter.use("/settings", superSettingsRoutes);
superRouter.use("/monitoring", superMonitoringRoutes);
superRouter.use(superErrorHandler);
app.use("/api/super", superRouter);

const userRouter = express.Router();
userRouter.get("/health", (_req, res) => {
  res.json({ ok: true, service: "user_panel" });
});
userRouter.use("/:tenant/auth", authLimiter, userAuthRoutes);
userRouter.use("/:tenant/students", userStudentRoutes);
userRouter.use("/:tenant/teacher", userTeacherRoutes);
userRouter.use("/:tenant/academic", userAcademicRoutes);
userRouter.use("/:tenant/communication", userCommunicationRoutes);
userRouter.use("/:tenant/calendar", userCalendarRoutes);
userRouter.use(userNotFoundHandler);
userRouter.use(userErrorHandler);
app.use("/api/user", userRouter);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.originalUrl}`,
  });
});

app.use((error, _req, res, _next) => {
  const statusCode = error.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    message: error.message || "Internal server error",
  });
});

export default app;
