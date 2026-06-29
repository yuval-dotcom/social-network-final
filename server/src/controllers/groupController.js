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
    /**
     * יצירת קבוצת לימוד חדשה.
     * המשתמש היוצר מוגדר אוטומטית כמנהל וכבעלים של הקבוצה.
     *
     * @param {Object} req.body - פרטי הקבוצה (שם, תיאור, פרטיות).
     * @returns {Object} 201 - הקבוצה שנוצרה.
     */
    async create(req, res) {
      const group = await groups.create(req.db, { ...req.body, ownerId: req.user.sub });
      res.status(201).json({ success: true, group });
    },

    /**
     * שליפת כל הקבוצות הקיימות.
     * @returns {Object} 200 - רשימה של אובייקטי הקבוצות.
     */
    async list(req, res) {
      res.json({ success: true, groups: await groups.list(req.db) });
    },

    /**
     * חיפוש קבוצות לפי פרמטרים (שם, קטגוריה, סוג פרטיות).
     * @param {Object} req.query - פרמטרי החיפוש.
     * @returns {Object} 200 - רשימה מסוננת של קבוצות.
     */
    async search(req, res) {
      res.json({ success: true, groups: await groups.search(req.db, req.query) });
    },

    /**
     * שליפת פרטי קבוצה בודדת לפי מזהה.
     * @param {string} req.params.id - מזהה הקבוצה.
     * @returns {Object} 200 - אובייקט הקבוצה.
     * @throws {HttpError} 404 - אם לא נמצאה.
     */
    async getOne(req, res) {
      const group = await groups.findById(req.db, req.params.id);
      if (!group) throw httpError(404, "Group not found");

      res.json({ success: true, group });
    },

    /**
     * עדכון פרטי קבוצה.
     * פעולה מורשית אך ורק למנהל הקבוצה או למנהל מערכת (Admin).
     *
     * @param {string} req.params.id - מזהה הקבוצה.
     * @param {Object} req.body - השדות שיש לעדכן.
     * @returns {Object} 200 - הקבוצה המעודכנת.
     */
    async update(req, res) {
      await requireGroupManager(req);
      const group = await groups.update(req.db, req.params.id, req.body);

      res.json({ success: true, group });
    },

    /**
     * מחיקת קבוצה.
     * מורשית למנהל הקבוצה או אדמין בלבד.
     *
     * @param {string} req.params.id - מזהה הקבוצה.
     * @returns {Object} 200 - { success: true }.
     */
    async remove(req, res) {
      await requireGroupManager(req);
      await groups.remove(req.db, req.params.id);

      res.json({ success: true });
    },

    /**
     * בקשת הצטרפות של המשתמש לקבוצה.
     * אם הקבוצה 'public' - מצורף אוטומטית ל-memberIds.
     * אם הקבוצה 'private' - מתווסף לרשימת ההמתנה pendingMemberIds.
     *
     * @param {string} req.params.id - מזהה הקבוצה.
     * @returns {Object} 200 - סטטוס ("joined", "pending", "already-member").
     */
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
      res.json({
        success: true,
        group: updatedGroup,
        status: group.privacy === "private" ? "pending" : "joined"
      });
    },

    /**
     * אישור חברות של משתמש בקבוצה פרטית על ידי מנהל הקבוצה.
     * מעביר את המשתמש מ-pendingMemberIds ל-memberIds.
     *
     * @param {string} req.params.id - מזהה הקבוצה.
     * @param {string} req.body.userId - מזהה המשתמש הממתין.
     * @returns {Object} 200 - הקבוצה המעודכנת.
     */
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
