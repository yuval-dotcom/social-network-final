import { useAppContext } from "../../contexts/AppContext.jsx";
export function PostManagementForm({ onChange, onCreate, onDelete, onUpdate, post }) {
  const { copy } = useAppContext();

  return (
    <div className="form-section">
      <div className="form-section-heading">
        <h3>{copy.crud.createEditSection}</h3>
        <span className={post.id ? "selection-pill" : "selection-pill muted"}>
          {post.id ? `${copy.crud.selectedItem}: ${post.id}` : copy.crud.noSelection}
        </span>
      </div>
      <form className="form-grid" onSubmit={onCreate}>
        <label>
          {copy.crud.id}
          <input name="id" value={post.id} onChange={onChange} />
        </label>
        <label>
          {copy.crud.groupId}
          <input name="groupId" value={post.groupId} onChange={onChange} required />
        </label>
        <label>
          {copy.crud.tags}
          <input name="tags" value={post.tags} onChange={onChange} />
        </label>
        <label>
          {copy.crud.mediaUrl}
          <input name="mediaUrl" value={post.mediaUrl} onChange={onChange} />
        </label>
        <label>
          {copy.crud.mediaType}
          <input name="mediaType" value={post.mediaType} onChange={onChange} />
        </label>
        <label className="wide-field">
          {copy.crud.content}
          <textarea name="content" value={post.content} onChange={onChange} required />
        </label>
        <button type="submit" className="primary-button">
          {copy.crud.create}
        </button>
        <button type="button" onClick={onUpdate}>
          {copy.crud.update}
        </button>
        <button type="button" onClick={onDelete}>
          {copy.crud.delete}
        </button>
      </form>
    </div>
  );
}
