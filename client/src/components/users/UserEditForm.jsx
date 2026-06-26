export function UserEditForm({ copy, edit, onChange, onDelete, onSubmit }) {
  return (
    <div className="form-section">
      <div className="form-section-heading">
        <h3>{copy.crud.editSection}</h3>
        <span className={edit.id ? "selection-pill" : "selection-pill muted"}>
          {edit.id ? `${copy.crud.selectedItem}: ${edit.id}` : copy.crud.noSelection}
        </span>
      </div>
      <form className="form-grid" onSubmit={onSubmit}>
        <label>{copy.crud.id}<input name="id" value={edit.id} onChange={onChange} required /></label>
        <label>{copy.fields.displayName}<input name="displayName" value={edit.displayName} onChange={onChange} required /></label>
        <label>{copy.crud.bio}<input name="bio" value={edit.bio} onChange={onChange} /></label>
        <button type="submit" className="primary-button">{copy.crud.update}</button>
        <button type="button" className="secondary-button" onClick={onDelete}>{copy.crud.delete}</button>
      </form>
    </div>
  );
}
