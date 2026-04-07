import express from "express";

import { userAcademicsRoutes } from "../modules/academics/academics.routes.js";
import userAuthRoutes from "../internal/user/routes/auth.routes.js";
import userCalendarRoutes from "../internal/user/routes/calendar.routes.js";
import userChatbotRoutes from "../internal/user/routes/chatbot.routes.js";
import { userCommunicationRoutes } from "../modules/communication/communication.routes.js";
import { userStudentsRoutes } from "../modules/students/students.routes.js";
import { userTeachersRoutes } from "../modules/teachers/teachers.routes.js";
import {
  errorHandler as userErrorHandler,
  notFoundHandler as userNotFoundHandler,
} from "../internal/user/middleware/errorHandler.js";

export default function createUserRoutes(authLimiter) {
  const router = express.Router();

  router.get("/health", (_req, res) => {
    res.json({ ok: true, service: "user_panel" });
  });
  router.use("/:tenant/auth", authLimiter, userAuthRoutes);
  router.use("/:tenant/chatbot", userChatbotRoutes);
  router.use("/:tenant/students", userStudentsRoutes);
  router.use("/:tenant/teacher", userTeachersRoutes);
  router.use("/:tenant/academic", userAcademicsRoutes);
  router.use("/:tenant/communication", userCommunicationRoutes);
  router.use("/:tenant/calendar", userCalendarRoutes);
  router.use(userNotFoundHandler);
  router.use(userErrorHandler);

  return router;
}


