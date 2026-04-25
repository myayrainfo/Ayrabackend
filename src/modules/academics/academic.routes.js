import buildCrudRoutes from "../../core/utils/buildCrudRoutes.js";
import academicController from "./academic.controller.js";
import academicValidation from "./academic.validation.js";

export default buildCrudRoutes(academicController, academicValidation, ["ADMIN", "ACADEMICS"]);
