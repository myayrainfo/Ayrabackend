import express from "express";

import requireAuth from "../../core/middleware/requireAuth.js";
import tenantMiddleware from "../../core/tenant/tenantMiddleware.js";
import asyncHandler from "../../core/utils/asyncHandler.js";
import { validateRequest } from "../../core/utils/validation.js";
import authController from "./auth.controller.js";
import { adminLoginValidation, loginValidation, refreshValidation } from "./auth.validation.js";

const router = express.Router();

router.post("/login", tenantMiddleware, loginValidation, validateRequest, asyncHandler(authController.login));
router.get("/me", requireAuth, tenantMiddleware, asyncHandler(authController.me));
router.post("/logout", requireAuth, tenantMiddleware, asyncHandler(authController.logout));
router.post("/refresh", refreshValidation, validateRequest, asyncHandler(authController.refresh));

router.get("/master/portal-settings", asyncHandler(authController.portalSettings));
router.post("/master/login", adminLoginValidation, validateRequest, asyncHandler(authController.loginAdmin));
router.post("/master/refresh", refreshValidation, validateRequest, asyncHandler(authController.refresh));
router.post("/master/logout", asyncHandler(authController.logout));

export default router;
