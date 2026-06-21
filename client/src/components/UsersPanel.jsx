import { useState } from "react";
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

  async function listUsers() {
    const result = await api.listUsers();
    setUsers(result.users || []);
  }

  async function searchUsers(event) {
    event.preventDefault();
    const result = await api.searchUsers(search);
    setUsers(result.users || []);
  }

  async function updateUser(event) {
    event.preventDefault();
    await api.updateUser(edit.id, { displayName: edit.displayName, bio: edit.bio });
    setMessage(copy.crud.updated);
  }

  async function deleteUser() {
    await api.deleteUser(edit.id);
    setMessage(copy.crud.deleted);
  }

  return (
    <section className="panel" id="users">
      <div className="panel-heading">
        <h2>{copy.crud.usersTitle}</h2>
        <button type="button" onClick={listUsers}>{copy.crud.list}</button>
      </div>
      <p className="hint">{copy.crud.userCreateHint}</p>
      <form className="form-grid" onSubmit={searchUsers}>
        <label>{copy.crud.keyword}<input name="q" value={search.q} onChange={setSearchField} /></label>
        <label>{copy.fields.major}<input name="major" value={search.major} onChange={setSearchField} /></label>
        <label>{copy.crud.role}<input name="role" value={search.role} onChange={setSearchField} /></label>
        <button type="submit" className="secondary-button">{copy.crud.search}</button>
      </form>
      <form className="form-grid" onSubmit={updateUser}>
        <label>{copy.crud.id}<input name="id" value={edit.id} onChange={setEditField} required /></label>
        <label>{copy.fields.displayName}<input name="displayName" value={edit.displayName} onChange={setEditField} required /></label>
        <label>{copy.crud.bio}<input name="bio" value={edit.bio} onChange={setEditField} /></label>
        <button type="submit" className="primary-button">{copy.crud.update}</button>
        <button type="button" className="secondary-button" onClick={deleteUser}>{copy.crud.delete}</button>
      </form>
      {message && <p className="form-message">{message}</p>}
      <ul className="result-list" aria-label={copy.crud.usersTitle}>
        {users.map((user) => <li key={user.id}>{user.displayName || user.username}</li>)}
      </ul>
    </section>
  );
}

