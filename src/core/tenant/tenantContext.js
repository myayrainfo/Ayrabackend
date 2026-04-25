export function setTenantContext(req, tenantId) {
  req.tenantId = tenantId;
  return tenantId;
}

export function getTenantContext(req) {
  return req.tenantId || req.user?.tenantId || null;
}
