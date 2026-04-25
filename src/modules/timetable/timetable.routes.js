import buildCrudRoutes from "../../core/utils/buildCrudRoutes.js";
import timetableController from "./timetable.controller.js";
import timetableValidation from "./timetable.validation.js";

export default buildCrudRoutes(timetableController, timetableValidation, ["ADMIN", "ACADEMICS"]);
