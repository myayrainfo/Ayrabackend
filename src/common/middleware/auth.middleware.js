import jwt from "jsonwebtoken";

import env from "../../config/env.js";

export function authMiddleware(req, _res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    req.user = null;
    return next();
  }

  try {
    req.user = jwt.verify(token, env.jwtSecret);
    return next();
  } catch (error) {
    error.statusCode = 401;
    return next(error);
  }
}

export default authMiddleware;


