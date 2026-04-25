import buildCrudController from "../../core/utils/buildCrudController.js";
import adminService from "./admin.service.js";

const crudController = buildCrudController(adminService);

const adminController = {
  ...crudController,
  async getStats(req, res) {
    const data = await adminService.getStats(req.tenantId);
    res.json({ ok: true, data });
  },
};

export default adminController;
