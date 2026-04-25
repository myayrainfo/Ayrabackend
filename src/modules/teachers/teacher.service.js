import createTenantCrudService from "../../core/utils/createTenantCrudService.js";
import teacherModel from "./teacher.model.js";
import { getTeacherSeedData } from "./seed/teacher.seed.js";

export default createTenantCrudService({
  model: teacherModel,
  entityKey: "teacher",
  seedDataFactory: getTeacherSeedData,
  searchFields: ["employeeId", "fullName", "displayName", "department", "designation", "teacherName"],
});
