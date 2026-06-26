export function UserSearchForm({ copy, search, onChange, onSubmit }) {
  return (
    <div className="form-section">
      <h3>{copy.crud.searchSection}</h3>
      <form className="form-grid" onSubmit={onSubmit}>
        <label>{copy.crud.keyword}<input name="q" value={search.q} onChange={onChange} /></label>
        <label>{copy.fields.major}<input name="major" value={search.major} onChange={onChange} /></label>
        <label>{copy.crud.role}<input name="role" value={search.role} onChange={onChange} /></label>
        <button type="submit" className="secondary-button">{copy.crud.search}</button>
      </form>
    </div>
  );
}
