export function createStatsController({ posts, groups }) {
  return {
    async postsByMonth(req, res, next) {
      try {
        const allPosts = await posts.list(req.db);
        const counts = new Map();

        for (const post of allPosts) {
          const month = new Date(post.createdAt).toISOString().slice(0, 7);
          counts.set(month, (counts.get(month) || 0) + 1);
        }

        res.json({
          success: true,
          data: Array.from(counts, ([month, count]) => ({ month, count }))
        });
      } catch (error) {
        next(error);
      }
    },

    async postsByGroup(req, res, next) {
      try {
        const [allPosts, allGroups] = await Promise.all([posts.list(req.db), groups.list(req.db)]);
        const names = new Map(allGroups.map((group) => [group.id, group.name]));
        const counts = new Map();

        for (const post of allPosts) {
          counts.set(post.groupId, (counts.get(post.groupId) || 0) + 1);
        }

        res.json({
          success: true,
          data: Array.from(counts, ([groupId, count]) => ({
            groupId,
            groupName: names.get(groupId) || groupId,
            count
          }))
        });
      } catch (error) {
        next(error);
      }
    }
  };
}

