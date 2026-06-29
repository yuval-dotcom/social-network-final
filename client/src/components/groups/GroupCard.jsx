import { TagChip } from "../shared";

export function GroupCard({ copy, group, statusLabel, canJoin, onSelect, onJoin }) {
  return (
    <article className="group-card">
      <div className="group-card-topline">
        <TagChip>{group.category || copy.groups.groupFallback}</TagChip>
        <span className={`group-privacy ${group.privacy === "private" ? "private" : ""}`}>
          {statusLabel}
        </span>
      </div>
      <h3>{group.name}</h3>
      <p>{group.description || copy.groups.noDescription}</p>
      <dl className="group-card-meta">
        <div>
          <dt>{copy.crud.members}</dt>
          <dd>{group.memberIds?.length || 0}</dd>
        </div>
        <div>
          <dt>{copy.crud.pending}</dt>
          <dd>{group.pendingMemberIds?.length || 0}</dd>
        </div>
      </dl>
      <div className="group-card-actions">
        <button type="button" className="secondary-button" onClick={onSelect}>
          {copy.groups.details}
        </button>
        <button type="button" className="primary-button" disabled={!canJoin} onClick={onJoin}>
          {group.privacy === "private" ? copy.groups.requestJoin : copy.groups.join}
        </button>
      </div>
    </article>
  );
}
