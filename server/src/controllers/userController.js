import { httpError } from "../utils/httpError.js";

function canManageUser(req, userId) {
  return req.user?.role === "admin" || req.user?.sub === userId;
}

export function createUserController({ users }) {
  return {
    async list(req, res, next) {
      try {
        res.json({ success: true, users: await users.list(req.db) });
      } catch (error) {
        next(error);
      }
    },

    async search(req, res, next) {
      try {
        res.json({ success: true, users: await users.search(req.db, req.query) });
      } catch (error) {
        next(error);
      }
    },

    async getOne(req, res, next) {
      try {
        const user = await users.findById(req.db, req.params.id);
        if (!user) throw httpError(404, "User not found");

        res.json({ success: true, user });
      } catch (error) {
        next(error);
      }
    },

    async update(req, res, next) {
      try {
        if (!canManageUser(req, req.params.id)) throw httpError(403, "You can update only your own profile");

        const user = await users.update(req.db, req.params.id, req.body);
        if (!user) throw httpError(404, "User not found");

        res.json({ success: true, user });
      } catch (error) {
        next(error);
      }
    },

    async remove(req, res, next) {
      try {
        if (!canManageUser(req, req.params.id)) throw httpError(403, "You can delete only your own profile");

        const removed = await users.remove(req.db, req.params.id);
        if (!removed) throw httpError(404, "User not found");

        res.json({ success: true });
      } catch (error) {
        next(error);
      }
    }
  };
}

