import { Types } from "mongoose";

import { getDatabaseState } from "../database/connection.js";
import { attachTenantScope } from "../tenant/tenantHelpers.js";

const memoryStore = new Map();

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function createId(prefix) {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

function matchesSearch(item, searchFields, search) {
  if (!search) {
    return true;
  }

  return searchFields.some((field) => String(item?.[field] || "").toLowerCase().includes(search));
}

function matchesFilters(item, filters) {
  return Object.entries(filters).every(([key, value]) => {
    if (value === undefined || value === null || value === "") {
      return true;
    }

    return String(item?.[key] || "") === String(value);
  });
}

function getTenantItems(storeKey, tenantId, seedDataFactory) {
  if (!memoryStore.has(storeKey)) {
    memoryStore.set(storeKey, new Map());
  }

  const moduleStore = memoryStore.get(storeKey);

  if (!moduleStore.has(tenantId)) {
    const seedItems = (seedDataFactory ? seedDataFactory(tenantId) : []).map((item) =>
      attachTenantScope(item, tenantId),
    );
    moduleStore.set(tenantId, clone(seedItems));
  }

  return moduleStore.get(tenantId);
}

export default function createTenantCrudService({
  model,
  entityKey,
  seedDataFactory,
  searchFields = [],
  defaultSort = "-createdAt",
  defaultFilterBuilder,
}) {
  return {
    async create(tenantId, payload = {}) {
      const scopedPayload = attachTenantScope(payload, tenantId);

      if (getDatabaseState().connected) {
        const item = await model.create(scopedPayload);
        return item.toObject();
      }

      const items = getTenantItems(entityKey, tenantId, seedDataFactory);
      const nextItem = {
        _id: payload._id || createId(entityKey),
        ...scopedPayload,
      };

      items.unshift(nextItem);
      return clone(nextItem);
    },

    async getAll(tenantId, query = {}) {
      const page = Math.max(1, Number(query.page) || 1);
      const limit = Math.max(1, Number(query.limit) || 10);
      const search = String(query.search || "").trim().toLowerCase();
      const filters = defaultFilterBuilder ? defaultFilterBuilder(query) : {};

      if (getDatabaseState().connected) {
        const mongoFilter = { tenantId, ...filters };

        if (search && searchFields.length) {
          mongoFilter.$or = searchFields.map((field) => ({ [field]: { $regex: search, $options: "i" } }));
        }

        const total = await model.countDocuments(mongoFilter);
        const items = await model
          .find(mongoFilter)
          .sort(defaultSort)
          .skip((page - 1) * limit)
          .limit(limit)
          .lean();

        return {
          items,
          pagination: {
            total,
            totalPages: Math.max(1, Math.ceil(total / limit)),
            page,
            limit,
          },
        };
      }

      const items = getTenantItems(entityKey, tenantId, seedDataFactory)
        .filter((item) => matchesSearch(item, searchFields, search))
        .filter((item) => matchesFilters(item, filters));

      const start = (page - 1) * limit;
      const pagedItems = items.slice(start, start + limit);

      return {
        items: clone(pagedItems),
        pagination: {
          total: items.length,
          totalPages: Math.max(1, Math.ceil(items.length / limit)),
          page,
          limit,
        },
      };
    },

    async getById(tenantId, id) {
      if (getDatabaseState().connected) {
        if (!Types.ObjectId.isValid(id) && !String(id).startsWith(entityKey)) {
          return null;
        }

        return model.findOne({ _id: id, tenantId }).lean();
      }

      const items = getTenantItems(entityKey, tenantId, seedDataFactory);
      return clone(items.find((item) => item._id === id) || null);
    },

    async update(tenantId, id, payload = {}) {
      const scopedPayload = { ...payload };
      delete scopedPayload.tenantId;

      if (getDatabaseState().connected) {
        return model.findOneAndUpdate({ _id: id, tenantId }, scopedPayload, { new: true }).lean();
      }

      const items = getTenantItems(entityKey, tenantId, seedDataFactory);
      const index = items.findIndex((item) => item._id === id);

      if (index === -1) {
        return null;
      }

      items[index] = {
        ...items[index],
        ...scopedPayload,
        _id: items[index]._id,
        tenantId,
      };

      return clone(items[index]);
    },

    async remove(tenantId, id) {
      if (getDatabaseState().connected) {
        const result = await model.deleteOne({ _id: id, tenantId });
        return result.deletedCount > 0;
      }

      const items = getTenantItems(entityKey, tenantId, seedDataFactory);
      const index = items.findIndex((item) => item._id === id);

      if (index === -1) {
        return false;
      }

      items.splice(index, 1);
      return true;
    },

    async listAllRaw(tenantId, query = {}) {
      const data = await this.getAll(tenantId, { ...query, page: 1, limit: 1000 });
      return data.items;
    },
  };
}
