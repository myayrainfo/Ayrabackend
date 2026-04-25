import express from "express";

import requireAuth from "../../core/middleware/requireAuth.js";
import requireRole from "../../core/middleware/requireRole.js";
import tenantMiddleware from "../../core/tenant/tenantMiddleware.js";
import buildCrudRoutes from "../../core/utils/buildCrudRoutes.js";
import asyncHandler from "../../core/utils/asyncHandler.js";
import adminController from "./admin.controller.js";
import adminValidation from "./admin.validation.js";

const router = buildCrudRoutes(adminController, adminValidation, ["ADMIN", "ACADEMICS"]);
const statsRouter = express.Router();

statsRouter.use(requireAuth, tenantMiddleware, requireRole("ADMIN", "ACADEMICS"));
statsRouter.get("/stats", asyncHandler(adminController.getStats));
statsRouter.use("/", router);

export default statsRouter;
