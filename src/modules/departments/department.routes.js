import buildCrudRoutes from "../../core/utils/buildCrudRoutes.js";
import departmentController from "./department.controller.js";
import departmentValidation from "./department.validation.js";

export default buildCrudRoutes(departmentController, departmentValidation, ["ADMIN", "ACADEMICS"]);
