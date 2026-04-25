import express from "express";

import { getDatabaseState } from "../core/database/connection.js";
import tenantMiddleware from "../core/tenant/tenantMiddleware.js";
import {
  createLegacyCollectionItem,
  deleteLegacyCollectionItem,
  getLegacyCollectionData,
  updateLegacyCollectionItem,
} from "../core/utils/legacyCollectionService.js";
import registerMasterPortalRoutes from "../core/utils/registerMasterPortalRoutes.js";
import adminRoutes from "../modules/admin/admin.routes.js";
import authController from "../modules/auth/auth.controller.js";
import authRoutes from "../modules/auth/auth.routes.js";
import dashboardController from "../modules/dashboard/dashboard.controller.js";
import dashboardRoutes from "../modules/dashboard/dashboard.routes.js";
import academicRoutes from "../modules/academics/academic.routes.js";
import attendanceRoutes from "../modules/attendance/attendance.routes.js";
import calendarRoutes from "../modules/calendar/calendar.routes.js";
import courseRoutes from "../modules/courses/course.routes.js";
import departmentRoutes from "../modules/departments/department.routes.js";
import examRoutes from "../modules/exams/exam.routes.js";
import financeRoutes from "../modules/finance/finance.routes.js";
import noticeRoutes from "../modules/notices/notice.routes.js";
import resultRoutes from "../modules/results/result.routes.js";
import studentRoutes from "../modules/students/student.routes.js";
import teacherRoutes from "../modules/teachers/teacher.routes.js";
import timetableRoutes from "../modules/timetable/timetable.routes.js";

const EDUCATION_MODULES = [
  "auth",
  "admin",
  "students",
  "teachers",
  "academics",
  "finance",
  "attendance",
  "calendar",
  "courses",
  "departments",
  "exams",
  "results",
  "notices",
  "timetable",
  "dashboard",
];

export default function createApiRoutes() {
  const router = express.Router();

  router.get("/health", (_req, res) => {
    res.json({
      ok: true,
      service: "ayra-education-api",
      modules: EDUCATION_MODULES,
      database: getDatabaseState(),
      timestamp: new Date().toISOString(),
    });
  });

  router.get("/", (_req, res) => {
    res.json({
      ok: true,
      message: "AYRA Education API is running.",
      modules: EDUCATION_MODULES,
    });
  });

  router.use("/auth", authRoutes);
  router.use("/admin", adminRoutes);
  router.use("/students", studentRoutes);
  router.use("/teachers", teacherRoutes);
  router.use("/academics", academicRoutes);
  router.use("/finance", financeRoutes);
  router.use("/attendance", attendanceRoutes);
  router.use("/calendar", calendarRoutes);
  router.use("/courses", courseRoutes);
  router.use("/departments", departmentRoutes);
  router.use("/exams", examRoutes);
  router.use("/results", resultRoutes);
  router.use("/notices", noticeRoutes);
  router.use("/timetable", timetableRoutes);
  router.use("/dashboard", dashboardRoutes);

  registerMasterPortalRoutes(router);

  router.post("/user/:tenant/auth/login", async (req, res, next) => {
    try {
      req.params.tenantId = req.params.tenant;
      tenantMiddleware(req, res, async () => {
        await authController.login(req, res, next);
      });
    } catch (error) {
      next(error);
    }
  });

  router.get(/^\/user\/([^/]+)\/(.+)$/, async (req, res, next) => {
    const tenantId = String(req.params[0] || "").trim().toLowerCase();
    const collectionPath = req.params[1];
    try {
      const items = await getLegacyCollectionData(tenantId, collectionPath, req.query || {});
      res.json(items);
    } catch (error) {
      next(error);
    }
  });

  router.post(/^\/user\/([^/]+)\/(.+)$/, async (req, res, next) => {
    const tenantId = String(req.params[0] || "").trim().toLowerCase();
    const collectionPath = req.params[1];
    try {
      const item = await createLegacyCollectionItem(tenantId, collectionPath, req.body || {});
      res.status(201).json({ ok: true, data: item });
    } catch (error) {
      next(error);
    }
  });

  router.put(/^\/user\/([^/]+)\/(.+)\/([^/]+)$/, async (req, res, next) => {
    const tenantId = String(req.params[0] || "").trim().toLowerCase();
    const collectionPath = req.params[1];
    const id = req.params[2];
    try {
      const item = await updateLegacyCollectionItem(tenantId, collectionPath, id, req.body || {});

      if (!item) {
        res.status(404).json({ ok: false, message: "Record not found." });
        return;
      }

      res.json({ ok: true, data: item });
    } catch (error) {
      next(error);
    }
  });

  router.delete(/^\/user\/([^/]+)\/(.+)\/([^/]+)$/, async (req, res, next) => {
    const tenantId = String(req.params[0] || "").trim().toLowerCase();
    const collectionPath = req.params[1];
    const id = req.params[2];
    try {
      const deleted = await deleteLegacyCollectionItem(tenantId, collectionPath, id);

      if (!deleted) {
        res.status(404).json({ ok: false, message: "Record not found." });
        return;
      }

      res.json({ ok: true, message: "Deleted successfully." });
    } catch (error) {
      next(error);
    }
  });

  return router;
}
