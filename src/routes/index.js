import express from "express";

import { PANELS } from "../common/constants/panels.js";
import createMasterRoutes from "./master.routes.js";
import createSuperRoutes from "./super.routes.js";
import createUserRoutes from "./user.routes.js";
import landingRoutes from "./landing.routes.js";
import authRoutes from "../modules/auth/auth.routes.js";

export default function createApiRoutes({ authLimiter }) {
  const router = express.Router();

  router.get("/health", (_req, res) => {
    res.json({
      ok: true,
      service: "AYRA ERP unified backend",
      panels: Object.values(PANELS),
      timestamp: new Date().toISOString(),
    });
  });

  router.use("/auth", authRoutes);
  router.use(`/${PANELS.LANDING}`, landingRoutes);
  router.use(`/${PANELS.MASTER}`, createMasterRoutes(authLimiter));
  router.use(`/${PANELS.SUPER}`, createSuperRoutes(authLimiter));
  router.use(`/${PANELS.USER}`, createUserRoutes(authLimiter));

  return router;
}


