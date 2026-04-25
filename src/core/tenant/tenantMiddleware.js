import { setTenantContext } from "./tenantContext.js";
import { resolveTenantId } from "./tenantHelpers.js";

export default function tenantMiddleware(req, _res, next) {
  const tenantId = resolveTenantId({
    user: req.user,
    headerTenantId: req.headers["x-tenant-id"],
    paramsTenantId: req.params.tenantId || req.params.tenant,
  });

  setTenantContext(req, tenantId);
  next();
}
