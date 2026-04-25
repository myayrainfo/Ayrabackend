import buildCrudRoutes from "../../core/utils/buildCrudRoutes.js";
import noticeController from "./notice.controller.js";
import noticeValidation from "./notice.validation.js";

export default buildCrudRoutes(noticeController, noticeValidation, ["ADMIN", "ACADEMICS", "COMMUNICATION"]);
