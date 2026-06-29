import { useAppContext } from "../../contexts/AppContext.jsx";
export function GroupManagementSearchForm({ onChange, onSubmit, search }) {
  const { copy } = useAppContext();

  return (
    <div className="form-section">
      <h3>{copy.crud.searchSection}</h3>
      <form className="form-grid" onSubmit={onSubmit}>
        <label>
          {copy.crud.keyword}
          <input name="q" value={search.q} onChange={onChange} />
        </label>
        <label>
          {copy.crud.category}
          <input name="category" value={search.category} onChange={onChange} />
        </label>
        <label>
          {copy.crud.privacy}
          <input name="privacy" value={search.privacy} onChange={onChange} />
        </label>
        <label>
          {copy.crud.memberId}
          <input name="memberId" value={search.memberId} onChange={onChange} />
        </label>
        <button type="submit" className="secondary-button">
          {copy.crud.search}
        </button>
      </form>
    </div>
  );
}
