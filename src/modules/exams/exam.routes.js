import buildCrudRoutes from "../../core/utils/buildCrudRoutes.js";
import examController from "./exam.controller.js";
import examValidation from "./exam.validation.js";

export default buildCrudRoutes(examController, examValidation, ["ADMIN", "ACADEMICS"]);
