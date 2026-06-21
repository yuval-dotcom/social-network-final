import { useState } from "react";
import { getApiErrorMessage } from "../api/apiError.js";
import { api } from "../api/http.js";

export function UsersPanel({ copy }) {
  const [search, setSearch] = useState({ q: "", major: "", role: "" });
  const [edit, setEdit] = useState({ id: "", displayName: "", bio: "" });
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");

  function setSearchField(event) {
    setSearch((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  function setEditField(event) {
    setEdit((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  function selectUser(user) {
    setEdit({
      id: user.id || "",
      displayName: user.displayName || "",
      bio: user.bio || ""
    });
  }

  async function listUsers() {
    try {
      const result = await api.listUsers();
      setUsers(result.users || []);
    } catch (error) {
      setMessage(getApiErrorMessage(error, copy.crud.failed));
    }
  }

  async function searchUsers(event) {
    event.preventDefault();
    try {
      const result = await api.searchUsers(search);
      setUsers(result.users || []);
    } catch (error) {
      setMessage(getApiErrorMessage(error, copy.crud.failed));
    }
  }

  async function updateUser(event) {
    event.preventDefault();
    try {
      await api.updateUser(edit.id, { displayName: edit.displayName, bio: edit.bio });
      setMessage(copy.crud.updated);
    } catch (error) {
      setMessage(getApiErrorMessage(error, copy.crud.failed));
    }
  }

  async function deleteUser() {
    try {
      await api.deleteUser(edit.id);
      setMessage(copy.crud.deleted);
    } catch (error) {
      setMessage(getApiErrorMessage(error, copy.crud.failed));
    }
  }

  return (
    <section className="panel" id="users">
      <div className="panel-heading">
        <h2>{copy.crud.usersTitle}</h2>
        <button type="button" onClick={listUsers}>{copy.crud.list}</button>
      </div>
      <p className="hint">{copy.crud.userCreateHint}</p>
      <div className="form-layout">
        <div className="form-section">
          <h3>{copy.crud.searchSection}</h3>
          <form className="form-grid" onSubmit={searchUsers}>
            <label>{copy.crud.keyword}<input name="q" value={search.q} onChange={setSearchField} /></label>
            <label>{copy.fields.major}<input name="major" value={search.major} onChange={setSearchField} /></label>
            <label>{copy.crud.role}<input name="role" value={search.role} onChange={setSearchField} /></label>
            <button type="submit" className="secondary-button">{copy.crud.search}</button>
          </form>
        </div>
        <div className="form-section">
          <div className="form-section-heading">
            <h3>{copy.crud.editSection}</h3>
            <span className={edit.id ? "selection-pill" : "selection-pill muted"}>
              {edit.id ? `${copy.crud.selectedItem}: ${edit.id}` : copy.crud.noSelection}
            </span>
          </div>
          <form className="form-grid" onSubmit={updateUser}>
            <label>{copy.crud.id}<input name="id" value={edit.id} onChange={setEditField} required /></label>
            <label>{copy.fields.displayName}<input name="displayName" value={edit.displayName} onChange={setEditField} required /></label>
            <label>{copy.crud.bio}<input name="bio" value={edit.bio} onChange={setEditField} /></label>
            <button type="submit" className="primary-button">{copy.crud.update}</button>
            <button type="button" className="secondary-button" onClick={deleteUser}>{copy.crud.delete}</button>
          </form>
        </div>
      </div>
      {message && <p className="form-message">{message}</p>}
      <ul className="result-list" aria-label={copy.crud.usersTitle}>
        {users.map((user) => (
          <li className="result-card" key={user.id}>
            <div className="result-card-header">
              <div>
                <strong className="result-title">{user.displayName || user.username}</strong>
                <span className="result-subtitle">@{user.username}</span>
              </div>
              <button type="button" className="compact-button" onClick={() => selectUser(user)}>
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
        ))}
      </ul>
    </section>
  );
}
