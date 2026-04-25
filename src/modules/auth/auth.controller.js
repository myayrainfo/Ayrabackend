import authService from "./auth.service.js";

const authController = {
  async login(req, res) {
    const result = await authService.loginUser({
      tenantId: req.tenantId,
      role: req.body?.role,
      username: req.body?.username,
      password: req.body?.password,
    });

    if (!result) {
      res.status(401).json({ ok: false, message: "Invalid username or password." });
      return;
    }

    res.json({
      ok: true,
      ...result,
      data: result,
    });
  },

  async loginAdmin(req, res) {
    const result = await authService.loginAdmin(req.body || {});

    if (!result) {
      res.status(401).json({ ok: false, message: "Invalid username or password." });
      return;
    }

    if (result.forbidden) {
      res.status(403).json({
        ok: false,
        message: "This account does not have access to the selected portal.",
      });
      return;
    }

    res.json({
      ok: true,
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
      admin: result.user,
      user: result.user,
      data: {
        ...result,
        admin: result.user,
      },
    });
  },

  async refresh(req, res) {
    const result = await authService.refreshSession(req.body?.refreshToken);

    if (!result) {
      res.status(401).json({ ok: false, message: "Invalid refresh token." });
      return;
    }

    res.json({ ok: true, data: result });
  },

  async me(req, res) {
    const data = await authService.getMe(req.user);
    res.json({ ok: true, data });
  },

  async updateProfile(req, res) {
    const data = await authService.updateProfile(req.user, req.body || {});
    res.json({ ok: true, data });
  },

  async changePassword(req, res) {
    const result = await authService.changePassword(req.user, req.body || {});

    if (!result.ok) {
      res.status(400).json(result);
      return;
    }

    res.json(result);
  },

  async logout(_req, res) {
    const result = await authService.logout();
    res.json(result);
  },

  async portalSettings(_req, res) {
    res.json({
      ok: true,
      data: {
        portalAccess: authService.getPortalAccess(),
      },
    });
  },
};

export default authController;
