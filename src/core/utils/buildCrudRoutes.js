import express from "express";

import requireAuth from "../middleware/requireAuth.js";
import requireRole from "../middleware/requireRole.js";
import tenantMiddleware from "../tenant/tenantMiddleware.js";
import asyncHandler from "./asyncHandler.js";
import { validateRequest } from "./validation.js";

export default function buildCrudRoutes(controller, validationRules = {}, roles = ["ADMIN"]) {
  const router = express.Router();
  const roleGuard = requireRole(...roles);

  router.use(requireAuth, tenantMiddleware, roleGuard);

  router.post("/", validationRules.create || [], validateRequest, asyncHandler(controller.create));
  router.get("/", validationRules.getAll || [], validateRequest, asyncHandler(controller.getAll));
  router.get("/:id", validationRules.getById || [], validateRequest, asyncHandler(controller.getById));
  router.put("/:id", validationRules.update || [], validateRequest, asyncHandler(controller.update));
  router.delete("/:id", validationRules.remove || [], validateRequest, asyncHandler(controller.remove));

  return router;
}
