import { body, param } from "express-validator";

export default {
  create: [body("name").trim().notEmpty(), body("username").trim().notEmpty(), body("role").trim().notEmpty()],
  getAll: [],
  getById: [param("id").isString().notEmpty()],
  update: [param("id").isString().notEmpty()],
  remove: [param("id").isString().notEmpty()],
};
