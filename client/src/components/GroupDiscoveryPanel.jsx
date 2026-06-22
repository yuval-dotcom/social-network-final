import { useEffect, useMemo, useState } from "react";
import { getApiErrorMessage } from "../api/apiError.js";
import { api } from "../api/http.js";
import { GroupCard } from "./groups/GroupCard.jsx";
import { GroupSearchBar } from "./groups/GroupSearchBar.jsx";
import { GroupSpotlight } from "./groups/GroupSpotlight.jsx";

const defaultFilters = {
  q: "",
  category: "",
  privacy: ""
};

function isMember(group, userId) {
  return Boolean(userId && group.memberIds?.includes(userId));
}

function isPending(group, userId) {
  return Boolean(userId && group.pendingMemberIds?.includes(userId));
}

export function GroupDiscoveryPanel({ copy, currentUser }) {
  const [filters, setFilters] = useState(defaultFilters);
  const [groups, setGroups] = useState([]);
  const [selectedGroupId, setSelectedGroupId] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const userId = currentUser?.id || currentUser?.sub || "";

  const selectedGroup = groups.find((group) => group.id === selectedGroupId) || groups[0];
  const categories = useMemo(() => {
    return Array.from(new Set(groups.map((group) => group.category).filter(Boolean))).sort();
  }, [groups]);

  const stats = useMemo(() => {
    return {
      total: groups.length,
      publicCount: groups.filter((group) => group.privacy === "public").length,
      myGroups: groups.filter((group) => isMember(group, userId)).length
    };
  }, [groups, userId]);

  async function loadGroups() {
    setIsLoading(true);
    setMessage("");
    try {
      const result = await api.listGroups();
      setGroups(result.groups || []);
    } catch (error) {
      setMessage(getApiErrorMessage(error, copy.crud.failed));
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadGroups();
  }, []);

  function updateFilter(event) {
    setFilters((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  async function searchGroups(event) {
    event.preventDefault();
    setIsLoading(true);
    setMessage("");
    try {
      const result = await api.searchGroups(filters);
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
        <button type="button" className="secondary-button" onClick={loadGroups} disabled={isLoading}>
          {copy.groups.refresh}
        </button>
      </div>

      <GroupSearchBar
        copy={copy}
        filters={filters}
        categories={categories}
        onChange={updateFilter}
        onSubmit={searchGroups}
      />

      <div className="group-discovery-layout">
        <div className="group-card-grid">
          {isLoading && <p className="feed-state">{copy.groups.loading}</p>}
          {!isLoading && groups.length === 0 && <p className="feed-state">{copy.groups.empty}</p>}
          {groups.map((group) => (
            <GroupCard
              copy={copy}
              group={group}
              statusLabel={groupStatus(group)}
              canJoin={canJoin(group)}
              onSelect={() => setSelectedGroupId(group.id)}
              onJoin={() => joinGroup(group.id)}
              key={group.id}
            />
          ))}
        </div>

        <GroupSpotlight copy={copy} stats={stats} selectedGroup={selectedGroup} message={message} />
      </div>
    </section>
  );
}
