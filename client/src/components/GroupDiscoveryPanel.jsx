import { useAppContext } from "../contexts/AppContext.jsx";
import { CardSkeleton } from "./shared";
import { GroupCard, GroupDetailPanel, GroupSearchBar } from "./groups";
import { useGroupDiscovery } from "../hooks/useGroupDiscovery.js";

export function GroupDiscoveryPanel() {
  const { copy } = useAppContext();
  const {
    filters,
    groups,
    posts,
    users,
    selectedGroup,
    categories,
    stats,
    message,
    isLoading,
    loadGroups,
    searchGroups,
    joinGroup,
    approveMember,
    groupStatus,
    canJoin,
    setSelectedGroupId
  } = useGroupDiscovery();

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
