import { useState } from "react";
import { getApiErrorMessage } from "../api/apiError.js";
import { api } from "../api/http.js";
import { useForm } from "../hooks/useForm.js";
import { GroupManagementForm, GroupManagementResultCard, GroupManagementSearchForm } from "./groups";

const emptyGroup = { id: "", name: "", description: "", category: "", privacy: "public", userId: "" };

export function GroupsPanel({ copy }) {
  const group = useForm(emptyGroup);
  const search = useForm({ q: "", category: "", privacy: "", memberId: "" });
  
  const [groups, setGroups] = useState([]);
  const [message, setMessage] = useState("");

  function selectGroup(item) {
    group.setValues({
      id: item.id || "",
      name: item.name || "",
      description: item.description || "",
      category: item.category || "",
      privacy: item.privacy || "public",
      userId: item.pendingMemberIds?.[0] || ""
    });
  }

  function replaceGroup(updatedGroup) {
    setGroups((current) => current.map((item) => (item.id === updatedGroup.id ? updatedGroup : item)));
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

  function listGroups() {
    handleApiCall(async () => {
      const result = await api.listGroups();
      setGroups(result.groups || []);
    });
  }

  function createGroup(event) {
    event.preventDefault();
    handleApiCall(async () => {
      const { id, userId, ...createPayload } = group.values;
      const result = await api.createGroup(createPayload);
      setGroups((current) => [result.group, ...current]);
      selectGroup(result.group);
    }, copy.crud.created);
  }

  function searchGroups(event) {
    event.preventDefault();
    handleApiCall(async () => {
      const result = await api.searchGroups(search.values);
      setGroups(result.groups || []);
    });
  }

  function updateGroup() {
    handleApiCall(async () => {
      const result = await api.updateGroup(group.values.id, group.values);
      replaceGroup(result.group);
    }, copy.crud.updated);
  }

  function deleteGroup() {
    handleApiCall(async () => {
      await api.deleteGroup(group.values.id);
      setGroups((current) => current.filter((item) => item.id !== group.values.id));
      group.reset();
    }, copy.crud.deleted);
  }

  function joinGroup() {
    handleApiCall(async () => {
      const result = await api.joinGroup(group.values.id);
      replaceGroup(result.group);
      setMessage(result.status || copy.crud.updated); // Override default success
    });
  }

  function approveMember() {
    handleApiCall(async () => {
      const result = await api.approveGroupMember(group.values.id, group.values.userId);
      replaceGroup(result.group);
    }, copy.crud.approved);
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
          group={group.values}
          onApproveMember={approveMember}
          onChange={group.onChange}
          onCreate={createGroup}
          onDelete={deleteGroup}
          onJoin={joinGroup}
          onUpdate={updateGroup}
        />
        <GroupManagementSearchForm
          copy={copy}
          onChange={search.onChange}
          onSubmit={searchGroups}
          search={search.values}
        />
      </div>
      {message && <p className="form-message">{message}</p>}
      <ul className="result-list" aria-label={copy.crud.groupsTitle}>
        {groups.map((item) => (
          <GroupManagementResultCard
            copy={copy}
            group={item}
            isSelected={group.values.id === item.id}
            key={item.id}
            onSelect={() => selectGroup(item)}
          />
        ))}
      </ul>
    </section>
  );
}
