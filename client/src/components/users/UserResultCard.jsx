import { useAppContext } from "../../contexts/AppContext.jsx";
export function UserResultCard({ isSelected, onSelect, user }) {
  const { copy } = useAppContext();

  return (
    <li className={`result-card ${isSelected ? "is-selected" : ""}`}>
      <div className="result-card-header">
        <div>
          <strong className="result-title">{user.displayName || user.username}</strong>
          <span className="result-subtitle">@{user.username}</span>
        </div>
        <button type="button" className="compact-button" onClick={onSelect}>
          {copy.crud.select}
        </button>
      </div>
      <dl className="result-meta">
        <div>
          <dt>{copy.crud.id}</dt>
          <dd className="result-id">{user.id}</dd>
        </div>
        <div>
          <dt>{copy.fields.major}</dt>
          <dd>{user.major || "-"}</dd>
        </div>
        <div>
          <dt>{copy.crud.role}</dt>
          <dd>{user.role || "-"}</dd>
        </div>
        <div>
          <dt>{copy.crud.groupsTitle}</dt>
          <dd>{user.groupIds?.length || 0}</dd>
        </div>
      </dl>
    </li>
  );
}
