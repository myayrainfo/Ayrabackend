import createTenantCrudService from "../../core/utils/createTenantCrudService.js";
import adminModel from "./admin.model.js";
import { getAdminSeedData } from "./seed/admin.seed.js";

const adminCrudService = createTenantCrudService({
  model: adminModel,
  entityKey: "admin",
  seedDataFactory: getAdminSeedData,
  searchFields: ["name", "username", "email", "department", "role"],
});

async function getStats(tenantId) {
  const admins = await adminCrudService.listAllRaw(tenantId);
  const activeAdmins = admins.filter((admin) => admin.isActive).length;

  return {
    totalAdmins: admins.length,
    activeAdmins,
    inactiveAdmins: admins.length - activeAdmins,
    departments: [...new Set(admins.map((item) => item.department).filter(Boolean))],
  };
}

export default {
  ...adminCrudService,
  getStats,
};
