import createTenantCrudService from "../../core/utils/createTenantCrudService.js";
import examModel from "./exam.model.js";
import { getExamSeedData } from "./seed/exam.seed.js";

export default createTenantCrudService({
  model: examModel,
  entityKey: "exam",
  seedDataFactory: getExamSeedData,
  searchFields: ["courseCode", "courseName", "examType", "venue", "department"],
});
