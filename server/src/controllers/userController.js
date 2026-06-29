import { httpError } from "../utils/httpError.js";

function canManageUser(req, userId) {
  return req.user?.role === "admin" || req.user?.sub === userId;
}

export function createUserController({ users }) {
  return {
    /**
     * מחזיר את כל המשתמשים במערכת.
     * @returns {Object} 200 - רשימת אובייקטי המשתמשים.
     */
    async list(req, res) {
      res.json({ success: true, users: await users.list(req.db) });
    },

    /**
     * חיפוש משתמשים לפי פרמטרים שונים (כגון שם, מקצוע, וכו').
     * @param {Object} req.query - פרמטרי החיפוש מה-URL.
     * @returns {Object} 200 - רשימה מסוננת של המשתמשים.
     */
    async search(req, res) {
      res.json({ success: true, users: await users.search(req.db, req.query) });
    },

    /**
     * שליפת פרופיל משתמש בודד לפי מזהה ייחודי.
     * @param {string} req.params.id - מזהה המשתמש בכתובת (URL).
     * @returns {Object} 200 - אובייקט המשתמש שנמצא.
     * @throws {HttpError} 404 - אם המשתמש לא קיים.
     */
    async getOne(req, res) {
      const user = await users.findById(req.db, req.params.id);
      if (!user) throw httpError(404, "User not found");

      res.json({ success: true, user });
    },

    /**
     * עדכון פרטי משתמש. מורשה רק לאדמין או למשתמש עצמו.
     * @param {string} req.params.id - מזהה המשתמש.
     * @param {Object} req.body - השדות שיש לעדכן (למשל displayName).
     * @returns {Object} 200 - המשתמש המעודכן.
     * @throws {HttpError} 403 / 404.
     */
    async update(req, res) {
      if (!canManageUser(req, req.params.id))
        throw httpError(403, "You can update only your own profile");

      const user = await users.update(req.db, req.params.id, req.body);
      if (!user) throw httpError(404, "User not found");

      res.json({ success: true, user });
    },

    /**
     * מחיקת משתמש מהמערכת. מורשה רק לאדמין או למשתמש עצמו.
     * @param {string} req.params.id - מזהה המשתמש.
     * @returns {Object} 200 - { success: true }.
     */
    async remove(req, res) {
      if (!canManageUser(req, req.params.id))
        throw httpError(403, "You can delete only your own profile");

      const removed = await users.remove(req.db, req.params.id);
      if (!removed) throw httpError(404, "User not found");

      res.json({ success: true });
    }
  };
}
