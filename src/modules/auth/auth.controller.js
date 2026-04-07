import { successResponse } from "../../common/utils/api-response.js";
import { getAuthProviders } from "./auth.service.js";

export function getAuthOverview(_req, res) {
  return successResponse(res, getAuthProviders(), "Available auth modules");
}


