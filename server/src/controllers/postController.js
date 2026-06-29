import { isGroupMember } from "../models/groupModel.js";
import { canEditPost } from "../models/postModel.js";
import { httpError } from "../utils/httpError.js";

function canViewGroupContent(group, userId) {
  return Boolean(group && (group.privacy === "public" || isGroupMember(group, userId)));
}

export function createPostController({ posts, groups, users }) {
  async function requireVisiblePost(req) {
    const post = await posts.findById(req.db, req.params.id);
    if (!post) throw httpError(404, "Post not found");

    const group = await groups.findById(req.db, post.groupId);
    if (!canViewGroupContent(group, req.user.sub)) {
      throw httpError(403, "You cannot view posts from this private group");
    }

    return post;
  }

  return {
    async create(req, res) {
      const group = await groups.findById(req.db, req.body.groupId);
      if (!group) throw httpError(404, "Group not found");
      if (!canViewGroupContent(group, req.user.sub)) {
        throw httpError(403, "Join the group before posting");
      }

      const post = await posts.create(req.db, { ...req.body, authorId: req.user.sub });
      res.status(201).json({ success: true, post });
    },

    async list(req, res) {
      const allPosts = await posts.list(req.db);
      const visiblePosts = [];

      for (const post of allPosts) {
        const group = await groups.findById(req.db, post.groupId);
        if (canViewGroupContent(group, req.user.sub)) visiblePosts.push(post);
      }

      res.json({ success: true, posts: visiblePosts });
    },

    async search(req, res) {
      const foundPosts = await posts.search(req.db, req.query);
      const visiblePosts = [];

      for (const post of foundPosts) {
        const group = await groups.findById(req.db, post.groupId);
        if (canViewGroupContent(group, req.user.sub)) visiblePosts.push(post);
      }

      res.json({ success: true, posts: visiblePosts });
    },

    async feed(req, res) {
      const currentUser = await users.findById(req.db, req.user.sub);
      if (!currentUser) throw httpError(404, "Current user not found");

      const allPosts = await posts.list(req.db);
      const allowedAuthors = new Set([req.user.sub, ...(currentUser.friendIds || [])]);
      const allowedGroups = new Set(currentUser.groupIds || []);
      const feedPosts = [];

      for (const post of allPosts) {
        const group = await groups.findById(req.db, post.groupId);
        const isFriendPost = allowedAuthors.has(post.authorId);
        const isMemberGroupPost = allowedGroups.has(post.groupId) || isGroupMember(group, req.user.sub);

        if ((isFriendPost || isMemberGroupPost) && canViewGroupContent(group, req.user.sub)) {
          feedPosts.push(post);
        }
      }

      res.json({ success: true, posts: feedPosts });
    },

    async mine(req, res) {
      res.json({ success: true, posts: await posts.search(req.db, { authorId: req.user.sub }) });
    },

    async getOne(req, res) {
      res.json({ success: true, post: await requireVisiblePost(req) });
    },

    async update(req, res) {
      const post = await posts.findById(req.db, req.params.id);
      if (!post) throw httpError(404, "Post not found");
      if (!canEditPost(post, req.user.sub) && req.user.role !== "admin") {
        throw httpError(403, "You can update only your own posts");
      }

      res.json({ success: true, post: await posts.update(req.db, req.params.id, req.body) });
    },

    async remove(req, res) {
      const post = await posts.findById(req.db, req.params.id);
      if (!post) throw httpError(404, "Post not found");
      if (!canEditPost(post, req.user.sub) && req.user.role !== "admin") {
        throw httpError(403, "You can delete only your own posts");
      }

      await posts.remove(req.db, req.params.id);
      res.json({ success: true });
    }
  };
}
