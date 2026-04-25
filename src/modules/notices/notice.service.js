import createTenantCrudService from "../../core/utils/createTenantCrudService.js";
import noticeModel from "./notice.model.js";
import { getNoticeSeedData } from "./seed/notice.seed.js";

export default createTenantCrudService({
  model: noticeModel,
  entityKey: "notice",
  seedDataFactory: getNoticeSeedData,
  searchFields: ["title", "audience", "channel", "status", "noticeType", "username"],
});
