import { isGroupManager } from "../models/groupModel.js";
import { httpError } from "../utils/httpError.js";

function unique(values) {
  return Array.from(new Set(values.filter(Boolean)));
}

export function createGroupController({ groups }) {
  async function requireGroupManager(req) {
    const group = await groups.findById(req.db, req.params.id);
    if (!group) throw httpError(404, "Group not found");
    if (!isGroupManager(group, req.user.sub) && req.user.role !== "admin") {
      throw httpError(403, "Only group managers can perform this action");
    }

    return group;
  }

  return {
    async create(req, res) {
      const group = await groups.create(req.db, { ...req.body, ownerId: req.user.sub });
      res.status(201).json({ success: true, group });
    },

    async list(req, res) {
      res.json({ success: true, groups: await groups.list(req.db) });
    },

    async search(req, res) {
      res.json({ success: true, groups: await groups.search(req.db, req.query) });
    },

    async getOne(req, res) {
      const group = await groups.findById(req.db, req.params.id);
      if (!group) throw httpError(404, "Group not found");

      res.json({ success: true, group });
    },

    async update(req, res) {
      await requireGroupManager(req);
      const group = await groups.update(req.db, req.params.id, req.body);

      res.json({ success: true, group });
    },

    async remove(req, res) {
      await requireGroupManager(req);
      await groups.remove(req.db, req.params.id);

      res.json({ success: true });
    },

    async join(req, res) {
      const group = await groups.findById(req.db, req.params.id);
      if (!group) throw httpError(404, "Group not found");

      const userId = req.user.sub;
      if (group.memberIds.includes(userId)) {
        res.json({ success: true, group, status: "already-member" });
        return;
      }

      const update =
        group.privacy === "private"
          ? { pendingMemberIds: unique([...(group.pendingMemberIds || []), userId]) }
          : { memberIds: unique([...(group.memberIds || []), userId]) };

      const updatedGroup = await groups.update(req.db, req.params.id, update);
      res.json({ success: true, group: updatedGroup, status: group.privacy === "private" ? "pending" : "joined" });
    },

    async approve(req, res) {
      const group = await requireGroupManager(req);
      const userId = req.body.userId;
      if (!userId) throw httpError(400, "userId is required");

      const updatedGroup = await groups.update(req.db, req.params.id, {
        memberIds: unique([...(group.memberIds || []), userId]),
        pendingMemberIds: (group.pendingMemberIds || []).filter((id) => id !== userId)
      });

      res.json({ success: true, group: updatedGroup });
    }
  };
}
