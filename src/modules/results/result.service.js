import createTenantCrudService from "../../core/utils/createTenantCrudService.js";
import resultModel from "./result.model.js";
import { getResultSeedData } from "./seed/result.seed.js";

export default createTenantCrudService({
  model: resultModel,
  entityKey: "result",
  seedDataFactory: getResultSeedData,
  searchFields: ["studentId", "subjectCode", "subjectName", "grade"],
});
