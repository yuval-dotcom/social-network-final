export function createAuthController(authService) {
  return {
    /**
     * רישום משתמש חדש במערכת.
     * מקבל פרטי משתמש, מאמת אותם, שומר במסד הנתונים ומייצר Token ראשוני.
     *
     * @param {Object} req.body - פרטי המשתמש (username, password, displayName, וכו').
     * @returns {Object} 201 - מחזיר את המשתמש שנוצר ואת ה-Token.
     */
    async register(req, res) {
      const result = await authService.register(req.body);
      res.status(201).json({ success: true, ...result });
    },

    /**
     * התחברות משתמש קיים.
     * מאמת את שם המשתמש והסיסמה מול מסד הנתונים.
     *
     * @param {Object} req.body - פרטי ההתחברות (username, password).
     * @returns {Object} 200 - מחזיר את פרטי המשתמש ואת ה-Token במידה וההתחברות הצליחה.
     */
    async login(req, res) {
      const result = await authService.login(req.body);
      res.json({ success: true, ...result });
    },

    /**
     * החזרת פרטי המשתמש המחובר כרגע.
     * משמש לאימות אוטומטי בעת רענון הדף (מסתמך על ה-Token שבבקשה).
     *
     * @returns {Object} 200 - אובייקט עם פרטי המשתמש המפוענחים מה-Token.
     */
    me(req, res) {
      res.json({ success: true, user: req.user });
    }
  };
}
