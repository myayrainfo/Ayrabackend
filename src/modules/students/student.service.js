import createTenantCrudService from "../../core/utils/createTenantCrudService.js";
import studentModel from "./student.model.js";
import { getStudentSeedData } from "./seed/student.seed.js";

export default createTenantCrudService({
  model: studentModel,
  entityKey: "student",
  seedDataFactory: getStudentSeedData,
  searchFields: ["studentId", "fullName", "displayName", "email", "department", "username"],
  defaultFilterBuilder: (query) => ({
    department: query.department,
    semester: query.semester,
    section: query.section,
    status: query.status,
  }),
});
