import buildCrudRoutes from "../../core/utils/buildCrudRoutes.js";
import calendarController from "./calendar.controller.js";
import calendarValidation from "./calendar.validation.js";

export default buildCrudRoutes(calendarController, calendarValidation, ["ADMIN", "ACADEMICS", "COMMUNICATION"]);
