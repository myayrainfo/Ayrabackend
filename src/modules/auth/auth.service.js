import { PANELS } from "../../common/constants/panels.js";

export function getAuthProviders() {
  return [
    { panel: PANELS.LANDING, path: "/api/auth/landing/login" },
    { panel: PANELS.MASTER, path: "/api/auth/master/login" },
    { panel: PANELS.SUPER, path: "/api/auth/super/login" },
    { panel: PANELS.USER, path: "/api/auth/user/:tenant/login" },
  ];
}

export default {
  getAuthProviders,
};


