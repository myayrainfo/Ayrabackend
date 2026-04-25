import jwt from "jsonwebtoken";

import env from "../../config/env.js";
import { normalizeTenantId } from "../tenant/tenantHelpers.js";

export default function requireAuth(req, res, next) {
  const authorization = req.headers.authorization || "";
  const [scheme, token] = authorization.split(" ");

  if (scheme !== "Bearer" || !token) {
    res.status(401).json({
      ok: false,
      message: "Authentication required.",
    });
    return;
  }

  try {
    const decoded = jwt.verify(token, env.jwtSecret);

    req.user = {
      id: decoded.sub,
      username: decoded.username,
      role: String(decoded.role || "").toUpperCase(),
      tenantId: normalizeTenantId(decoded.tenantId || decoded.tenant),
      portal: decoded.portal || null,
      type: decoded.type || "access",
      name: decoded.name || decoded.displayName || "",
    };

    next();
  } catch {
    res.status(401).json({
      ok: false,
      message: "Invalid or expired token.",
    });
  }
}
