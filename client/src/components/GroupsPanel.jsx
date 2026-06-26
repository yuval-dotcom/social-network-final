import { useState } from "react";
import { getApiErrorMessage } from "../api/apiError.js";
import { api } from "../api/http.js";
import { useForm } from "../hooks/useForm.js";
import { GroupManagementForm } from "./groups/GroupManagementForm.jsx";
import { GroupManagementResultCard } from "./groups/GroupManagementResultCard.jsx";
import { GroupManagementSearchForm } from "./groups/GroupManagementSearchForm.jsx";

const emptyGroup = { id: "", name: "", description: "", category: "", privacy: "public", userId: "" };

export function GroupsPanel({ copy }) {
  const { values: group, handleChange: updateGroupField, setValues: setGroup } = useForm(emptyGroup);
  const { values: search, handleChange: updateSearchField } = useForm({ q: "", category: "", privacy: "", memberId: "" });
  const [groups, setGroups] = useState([]);
  const [message, setMessage] = useState("");

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

  function clearGroup() {
    setGroup(emptyGroup);
  }

  function replaceGroup(updatedGroup) {
    setGroups((current) => current.map((item) => (item.id === updatedGroup.id ? updatedGroup : item)));
  }

  async function listGroups() {
    try {
      setGroups(((await api.listGroups()).groups || []));
    } catch (error) {
      setMessage(getApiErrorMessage(error, copy.crud.failed));
    }
  }

  async function createGroup(event) {
    event.preventDefault();
    try {
      const { id, userId, ...createPayload } = group;
      const result = await api.createGroup(createPayload);
      setGroups((current) => [result.group, ...current]);
      selectGroup(result.group);
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
      const result = await api.updateGroup(group.id, group);
      replaceGroup(result.group);
      setMessage(copy.crud.updated);
    } catch (error) {
      setMessage(getApiErrorMessage(error, copy.crud.failed));
    }
  }

  async function deleteGroup() {
    try {
      await api.deleteGroup(group.id);
      setGroups((current) => current.filter((item) => item.id !== group.id));
      clearGroup();
      setMessage(copy.crud.deleted);
    } catch (error) {
      setMessage(getApiErrorMessage(error, copy.crud.failed));
    }
  }

  async function joinGroup() {
    try {
      const result = await api.joinGroup(group.id);
      replaceGroup(result.group);
      setMessage(result.status || copy.crud.updated);
    } catch (error) {
      setMessage(getApiErrorMessage(error, copy.crud.failed));
    }
  }

  async function approveMember() {
    try {
      const result = await api.approveGroupMember(group.id, group.userId);
      replaceGroup(result.group);
      setMessage(copy.crud.approved);
    } catch (error) {
      setMessage(getApiErrorMessage(error, copy.crud.failed));
    }
  }

  return (
    <section className="panel" id="groups">
      <div className="panel-heading">
        <h2>{copy.crud.groupsTitle}</h2>
        <button type="button" onClick={listGroups}>{copy.crud.list}</button>
      </div>
      <div className="form-layout">
        <GroupManagementForm
          copy={copy}
          group={group}
          onApproveMember={approveMember}
          onChange={updateGroupField}
          onCreate={createGroup}
          onDelete={deleteGroup}
          onJoin={joinGroup}
          onUpdate={updateGroup}
        />
        <GroupManagementSearchForm
          copy={copy}
          onChange={updateSearchField}
          onSubmit={searchGroups}
          search={search}
        />
      </div>
      {message && <p className="form-message">{message}</p>}
      <ul className="result-list" aria-label={copy.crud.groupsTitle}>
        {groups.map((item) => (
          <GroupManagementResultCard
            copy={copy}
            group={item}
            isSelected={group.id === item.id}
            key={item.id}
            onSelect={() => selectGroup(item)}
          />
        ))}
      </ul>
    </section>
  );
}
