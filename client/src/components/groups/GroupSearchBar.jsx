import { useAppContext } from "../../contexts/AppContext.jsx";
export function GroupSearchBar({ filters, categories, onChange, onSubmit }) {
  const { copy } = useAppContext();

  return (
    <>
      <form className="group-search-bar" onSubmit={onSubmit}>
        <label>
          {copy.crud.keyword}
          <input
            name="q"
            value={filters.q}
            onChange={onChange}
            placeholder={copy.groups.keywordPlaceholder}
          />
        </label>
        <label>
          {copy.crud.category}
          <input
            name="category"
            value={filters.category}
            onChange={onChange}
            list="group-categories"
          />
        </label>
        <label>
          {copy.crud.privacy}
          <select name="privacy" value={filters.privacy} onChange={onChange}>
            <option value="">{copy.groups.allPrivacy}</option>
            <option value="public">{copy.groups.publicPrivacy}</option>
            <option value="private">{copy.groups.privatePrivacy}</option>
          </select>
        </label>
        <button type="submit" className="primary-button">
          {copy.groups.search}
        </button>
      </form>
      <datalist id="group-categories">
        {categories.map((category) => (
          <option value={category} key={category} />
        ))}
      </datalist>
    </>
  );
}
