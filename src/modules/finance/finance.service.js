import createTenantCrudService from "../../core/utils/createTenantCrudService.js";
import financeModel from "./finance.model.js";
import { getFinanceSeedData } from "./seed/finance.seed.js";

export default createTenantCrudService({
  model: financeModel,
  entityKey: "finance",
  seedDataFactory: getFinanceSeedData,
  searchFields: ["title", "studentId", "studentName", "recordType", "status"],
});
