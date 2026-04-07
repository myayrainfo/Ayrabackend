import logger from "../../config/logger.js";
import { errorResponse } from "../utils/api-response.js";

export function errorMiddleware(error, req, res, _next) {
  const statusCode = error.statusCode || 500;

  logger.error(error, {
    path: req.originalUrl,
    method: req.method,
    statusCode,
  });

  return errorResponse(
    res,
    error.message || "Internal server error",
    statusCode,
    process.env.NODE_ENV === "development" ? { stack: error.stack } : undefined,
  );
}

export default errorMiddleware;


