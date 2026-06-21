import { useState } from "react";
import { getApiErrorMessage } from "../api/apiError.js";
import { api } from "../api/http.js";

export function GroupsPanel({ copy }) {
  const [group, setGroup] = useState({ id: "", name: "", description: "", category: "", privacy: "public", userId: "" });
  const [search, setSearch] = useState({ q: "", category: "", privacy: "", memberId: "" });
  const [groups, setGroups] = useState([]);
  const [message, setMessage] = useState("");

  function updateGroupField(event) {
    setGroup((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  function updateSearchField(event) {
    setSearch((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  function selectGroup(item) {
    setGroup({
      id: item.id || "",
      name: item.name || "",
      description: item.description || "",
      category: item.category || "",
      privacy: item.privacy || "public",
      userId: item.pendingMemberIds?.[0] || ""
    });
  }

  async function createGroup(event) {
    event.preventDefault();
    try {
      const result = await api.createGroup(group);
      setGroups((current) => [result.group, ...current]);
      setMessage(copy.crud.created);
    } catch (error) {
      setMessage(getApiErrorMessage(error, copy.crud.failed));
    }
  }

  async function searchGroups(event) {
    event.preventDefault();
    try {
      const result = await api.searchGroups(search);
      setGroups(result.groups || []);
    } catch (error) {
      setMessage(getApiErrorMessage(error, copy.crud.failed));
    }
  }

  async function updateGroup() {
    try {
      await api.updateGroup(group.id, group);
      setMessage(copy.crud.updated);
    } catch (error) {
      setMessage(getApiErrorMessage(error, copy.crud.failed));
    }
  }

  async function deleteGroup() {
    try {
      await api.deleteGroup(group.id);
      setMessage(copy.crud.deleted);
    } catch (error) {
      setMessage(getApiErrorMessage(error, copy.crud.failed));
    }
  }

  async function joinGroup() {
    try {
      const result = await api.joinGroup(group.id);
      setMessage(result.status || copy.crud.updated);
    } catch (error) {
      setMessage(getApiErrorMessage(error, copy.crud.failed));
    }
  }

  async function approveMember() {
    try {
      await api.approveGroupMember(group.id, group.userId);
      setMessage(copy.crud.approved);
    } catch (error) {
      setMessage(getApiErrorMessage(error, copy.crud.failed));
    }
  }

  return (
    <section className="panel" id="groups">
      <div className="panel-heading">
        <h2>{copy.crud.groupsTitle}</h2>
        <button type="button" onClick={async () => {
          try {
            setGroups(((await api.listGroups()).groups || []));
          } catch (error) {
            setMessage(getApiErrorMessage(error, copy.crud.failed));
          }
        }}>{copy.crud.list}</button>
      </div>
      <form className="form-grid" onSubmit={createGroup}>
        <label>{copy.crud.id}<input name="id" value={group.id} onChange={updateGroupField} /></label>
        <label>{copy.crud.name}<input name="name" value={group.name} onChange={updateGroupField} required /></label>
        <label>{copy.crud.category}<input name="category" value={group.category} onChange={updateGroupField} required /></label>
        <label>{copy.crud.privacy}<select name="privacy" value={group.privacy} onChange={updateGroupField}><option value="public">public</option><option value="private">private</option></select></label>
        <label>{copy.crud.description}<input name="description" value={group.description} onChange={updateGroupField} /></label>
        <label>{copy.crud.userId}<input name="userId" value={group.userId} onChange={updateGroupField} /></label>
        <button type="submit" className="primary-button">{copy.crud.create}</button>
        <button type="button" onClick={updateGroup}>{copy.crud.update}</button>
        <button type="button" onClick={deleteGroup}>{copy.crud.delete}</button>
        <button type="button" onClick={joinGroup}>{copy.crud.join}</button>
        <button type="button" onClick={approveMember}>{copy.crud.approve}</button>
      </form>
      <form className="form-grid" onSubmit={searchGroups}>
        <label>{copy.crud.keyword}<input name="q" value={search.q} onChange={updateSearchField} /></label>
        <label>{copy.crud.category}<input name="category" value={search.category} onChange={updateSearchField} /></label>
        <label>{copy.crud.privacy}<input name="privacy" value={search.privacy} onChange={updateSearchField} /></label>
        <label>{copy.crud.memberId}<input name="memberId" value={search.memberId} onChange={updateSearchField} /></label>
        <button type="submit" className="secondary-button">{copy.crud.search}</button>
      </form>
      {message && <p className="form-message">{message}</p>}
      <ul className="result-list" aria-label={copy.crud.groupsTitle}>
        {groups.map((item) => (
          <li className="result-card" key={item.id}>
            <div className="result-card-header">
              <div>
                <strong className="result-title">{item.name}</strong>
                <span className="result-subtitle">{item.description || item.category}</span>
              </div>
              <button type="button" className="compact-button" onClick={() => selectGroup(item)}>
                {copy.crud.select}
              </button>
            </div>
            <dl className="result-meta">
              <div>
                <dt>{copy.crud.id}</dt>
                <dd className="result-id">{item.id}</dd>
              </div>
              <div>
                <dt>{copy.crud.category}</dt>
                <dd>{item.category || "-"}</dd>
              </div>
              <div>
                <dt>{copy.crud.privacy}</dt>
                <dd>{item.privacy || "-"}</dd>
              </div>
              <div>
                <dt>{copy.crud.ownerId}</dt>
                <dd className="result-id">{item.ownerId || "-"}</dd>
              </div>
              <div>
                <dt>{copy.crud.members}</dt>
                <dd>{item.memberIds?.length || 0}</dd>
              </div>
              <div>
                <dt>{copy.crud.pending}</dt>
                <dd>{item.pendingMemberIds?.length || 0}</dd>
              </div>
            </dl>
          </li>
        ))}
      </ul>
    </section>
  );
}
