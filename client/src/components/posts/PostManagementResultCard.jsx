export function PostManagementResultCard({ copy, formatDate, isSelected, onSelect, post }) {
  return (
    <li className={`result-card ${isSelected ? "is-selected" : ""}`}>
      <div className="result-card-header">
        <div>
          <strong className="result-title">{post.content}</strong>
          <span className="result-subtitle">{post.tags?.join(", ") || copy.crud.postsTitle}</span>
        </div>
        <button type="button" className="compact-button" onClick={onSelect}>
          {copy.crud.select}
        </button>
      </div>
      <dl className="result-meta">
        <div>
          <dt>{copy.crud.id}</dt>
          <dd className="result-id">{post.id}</dd>
        </div>
        <div>
          <dt>{copy.crud.groupId}</dt>
          <dd className="result-id">{post.groupId || "-"}</dd>
        </div>
        <div>
          <dt>{copy.crud.authorId}</dt>
          <dd className="result-id">{post.authorId || "-"}</dd>
        </div>
        <div>
          <dt>{copy.crud.mediaType}</dt>
          <dd>{post.mediaType || "-"}</dd>
        </div>
        <div>
          <dt>{copy.crud.createdAt}</dt>
          <dd>{formatDate(post.createdAt)}</dd>
        </div>
      </dl>
    </li>
  );
}
