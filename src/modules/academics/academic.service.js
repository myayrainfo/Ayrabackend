import createTenantCrudService from "../../core/utils/createTenantCrudService.js";
import academicModel from "./academic.model.js";
import { getAcademicSeedData } from "./seed/academic.seed.js";

export default createTenantCrudService({
  model: academicModel,
  entityKey: "academic",
  seedDataFactory: getAcademicSeedData,
  searchFields: ["title", "category", "owner", "status", "recordType", "itemType"],
  defaultFilterBuilder: (query) => ({
    category: query.category,
    status: query.status,
    semester: query.semester,
  }),
});
