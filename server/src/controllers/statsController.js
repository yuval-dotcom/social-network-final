export function createStatsController({ posts, groups }) {
  return {
    /**
     * מחזיר סטטיסטיקה של כמות הפוסטים שפורסמו בכל חודש.
     * משמש להצגת גרפים אנליטיים בעמוד הסטטיסטיקות של הלקוח.
     *
     * @returns {Object} 200 - מערך של אובייקטים {month: "YYYY-MM", count: X}.
     */
    async postsByMonth(req, res) {
      const allPosts = await posts.list(req.db);

      const byMonth = {};
      for (const post of allPosts) {
        const month = post.createdAt?.toISOString().slice(0, 7) || "Unknown";
        byMonth[month] = (byMonth[month] || 0) + 1;
      }

      const results = Object.entries(byMonth)
        .map(([month, count]) => ({ month, count }))
        .sort((a, b) => a.month.localeCompare(b.month));

      res.json({ success: true, data: results });
    },

    /**
     * מחזיר התפלגות של כמות הפוסטים לפי קבוצת לימוד (מי הקבוצה הפעילה ביותר).
     *
     * @returns {Object} 200 - מערך מסודר לפי כמות הפוסטים מהגבוה לנמוך {groupId, groupName, count}.
     */
    async postsByGroup(req, res) {
      const allPosts = await posts.list(req.db);
      const allGroups = await groups.list(req.db);
      const groupNames = Object.fromEntries(allGroups.map((group) => [group.id, group.name]));

      const byGroup = {};
      for (const post of allPosts) {
        const groupId = post.groupId || "none";
        byGroup[groupId] = (byGroup[groupId] || 0) + 1;
      }

      const results = Object.entries(byGroup)
        .map(([groupId, count]) => ({
          groupId,
          groupName: groupNames[groupId] || groupId,
          count
        }))
        .sort((a, b) => b.count - a.count);

      res.json({ success: true, data: results });
    }
  };
}
