export {
  getAdmins as getMasterAdmins,
  createAdmin as createMasterAdmin,
  updateAdmin as updateMasterAdmin,
  deleteAdmin as deleteMasterAdmin,
  toggleAdminStatus as toggleMasterAdminStatus,
  getAdminStats as getMasterAdminStats,
} from "./master/admin.controller.js";

export {
  getAdmins as getSuperAdmins,
  getAdminById as getSuperAdminById,
  createAdmin as createSuperAdmin,
  updateAdmin as updateSuperAdmin,
  deleteAdmin as deleteSuperAdmin,
  toggleAdminStatus as toggleSuperAdminStatus,
} from "./super/admin.controller.js";


