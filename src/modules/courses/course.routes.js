import buildCrudRoutes from "../../core/utils/buildCrudRoutes.js";
import courseController from "./course.controller.js";
import courseValidation from "./course.validation.js";

export default buildCrudRoutes(courseController, courseValidation, ["ADMIN", "ACADEMICS", "TEACHER"]);
