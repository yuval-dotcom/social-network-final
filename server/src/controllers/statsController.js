export function createStatsController({ posts, groups }) {
  return {
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
