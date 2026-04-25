import express from "express";

import requireAuth from "../../core/middleware/requireAuth.js";
import requireRole from "../../core/middleware/requireRole.js";
import tenantMiddleware from "../../core/tenant/tenantMiddleware.js";
import asyncHandler from "../../core/utils/asyncHandler.js";
import dashboardController from "./dashboard.controller.js";

const router = express.Router();

router.use(requireAuth, tenantMiddleware, requireRole("ADMIN", "ACADEMICS", "FINANCE", "TEACHER"));
router.get("/summary", asyncHandler(dashboardController.getSummary));

export default router;
