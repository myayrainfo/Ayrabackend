import createTenantCrudService from "../../core/utils/createTenantCrudService.js";
import departmentModel from "./department.model.js";
import { getDepartmentSeedData } from "./seed/department.seed.js";

export default createTenantCrudService({
  model: departmentModel,
  entityKey: "department",
  seedDataFactory: getDepartmentSeedData,
  searchFields: ["name", "code", "hodName", "status"],
});
