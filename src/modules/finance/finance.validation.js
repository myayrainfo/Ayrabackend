import { param } from "express-validator";

export default {
  create: [],
  getAll: [],
  getById: [param("id").isString().notEmpty()],
  update: [param("id").isString().notEmpty()],
  remove: [param("id").isString().notEmpty()],
};
