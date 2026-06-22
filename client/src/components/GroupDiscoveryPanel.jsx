import { useEffect, useMemo, useState } from "react";
import { getApiErrorMessage } from "../api/apiError.js";
import { api } from "../api/http.js";

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

      <form className="group-search-bar" onSubmit={searchGroups}>
        <label>
          {copy.crud.keyword}
          <input name="q" value={filters.q} onChange={updateFilter} placeholder={copy.groups.keywordPlaceholder} />
        </label>
        <label>
          {copy.crud.category}
          <input name="category" value={filters.category} onChange={updateFilter} list="group-categories" />
        </label>
        <label>
          {copy.crud.privacy}
          <select name="privacy" value={filters.privacy} onChange={updateFilter}>
            <option value="">{copy.groups.allPrivacy}</option>
            <option value="public">{copy.groups.publicPrivacy}</option>
            <option value="private">{copy.groups.privatePrivacy}</option>
          </select>
        </label>
        <button type="submit" className="primary-button">{copy.groups.search}</button>
      </form>
      <datalist id="group-categories">
        {categories.map((category) => <option value={category} key={category} />)}
      </datalist>

      <div className="group-discovery-layout">
        <div className="group-card-grid">
          {isLoading && <p className="feed-state">{copy.groups.loading}</p>}
          {!isLoading && groups.length === 0 && <p className="feed-state">{copy.groups.empty}</p>}
          {groups.map((group) => (
            <article className="group-card" key={group.id}>
              <div className="group-card-topline">
                <span className="tag-chip">{group.category || copy.groups.groupFallback}</span>
                <span className={`group-privacy ${group.privacy === "private" ? "private" : ""}`}>
                  {groupStatus(group)}
                </span>
              </div>
              <h3>{group.name}</h3>
              <p>{group.description || copy.groups.noDescription}</p>
              <dl className="group-card-meta">
                <div>
                  <dt>{copy.crud.members}</dt>
                  <dd>{group.memberIds?.length || 0}</dd>
                </div>
                <div>
                  <dt>{copy.crud.pending}</dt>
                  <dd>{group.pendingMemberIds?.length || 0}</dd>
                </div>
              </dl>
              <div className="group-card-actions">
                <button type="button" className="secondary-button" onClick={() => setSelectedGroupId(group.id)}>
                  {copy.groups.details}
                </button>
                <button
                  type="button"
                  className="primary-button"
                  disabled={!canJoin(group)}
                  onClick={() => joinGroup(group.id)}
                >
                  {group.privacy === "private" ? copy.groups.requestJoin : copy.groups.join}
                </button>
              </div>
            </article>
          ))}
        </div>

        <aside className="group-spotlight" aria-label={copy.groups.spotlightTitle}>
          <div>
            <h3>{copy.groups.spotlightTitle}</h3>
            <p>{copy.groups.spotlightBody}</p>
          </div>
          <div className="group-stats">
            <span><strong>{stats.total}</strong>{copy.groups.totalGroups}</span>
            <span><strong>{stats.publicCount}</strong>{copy.groups.publicGroups}</span>
            <span><strong>{stats.myGroups}</strong>{copy.groups.myGroups}</span>
          </div>
          {selectedGroup && (
            <div className="selected-group">
              <span>{copy.groups.selectedGroup}</span>
              <strong>{selectedGroup.name}</strong>
              <p>{selectedGroup.description || copy.groups.noDescription}</p>
            </div>
          )}
          {message && <p className="form-message">{message}</p>}
        </aside>
      </div>
    </section>
  );
}
