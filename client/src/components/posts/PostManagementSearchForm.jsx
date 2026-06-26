export function PostManagementSearchForm({ copy, onChange, onSubmit, search }) {
  return (
    <div className="form-section">
      <h3>{copy.crud.searchSection}</h3>
      <form className="form-grid" onSubmit={onSubmit}>
        <label>{copy.crud.keyword}<input name="q" value={search.q} onChange={onChange} /></label>
        <label>{copy.crud.groupId}<input name="groupId" value={search.groupId} onChange={onChange} /></label>
        <label>{copy.crud.authorId}<input name="authorId" value={search.authorId} onChange={onChange} /></label>
        <label>{copy.crud.tag}<input name="tag" value={search.tag} onChange={onChange} /></label>
        <label>{copy.crud.from}<input name="from" type="date" value={search.from} onChange={onChange} /></label>
        <label>{copy.crud.to}<input name="to" type="date" value={search.to} onChange={onChange} /></label>
        <button type="submit" className="secondary-button">{copy.crud.search}</button>
      </form>
    </div>
  );
}
