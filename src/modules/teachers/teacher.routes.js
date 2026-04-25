import buildCrudRoutes from "../../core/utils/buildCrudRoutes.js";
import teacherController from "./teacher.controller.js";
import teacherValidation from "./teacher.validation.js";

export default buildCrudRoutes(teacherController, teacherValidation, ["ADMIN", "ACADEMICS"]);
