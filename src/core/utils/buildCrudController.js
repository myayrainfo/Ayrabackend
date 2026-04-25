export default function buildCrudController(service) {
  return {
    create: async (req, res) => {
      const item = await service.create(req.tenantId, req.body || {});
      res.status(201).json({ ok: true, data: item });
    },
    getAll: async (req, res) => {
      const data = await service.getAll(req.tenantId, req.query || {});
      res.json({ ok: true, data });
    },
    getById: async (req, res) => {
      const item = await service.getById(req.tenantId, req.params.id);

      if (!item) {
        res.status(404).json({ ok: false, message: "Record not found." });
        return;
      }

      res.json({ ok: true, data: item });
    },
    update: async (req, res) => {
      const item = await service.update(req.tenantId, req.params.id, req.body || {});

      if (!item) {
        res.status(404).json({ ok: false, message: "Record not found." });
        return;
      }

      res.json({ ok: true, data: item });
    },
    remove: async (req, res) => {
      const removed = await service.remove(req.tenantId, req.params.id);

      if (!removed) {
        res.status(404).json({ ok: false, message: "Record not found." });
        return;
      }

      res.json({ ok: true, message: "Deleted successfully." });
    },
  };
}
