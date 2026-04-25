import { body } from "express-validator";

export const loginValidation = [
  body("username").trim().notEmpty(),
  body("password").isString().notEmpty(),
  body("role").optional().isString(),
];

export const adminLoginValidation = [
  body("username").trim().notEmpty(),
  body("password").isString().notEmpty(),
  body("portal").optional().isString(),
];

export const refreshValidation = [body("refreshToken").isString().notEmpty()];
