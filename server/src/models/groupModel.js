import {
  normalizeStringArray,
  optionalText,
  requireText,
  textSearchFilter
} from "../utils/modelValidation.js";

export const GROUP_COLLECTION = "groups";
export const GROUP_PRIVACY = ["public", "private"];

export function buildGroupDocument(input) {
  const ownerId = requireText(input.ownerId, "ownerId");
  const privacy = GROUP_PRIVACY.includes(input.privacy) ? input.privacy : "public";

  return {
    name: requireText(input.name, "name"),
    description: optionalText(input.description),
    category: requireText(input.category, "category"),
    privacy,
    ownerId,
    managerIds: Array.from(new Set([ownerId, ...normalizeStringArray(input.managerIds)])),
    memberIds: Array.from(new Set([ownerId, ...normalizeStringArray(input.memberIds)])),
    pendingMemberIds: normalizeStringArray(input.pendingMemberIds),
    createdAt: input.createdAt || new Date(),
    updatedAt: input.updatedAt || new Date()
  };
}

export function buildGroupUpdate(input) {
  const update = {};

  if (input.name !== undefined) update.name = requireText(input.name, "name");
  if (input.description !== undefined) update.description = optionalText(input.description);
  if (input.category !== undefined) update.category = requireText(input.category, "category");
  if (input.privacy !== undefined) {
    update.privacy = GROUP_PRIVACY.includes(input.privacy) ? input.privacy : "public";
  }
  if (input.managerIds !== undefined) update.managerIds = normalizeStringArray(input.managerIds);
  if (input.memberIds !== undefined) update.memberIds = normalizeStringArray(input.memberIds);
  if (input.pendingMemberIds !== undefined)
    update.pendingMemberIds = normalizeStringArray(input.pendingMemberIds);

  update.updatedAt = new Date();
  return update;
}

export function buildGroupSearchFilter({ q, category, privacy, memberId } = {}) {
  return {
    ...textSearchFilter(["name", "description", "category"], q),
    ...(category ? { category } : {}),
    ...(privacy ? { privacy } : {}),
    ...(memberId ? { memberIds: memberId } : {})
  };
}

export function isGroupManager(group, userId) {
  return Boolean(group?.managerIds?.includes(userId));
}

export function isGroupMember(group, userId) {
  return Boolean(group?.memberIds?.includes(userId));
}
