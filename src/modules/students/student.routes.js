import buildCrudRoutes from "../../core/utils/buildCrudRoutes.js";
import studentController from "./student.controller.js";
import studentValidation from "./student.validation.js";

export default buildCrudRoutes(studentController, studentValidation, ["ADMIN", "ACADEMICS", "TEACHER"]);
