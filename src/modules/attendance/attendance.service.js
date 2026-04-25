import createTenantCrudService from "../../core/utils/createTenantCrudService.js";
import attendanceModel from "./attendance.model.js";
import { getAttendanceSeedData } from "./seed/attendance.seed.js";

export default createTenantCrudService({
  model: attendanceModel,
  entityKey: "attendance",
  seedDataFactory: getAttendanceSeedData,
  searchFields: ["studentId", "studentName", "status", "department", "monthLabel"],
});
