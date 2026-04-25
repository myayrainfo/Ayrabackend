import buildCrudRoutes from "../../core/utils/buildCrudRoutes.js";
import attendanceController from "./attendance.controller.js";
import attendanceValidation from "./attendance.validation.js";

export default buildCrudRoutes(attendanceController, attendanceValidation, ["ADMIN", "ACADEMICS", "TEACHER"]);
