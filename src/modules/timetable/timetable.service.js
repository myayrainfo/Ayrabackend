import createTenantCrudService from "../../core/utils/createTenantCrudService.js";
import timetableModel from "./timetable.model.js";
import { getTimetableSeedData } from "./seed/timetable.seed.js";

export default createTenantCrudService({
  model: timetableModel,
  entityKey: "timetable",
  seedDataFactory: getTimetableSeedData,
  searchFields: ["subjectCode", "subjectName", "className", "day", "facultyName", "room"],
});
