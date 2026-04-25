import buildCrudRoutes from "../../core/utils/buildCrudRoutes.js";
import financeController from "./finance.controller.js";
import financeValidation from "./finance.validation.js";

export default buildCrudRoutes(financeController, financeValidation, ["ADMIN", "FINANCE"]);
