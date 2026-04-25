import createTenantCrudService from "../../core/utils/createTenantCrudService.js";
import calendarModel from "./calendar.model.js";
import { getCalendarSeedData } from "./seed/calendar.seed.js";

export default createTenantCrudService({
  model: calendarModel,
  entityKey: "calendar",
  seedDataFactory: getCalendarSeedData,
  searchFields: ["eventName", "eventType", "coordinator", "audience", "venue"],
});
