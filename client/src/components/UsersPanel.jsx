import { useAppContext } from "../contexts/AppContext.jsx";
import { useState } from "react";
import { getApiErrorMessage } from "../api/apiError.js";
import { api } from "../api/http.js";
import { useForm } from "../hooks/useForm.js";
import { UserCreateForm, UserEditForm, UserResultCard, UserSearchForm } from "./users";

export function UsersPanel() {
  const { copy } = useAppContext();

  const create = useForm({ username: "", password: "", displayName: "", major: "" });
  const search = useForm({ q: "", major: "", role: "" });
  const edit = useForm({ id: "", displayName: "", bio: "" });

  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");

  function selectUser(user) {
    edit.setValues({ id: user.id || "", displayName: user.displayName || "", bio: user.bio || "" });
  }

  function clearEdit() {
    edit.setValues({ id: "", displayName: "", bio: "" });
  }

  async function handleApiCall(apiAction, successMessage) {
    setMessage("");
    try {
      await apiAction();
      if (successMessage) setMessage(successMessage);
    } catch (error) {
      setMessage(getApiErrorMessage(error, copy.crud.failed));
    }
  }

  function listUsers() {
    handleApiCall(async () => {
      const result = await api.listUsers();
      setUsers(result.users || []);
    });
  }

  function searchUsers(event) {
    event.preventDefault();
    handleApiCall(async () => {
      const result = await api.searchUsers(search.values);
      setUsers(result.users || []);
    });
  }

  function createUser(event) {
    event.preventDefault();
    handleApiCall(async () => {
      const result = await api.register(create.values);
      setUsers((current) => [result.user, ...current]);
      create.reset();
    }, copy.crud.created);
  }

  function updateUser(event) {
    event.preventDefault();
    handleApiCall(async () => {
      const result = await api.updateUser(edit.values.id, {
        displayName: edit.values.displayName,
        bio: edit.values.bio
      });
      setUsers((current) =>
        current.map((user) => (user.id === edit.values.id ? result.user : user))
      );
    }, copy.crud.updated);
  }

  function deleteUser() {
    handleApiCall(async () => {
      await api.deleteUser(edit.values.id);
      setUsers((current) => current.filter((user) => user.id !== edit.values.id));
      clearEdit();
    }, copy.crud.deleted);
  }

  return (
    <section className="panel" id="users">
      <div className="panel-heading">
        <h2>{copy.crud.usersTitle}</h2>
        <button type="button" onClick={listUsers}>
          {copy.crud.list}
        </button>
      </div>
      <p className="hint">{copy.crud.userCreateHint}</p>
      <div className="form-layout">
        <UserCreateForm create={create.values} onChange={create.onChange} onSubmit={createUser} />
        <UserSearchForm search={search.values} onChange={search.onChange} onSubmit={searchUsers} />
        <UserEditForm
          edit={edit.values}
          onChange={edit.onChange}
          onDelete={deleteUser}
          onSubmit={updateUser}
        />
      </div>
      {message && <p className="form-message">{message}</p>}
      <ul className="result-list" aria-label={copy.crud.usersTitle}>
        {users.map((user) => (
          <UserResultCard
            isSelected={edit.values.id === user.id}
            key={user.id}
            onSelect={() => selectUser(user)}
            user={user}
          />
        ))}
      </ul>
    </section>
  );
}
