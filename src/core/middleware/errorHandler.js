import logger from "../../config/logger.js";

export default function errorHandler(error, _req, res, _next) {
  logger.error(error.message, { stack: error.stack });

  res.status(error.statusCode || 500).json({
    ok: false,
    message: error.message || "Internal server error",
  });
}
