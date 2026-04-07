import express from "express";

import { superAdminsRoutes } from "../modules/admins/admins.routes.js";
import monitoringRoutes from "../modules/monitoring/monitoring.routes.js";
import settingsRoutes from "../modules/settings/settings.routes.js";
import tenantsRoutes from "../modules/tenants/tenants.routes.js";
import superAuthRoutes from "../internal/super/routes/authRoutes.js";
import superRoleRoutes from "../internal/super/routes/roleRoutes.js";
import { errorHandler as superErrorHandler } from "../internal/super/middleware/errorHandler.js";

export default function createSuperRoutes(authLimiter) {
  const router = express.Router();

  router.get("/health", (_req, res) => {
    res.json({ ok: true, service: "super_admin" });
  });
  router.use("/auth", authLimiter, superAuthRoutes);
  router.use("/admins", superAdminsRoutes);
  router.use("/tenants", tenantsRoutes);
  router.use("/roles", superRoleRoutes);
  router.use("/settings", settingsRoutes);
  router.use("/monitoring", monitoringRoutes);
  router.use(superErrorHandler);

  return router;
}


