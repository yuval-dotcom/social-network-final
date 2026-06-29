import { httpError } from "../utils/httpError.js";

function canManageUser(req, userId) {
  return req.user?.role === "admin" || req.user?.sub === userId;
}

export function createUserController({ users }) {
  return {
    async list(req, res) {
      res.json({ success: true, users: await users.list(req.db) });
    },

    async search(req, res) {
      res.json({ success: true, users: await users.search(req.db, req.query) });
    },

    async getOne(req, res) {
      const user = await users.findById(req.db, req.params.id);
      if (!user) throw httpError(404, "User not found");

      res.json({ success: true, user });
    },

    async update(req, res) {
      if (!canManageUser(req, req.params.id)) throw httpError(403, "You can update only your own profile");

      const user = await users.update(req.db, req.params.id, req.body);
      if (!user) throw httpError(404, "User not found");

      res.json({ success: true, user });
    },

    async remove(req, res) {
      if (!canManageUser(req, req.params.id)) throw httpError(403, "You can delete only your own profile");

      const removed = await users.remove(req.db, req.params.id);
      if (!removed) throw httpError(404, "User not found");

      res.json({ success: true });
    }
  };
}
