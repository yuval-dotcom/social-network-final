import { useAppContext } from "../../contexts/AppContext.jsx";
export function UserCreateForm({ create, onChange, onSubmit }) {
  const { copy } = useAppContext();

  return (
    <div className="form-section">
      <h3>{copy.crud.userCreateSection}</h3>
      <form className="form-grid" onSubmit={onSubmit}>
        <label>
          {copy.crud.newUsername}
          <input name="username" value={create.username} onChange={onChange} required />
        </label>
        <label>
          {copy.crud.temporaryPassword}
          <input
            name="password"
            type="password"
            value={create.password}
            onChange={onChange}
            required
            minLength={6}
          />
        </label>
        <label>
          {copy.crud.newDisplayName}
          <input name="displayName" value={create.displayName} onChange={onChange} required />
        </label>
        <label>
          {copy.crud.newMajor}
          <input name="major" value={create.major} onChange={onChange} />
        </label>
        <button type="submit" className="primary-button">
          {copy.crud.create}
        </button>
      </form>
    </div>
  );
}
