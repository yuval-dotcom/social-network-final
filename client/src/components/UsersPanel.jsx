import { useState } from "react";
import { getApiErrorMessage } from "../api/apiError.js";
import { api } from "../api/http.js";
import { UserCreateForm } from "./users/UserCreateForm.jsx";
import { UserEditForm } from "./users/UserEditForm.jsx";
import { UserResultCard } from "./users/UserResultCard.jsx";
import { UserSearchForm } from "./users/UserSearchForm.jsx";

export function UsersPanel({ copy }) {
  const [create, setCreate] = useState({ username: "", password: "", displayName: "", major: "" });
  const [search, setSearch] = useState({ q: "", major: "", role: "" });
  const [edit, setEdit] = useState({ id: "", displayName: "", bio: "" });
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");

  function setCreateField(event) {
    setCreate((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

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

  function clearEdit() {
    setEdit({ id: "", displayName: "", bio: "" });
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

  async function createUser(event) {
    event.preventDefault();
    try {
      const result = await api.register(create);
      setUsers((current) => [result.user, ...current]);
      setCreate({ username: "", password: "", displayName: "", major: "" });
      setMessage(copy.crud.created);
    } catch (error) {
      setMessage(getApiErrorMessage(error, copy.crud.failed));
    }
  }

  async function updateUser(event) {
    event.preventDefault();
    try {
      const result = await api.updateUser(edit.id, { displayName: edit.displayName, bio: edit.bio });
      setUsers((current) => current.map((user) => (user.id === edit.id ? result.user : user)));
      setMessage(copy.crud.updated);
    } catch (error) {
      setMessage(getApiErrorMessage(error, copy.crud.failed));
    }
  }

  async function deleteUser() {
    try {
      await api.deleteUser(edit.id);
      setUsers((current) => current.filter((user) => user.id !== edit.id));
      clearEdit();
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
        <UserCreateForm copy={copy} create={create} onChange={setCreateField} onSubmit={createUser} />
        <UserSearchForm copy={copy} search={search} onChange={setSearchField} onSubmit={searchUsers} />
        <UserEditForm copy={copy} edit={edit} onChange={setEditField} onDelete={deleteUser} onSubmit={updateUser} />
      </div>
      {message && <p className="form-message">{message}</p>}
      <ul className="result-list" aria-label={copy.crud.usersTitle}>
        {users.map((user) => (
          <UserResultCard
            copy={copy}
            isSelected={edit.id === user.id}
            key={user.id}
            onSelect={() => selectUser(user)}
            user={user}
          />
        ))}
      </ul>
    </section>
  );
}
