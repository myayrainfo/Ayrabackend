import { body } from "express-validator";

export const loginValidation = [
  body("username").optional().isString(),
  body("email").optional().isEmail(),
  body("password").notEmpty().withMessage("Password is required"),
];

export default {
  loginValidation,
};


