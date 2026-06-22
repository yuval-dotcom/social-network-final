export function FeedSidebar({ copy, groupOptions }) {
  return (
    <aside className="feed-sidebar" aria-label={copy.feed.sidebarTitle}>
      <div>
        <h3>{copy.feed.sidebarTitle}</h3>
        <p>{copy.feed.sidebarBody}</p>
      </div>
      <ul>
        {groupOptions.slice(0, 4).map((group) => (
          <li key={group.id}>
            <strong>{group.name || group.id}</strong>
            <span>{group.category || copy.feed.groupFallback}</span>
          </li>
        ))}
      </ul>
    </aside>
  );
}
