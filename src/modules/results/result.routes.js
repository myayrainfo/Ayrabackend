import buildCrudRoutes from "../../core/utils/buildCrudRoutes.js";
import resultController from "./result.controller.js";
import resultValidation from "./result.validation.js";

export default buildCrudRoutes(resultController, resultValidation, ["ADMIN", "ACADEMICS", "TEACHER"]);
