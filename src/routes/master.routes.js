import express from "express";

import { masterAcademicsRoutes } from "../modules/academics/academics.routes.js";
import { masterAdminsRoutes } from "../modules/admins/admins.routes.js";
import { masterCommunicationRoutes } from "../modules/communication/communication.routes.js";
import financeRoutes from "../modules/finance/finance.routes.js";
import payrollRoutes from "../modules/payroll/payroll.routes.js";
import remindersRoutes from "../modules/reminders/reminders.routes.js";
import { masterStudentsRoutes } from "../modules/students/students.routes.js";
import { masterTeachersRoutes } from "../modules/teachers/teachers.routes.js";
import masterAuthRoutes from "../internal/master/routes/authRoutes.js";
import masterDashboardRoutes from "../internal/master/routes/dashboardRoutes.js";
import masterErrorHandler from "../internal/master/middleware/errorHandler.js";

export default function createMasterRoutes(authLimiter) {
  const router = express.Router();

  router.get("/health", (_req, res) => {
    res.json({ ok: true, service: "master_admin" });
  });
  router.use("/auth", authLimiter, masterAuthRoutes);
  router.use("/students", masterStudentsRoutes);
  router.use("/teachers", masterTeachersRoutes);
  router.use("/academics", masterAcademicsRoutes);
  router.use("/finance", financeRoutes);
  router.use("/payroll", payrollRoutes);
  router.use("/reminders", remindersRoutes);
  router.use("/communication", masterCommunicationRoutes);
  router.use("/dashboard", masterDashboardRoutes);
  router.use("/admins", masterAdminsRoutes);
  router.use(masterErrorHandler);

  return router;
}



