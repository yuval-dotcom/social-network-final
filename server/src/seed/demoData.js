export async function buildDemoData({
  hashPassword = async (password) => `hash:${password}`
} = {}) {
  const passwordHash = await hashPassword("demo123");
  const now = new Date("2026-06-21T10:00:00.000Z");

  const users = [
    {
      _id: "user_dana",
      username: "dana",
      passwordHash,
      displayName: "Dana Levi",
      email: "dana@example.com",
      major: "Computer Science",
      role: "student",
      friendIds: ["user_noam"],
      groupIds: ["group_algorithms", "group_design"],
      createdAt: now,
      updatedAt: now
    },
    {
      _id: "user_noam",
      username: "noam",
      passwordHash,
      displayName: "Noam Cohen",
      email: "noam@example.com",
      major: "Information Systems",
      role: "student",
      friendIds: ["user_dana"],
      groupIds: ["group_algorithms"],
      createdAt: now,
      updatedAt: now
    },
    {
      _id: "user_maya",
      username: "maya",
      passwordHash,
      displayName: "Maya Bar",
      email: "maya@example.com",
      major: "Visual Communication",
      role: "admin",
      friendIds: [],
      groupIds: ["group_design"],
      createdAt: now,
      updatedAt: now
    }
  ];

  const groups = [
    {
      _id: "group_algorithms",
      name: "Algorithms Study Lab",
      description: "Exam preparation, summaries, and problem solving sessions.",
      category: "Computer Science",
      privacy: "public",
      ownerId: "user_dana",
      managerIds: ["user_dana"],
      memberIds: ["user_dana", "user_noam"],
      pendingMemberIds: [],
      createdAt: now,
      updatedAt: now
    },
    {
      _id: "group_design",
      name: "Campus Design Circle",
      description: "Private group for design critiques and portfolio feedback.",
      category: "Design",
      privacy: "private",
      ownerId: "user_maya",
      managerIds: ["user_maya"],
      memberIds: ["user_maya", "user_dana"],
      pendingMemberIds: ["user_noam"],
      createdAt: now,
      updatedAt: now
    }
  ];

  const posts = [
    {
      _id: "post_algorithms_1",
      authorId: "user_dana",
      groupId: "group_algorithms",
      content: "I uploaded a short summary for graph algorithms.",
      tags: ["exam", "graphs"],
      mediaUrl: "",
      mediaType: "",
      createdAt: new Date("2026-06-01T09:00:00.000Z"),
      updatedAt: now
    },
    {
      _id: "post_algorithms_2",
      authorId: "user_noam",
      groupId: "group_algorithms",
      content: "Who wants to solve dynamic programming questions tonight?",
      tags: ["practice", "dp"],
      mediaUrl: "",
      mediaType: "",
      createdAt: new Date("2026-06-12T17:30:00.000Z"),
      updatedAt: now
    },
    {
      _id: "post_design_1",
      authorId: "user_maya",
      groupId: "group_design",
      content: "Please review this short portfolio video before class.",
      tags: ["portfolio", "video"],
      mediaUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
      mediaType: "video",
      createdAt: new Date("2026-07-04T12:00:00.000Z"),
      updatedAt: now
    }
  ];

  const chatMessages = [
    {
      _id: "message_1",
      roomId: "general",
      senderId: "user_dana",
      recipientId: "",
      text: "Welcome to StudyCircle!",
      createdAt: now
    }
  ];

  return { users, groups, posts, chatMessages };
}
