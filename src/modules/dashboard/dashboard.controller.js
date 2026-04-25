import dashboardService from "./dashboard.service.js";

const dashboardController = {
  async getSummary(req, res) {
    const data = await dashboardService.getSummary(req.tenantId);
    res.json({ ok: true, data });
  },
};

export default dashboardController;
