export function GroupSpotlight({ copy, stats, selectedGroup, message }) {
  return (
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
  );
}
