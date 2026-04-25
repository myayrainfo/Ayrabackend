import { body, param } from "express-validator";

export default {
  create: [body("studentId").trim().notEmpty(), body("fullName").trim().notEmpty()],
  getAll: [],
  getById: [param("id").isString().notEmpty()],
  update: [param("id").isString().notEmpty()],
  remove: [param("id").isString().notEmpty()],
};
