import { Avatar, TagChip } from "../shared";

function userLabel(usersById, userId) {
  const user = usersById.get(userId);
  return user?.displayName || user?.username || userId;
}

function UserRow({ label, subLabel, action }) {
  return (
    <li className="group-user-row">
      <Avatar name={label} />
      <div>
        <strong>{label}</strong>
        {subLabel && <span>{subLabel}</span>}
      </div>
      {action}
    </li>
  );
}

function PeopleList({ title, emptyText, ids, usersById, actionForUser }) {
  return (
    <div className="group-detail-section">
      <h4>{title}</h4>
      {ids.length === 0 && <p className="group-detail-empty">{emptyText}</p>}
      {ids.length > 0 && (
        <ul className="group-user-list">
          {ids.map((userId) => (
            <UserRow
              action={actionForUser?.(userId)}
              key={userId}
              label={userLabel(usersById, userId)}
              subLabel={userId}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

function GroupPostPreviewList({ copy, posts }) {
  return (
    <div className="group-detail-section">
      <h4>{copy.groups.recentPosts}</h4>
      {posts.length === 0 && <p className="group-detail-empty">{copy.groups.noGroupPosts}</p>}
      {posts.length > 0 && (
        <ul className="group-post-preview-list">
          {posts.slice(0, 3).map((post) => (
            <li key={post.id}>
              <p>{post.content}</p>
              {post.tags?.length > 0 && (
                <div className="group-post-tags">
                  {post.tags.slice(0, 3).map((tag) => (
                    <TagChip key={tag}>{tag}</TagChip>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function GroupDetailPanel({ copy, currentUser, group, message, posts, stats, users, onApproveMember }) {
  if (!group) {
    return (
      <aside className="group-detail-panel" aria-label={copy.groups.detailTitle}>
        <h3>{copy.groups.detailTitle}</h3>
        <p>{copy.groups.noSelectedGroup}</p>
      </aside>
    );
  }

  const currentUserId = currentUser?.id || currentUser?.sub || "";
  const usersById = new Map(users.map((user) => [user.id, user]));
  const managerIds = group.managerIds || [];
  const memberIds = group.memberIds || [];
  const pendingMemberIds = group.pendingMemberIds || [];
  const groupPosts = posts.filter((post) => post.groupId === group.id);
  const canManage = currentUser?.role === "admin" || managerIds.includes(currentUserId);

  return (
    <aside className="group-detail-panel" aria-label={copy.groups.detailTitle}>
      <div className="group-detail-hero">
        <div>
          <p className="eyebrow">{copy.groups.detailTitle}</p>
          <h3>{group.name}</h3>
          <p>{group.description || copy.groups.noDescription}</p>
        </div>
        <span className={`group-privacy ${group.privacy === "private" ? "private" : ""}`}>
          {group.privacy === "private" ? copy.groups.privatePrivacy : copy.groups.publicPrivacy}
        </span>
      </div>

      <dl className="group-detail-meta">
        <div>
          <dt>{copy.crud.members}</dt>
          <dd>{memberIds.length}</dd>
        </div>
        <div>
          <dt>{copy.crud.pending}</dt>
          <dd>{pendingMemberIds.length}</dd>
        </div>
        <div>
          <dt>{copy.groups.recentPosts}</dt>
          <dd>{groupPosts.length}</dd>
        </div>
      </dl>

      <div className="group-network-stats" aria-label={copy.groups.spotlightTitle}>
        <span><strong>{stats.total}</strong>{copy.groups.totalGroups}</span>
        <span><strong>{stats.publicCount}</strong>{copy.groups.publicGroups}</span>
        <span><strong>{stats.myGroups}</strong>{copy.groups.myGroups}</span>
      </div>

      <PeopleList
        emptyText={copy.groups.noManagers}
        ids={managerIds}
        title={copy.groups.managers}
        usersById={usersById}
      />

      <PeopleList
        emptyText={copy.groups.noMembers}
        ids={memberIds}
        title={copy.groups.members}
        usersById={usersById}
      />

      <PeopleList
        actionForUser={(userId) => (
          canManage ? (
            <button type="button" className="compact-button" onClick={() => onApproveMember(group.id, userId)}>
              {copy.groups.approveRequest}
            </button>
          ) : null
        )}
        emptyText={copy.groups.noPendingRequests}
        ids={pendingMemberIds}
        title={copy.groups.pendingRequests}
        usersById={usersById}
      />

      <GroupPostPreviewList copy={copy} posts={groupPosts} />

      {canManage && <p className="group-manager-note">{copy.groups.managerNote}</p>}
      {message && <p className="form-message">{message}</p>}
    </aside>
  );
}
