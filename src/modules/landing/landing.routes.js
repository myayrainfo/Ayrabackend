import express from "express";

import landingAuthRoutes from "./public/auth.routes.js";
import landingContactRoutes from "./public/contact.routes.js";

const router = express.Router();

router.get("/health", (_req, res) => {
  res.json({ ok: true, service: "landing" });
});

router.use("/contact", landingContactRoutes);
router.use("/auth", landingAuthRoutes);

export default router;


