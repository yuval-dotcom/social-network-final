import { normalizeStringArray, optionalText, requireText, textSearchFilter } from "../utils/modelValidation.js";

export const USER_COLLECTION = "users";

export function buildUserDocument(input) {
  return {
    username: requireText(input.username, "username").toLowerCase(),
    passwordHash: requireText(input.passwordHash, "passwordHash"),
    displayName: requireText(input.displayName, "displayName"),
    email: optionalText(input.email).toLowerCase(),
    bio: optionalText(input.bio),
    avatarUrl: optionalText(input.avatarUrl),
    major: optionalText(input.major),
    role: input.role === "admin" ? "admin" : "student",
    friendIds: normalizeStringArray(input.friendIds),
    groupIds: normalizeStringArray(input.groupIds),
    createdAt: input.createdAt || new Date(),
    updatedAt: input.updatedAt || new Date()
  };
}

export function buildUserUpdate(input) {
  const update = {};

  if (input.displayName !== undefined) update.displayName = requireText(input.displayName, "displayName");
  if (input.email !== undefined) update.email = optionalText(input.email).toLowerCase();
  if (input.bio !== undefined) update.bio = optionalText(input.bio);
  if (input.avatarUrl !== undefined) update.avatarUrl = optionalText(input.avatarUrl);
  if (input.major !== undefined) update.major = optionalText(input.major);
  if (input.friendIds !== undefined) update.friendIds = normalizeStringArray(input.friendIds);
  if (input.groupIds !== undefined) update.groupIds = normalizeStringArray(input.groupIds);

  update.updatedAt = new Date();
  return update;
}

export function buildUserSearchFilter({ q, major, role } = {}) {
  return {
    ...textSearchFilter(["username", "displayName", "major"], q),
    ...(major ? { major } : {}),
    ...(role ? { role } : {})
  };
}

export function publicUser(user) {
  if (!user) return null;
  const { passwordHash, ...safeUser } = user;
  return safeUser;
}

