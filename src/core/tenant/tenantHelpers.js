import env from "../../config/env.js";

export function normalizeTenantId(value) {
  return String(value || "").trim().toLowerCase();
}

export function resolveTenantId({ user, headerTenantId, paramsTenantId, fallbackTenantId } = {}) {
  return (
    normalizeTenantId(user?.tenantId) ||
    normalizeTenantId(headerTenantId) ||
    normalizeTenantId(paramsTenantId) ||
    normalizeTenantId(fallbackTenantId) ||
    env.defaultTenant
  );
}

export function attachTenantScope(payload = {}, tenantId) {
  return {
    ...payload,
    tenantId: resolveTenantId({ fallbackTenantId: tenantId }),
  };
}
