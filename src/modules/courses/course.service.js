import createTenantCrudService from "../../core/utils/createTenantCrudService.js";
import courseModel from "./course.model.js";
import { getCourseSeedData } from "./seed/course.seed.js";

export default createTenantCrudService({
  model: courseModel,
  entityKey: "course",
  seedDataFactory: getCourseSeedData,
  searchFields: ["code", "name", "department", "facultyName", "kind"],
});
