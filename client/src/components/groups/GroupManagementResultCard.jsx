import { useAppContext } from "../../contexts/AppContext.jsx";
export function GroupManagementResultCard({ group, isSelected, onSelect }) {
  const { copy } = useAppContext();

  return (
    <li className={`result-card ${isSelected ? "is-selected" : ""}`}>
      <div className="result-card-header">
        <div>
          <strong className="result-title">{group.name}</strong>
          <span className="result-subtitle">{group.description || group.category}</span>
        </div>
        <button type="button" className="compact-button" onClick={onSelect}>
          {copy.crud.select}
        </button>
      </div>
      <dl className="result-meta">
        <div>
          <dt>{copy.crud.id}</dt>
          <dd className="result-id">{group.id}</dd>
        </div>
        <div>
          <dt>{copy.crud.category}</dt>
          <dd>{group.category || "-"}</dd>
        </div>
        <div>
          <dt>{copy.crud.privacy}</dt>
          <dd>{group.privacy || "-"}</dd>
        </div>
        <div>
          <dt>{copy.crud.ownerId}</dt>
          <dd className="result-id">{group.ownerId || "-"}</dd>
        </div>
        <div>
          <dt>{copy.crud.members}</dt>
          <dd>{group.memberIds?.length || 0}</dd>
        </div>
        <div>
          <dt>{copy.crud.pending}</dt>
          <dd>{group.pendingMemberIds?.length || 0}</dd>
        </div>
      </dl>
    </li>
  );
}
