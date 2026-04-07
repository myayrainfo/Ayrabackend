import { errorResponse } from "../utils/api-response.js";

export function notFoundMiddleware(req, res) {
  return errorResponse(res, `Route not found: ${req.originalUrl}`, 404);
}

export default notFoundMiddleware;


