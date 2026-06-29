import { useAppContext } from "../contexts/AppContext.jsx";
import { useEffect, useState } from "react";
import { getApiErrorMessage } from "../api/apiError.js";
import { api } from "../api/http.js";
import { useForm } from "../hooks/useForm.js";
import { CardSkeleton } from "./shared";
import { GroupCard, GroupDetailPanel, GroupSearchBar } from "./groups";

const defaultFilters = { q: "", category: "", privacy: "" };

function isMember(group, userId) {
  return Boolean(userId && group.memberIds?.includes(userId));
}

function isPending(group, userId) {
  return Boolean(userId && group.pendingMemberIds?.includes(userId));
}

export function GroupDiscoveryPanel() {
  const { copy, currentUser } = useAppContext();

  const filters = useForm(defaultFilters);

  const [groups, setGroups] = useState([]);
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedGroupId, setSelectedGroupId] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const userId = currentUser?.id || currentUser?.sub || "";

  const selectedGroup = groups.find((group) => group.id === selectedGroupId) || groups[0];
  const categories = Array.from(
    new Set(groups.map((group) => group.category).filter(Boolean))
  ).sort();
  const stats = {
    total: groups.length,
    publicCount: groups.filter((group) => group.privacy === "public").length,
    myGroups: groups.filter((group) => isMember(group, userId)).length
  };

  async function loadGroups() {
    setIsLoading(true);
    setMessage("");
    try {
      const [groupsResult, usersResult, postsResult] = await Promise.all([
        api.listGroups(),
        api.listUsers(),
        api.listPosts()
      ]);
      setGroups(groupsResult.groups || []);
      setUsers(usersResult.users || []);
      setPosts(postsResult.posts || []);
    } catch (error) {
      setMessage(getApiErrorMessage(error, copy.crud.failed));
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadGroups();
  }, []);

  async function searchGroups(event) {
    event.preventDefault();
    setIsLoading(true);
    setMessage("");
    try {
      const result = await api.searchGroups(filters.values);
      setGroups(result.groups || []);
    } catch (error) {
      setMessage(getApiErrorMessage(error, copy.crud.failed));
    } finally {
      setIsLoading(false);
    }
  }

  async function joinGroup(groupId) {
    setMessage("");
    try {
      const result = await api.joinGroup(groupId);
      setGroups((current) => current.map((group) => (group.id === groupId ? result.group : group)));
      setSelectedGroupId(groupId);
      setMessage(copy.groups.joinStatus[result.status] || copy.groups.joinStatus.joined);
    } catch (error) {
      setMessage(getApiErrorMessage(error, copy.crud.failed));
    }
  }

  async function approveMember(groupId, userId) {
    setMessage("");
    try {
      const result = await api.approveGroupMember(groupId, userId);
      setGroups((current) => current.map((group) => (group.id === groupId ? result.group : group)));
      setSelectedGroupId(groupId);
      setMessage(copy.groups.approvedRequest);
    } catch (error) {
      setMessage(getApiErrorMessage(error, copy.crud.failed));
    }
  }

  function groupStatus(group) {
    if (isMember(group, userId)) return copy.groups.memberBadge;
    if (isPending(group, userId)) return copy.groups.pendingBadge;
    return group.privacy === "private" ? copy.groups.privateBadge : copy.groups.openBadge;
  }

  function canJoin(group) {
    return !isMember(group, userId) && !isPending(group, userId);
  }

  return (
    <section className="group-discovery" id="groups" aria-label={copy.groups.title}>
      <div className="feed-heading">
        <div>
          <p className="eyebrow">{copy.groups.eyebrow}</p>
          <h2>{copy.groups.title}</h2>
          <p>{copy.groups.subtitle}</p>
        </div>
        <button
          type="button"
          className="secondary-button"
          onClick={loadGroups}
          disabled={isLoading}
        >
          {copy.groups.refresh}
        </button>
      </div>

      <GroupSearchBar
        filters={filters.values}
        categories={categories}
        onChange={filters.onChange}
        onSubmit={searchGroups}
      />

      <div className="group-discovery-layout">
        <div className="group-card-grid">
          {isLoading && <CardSkeleton count={4} />}
          {!isLoading && groups.length === 0 && <p className="feed-state">{copy.groups.empty}</p>}
          {groups.map((group) => (
            <GroupCard
              group={group}
              statusLabel={groupStatus(group)}
              canJoin={canJoin(group)}
              onSelect={() => setSelectedGroupId(group.id)}
              onJoin={() => joinGroup(group.id)}
              key={group.id}
            />
          ))}
        </div>

        <GroupDetailPanel
          group={selectedGroup}
          message={message}
          onApproveMember={approveMember}
          posts={posts}
          stats={stats}
          users={users}
        />
      </div>
    </section>
  );
}
