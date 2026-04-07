import { Router } from "express";

import { getAuthOverview } from "./auth.controller.js";
import landingAuthRoutes from "./landing/auth.routes.js";
import masterAuthRoutes from "./master/auth.routes.js";
import superAuthRoutes from "./super/auth.routes.js";
import userAuthRoutes from "./user/auth.routes.js";

const router = Router();

router.get("/", getAuthOverview);
router.use("/landing", landingAuthRoutes);
router.use("/master", masterAuthRoutes);
router.use("/super", superAuthRoutes);
router.use("/user/:tenant", userAuthRoutes);

export default router;


