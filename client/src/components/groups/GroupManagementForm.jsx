import { useAppContext } from "../../contexts/AppContext.jsx";
export function GroupManagementForm({
  group,
  onApproveMember,
  onChange,
  onCreate,
  onDelete,
  onJoin,
  onUpdate
}) {
  const { copy } = useAppContext();

  return (
    <div className="form-section">
      <div className="form-section-heading">
        <h3>{copy.crud.createEditSection}</h3>
        <span className={group.id ? "selection-pill" : "selection-pill muted"}>
          {group.id ? `${copy.crud.selectedItem}: ${group.id}` : copy.crud.noSelection}
        </span>
      </div>
      <form className="form-grid" onSubmit={onCreate}>
        <label>
          {copy.crud.id}
          <input name="id" value={group.id} onChange={onChange} />
        </label>
        <label>
          {copy.crud.name}
          <input name="name" value={group.name} onChange={onChange} required />
        </label>
        <label>
          {copy.crud.category}
          <input name="category" value={group.category} onChange={onChange} required />
        </label>
        <label>
          {copy.crud.privacy}
          <select name="privacy" value={group.privacy} onChange={onChange}>
            <option value="public">public</option>
            <option value="private">private</option>
          </select>
        </label>
        <label>
          {copy.crud.description}
          <input name="description" value={group.description} onChange={onChange} />
        </label>
        <label>
          {copy.crud.userId}
          <input name="userId" value={group.userId} onChange={onChange} />
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
        <button type="button" onClick={onJoin}>
          {copy.crud.join}
        </button>
        <button type="button" onClick={onApproveMember}>
          {copy.crud.approve}
        </button>
      </form>
    </div>
  );
}
