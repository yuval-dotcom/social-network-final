import {
  normalizeStringArray,
  optionalText,
  requireText,
  textSearchFilter
} from "../utils/modelValidation.js";

export const POST_COLLECTION = "posts";

export function buildPostDocument(input) {
  return {
    authorId: requireText(input.authorId, "authorId"),
    groupId: requireText(input.groupId, "groupId"),
    content: requireText(input.content, "content"),
    tags: normalizeStringArray(input.tags),
    mediaUrl: optionalText(input.mediaUrl),
    mediaType: optionalText(input.mediaType),
    createdAt: input.createdAt || new Date(),
    updatedAt: input.updatedAt || new Date()
  };
}

export function buildPostUpdate(input) {
  const update = {};

  if (input.content !== undefined) update.content = requireText(input.content, "content");
  if (input.tags !== undefined) update.tags = normalizeStringArray(input.tags);
  if (input.mediaUrl !== undefined) update.mediaUrl = optionalText(input.mediaUrl);
  if (input.mediaType !== undefined) update.mediaType = optionalText(input.mediaType);

  update.updatedAt = new Date();
  return update;
}

export function buildPostSearchFilter({ q, groupId, authorId, tag, from, to } = {}) {
  const dateFilter = {};
  if (from) dateFilter.$gte = new Date(from);
  if (to) dateFilter.$lte = new Date(to);

  return {
    ...textSearchFilter(["content", "tags"], q),
    ...(groupId ? { groupId } : {}),
    ...(authorId ? { authorId } : {}),
    ...(tag ? { tags: tag } : {}),
    ...(Object.keys(dateFilter).length ? { createdAt: dateFilter } : {})
  };
}

export function canEditPost(post, userId) {
  return Boolean(post && post.authorId === userId);
}
