import { validationResult } from "express-validator";

export function validateRequest(req, res, next) {
  const result = validationResult(req);

  if (!result.isEmpty()) {
    res.status(400).json({
      ok: false,
      message: "Validation failed.",
      errors: result.array(),
    });
    return;
  }

  next();
}
