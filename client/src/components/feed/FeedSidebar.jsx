import { useAppContext } from "../../contexts/AppContext.jsx";
import { FeedProfileCard } from "./FeedProfileCard.jsx";

export function FeedSidebar({ groupOptions, posts }) {
  const { copy, currentUser } = useAppContext();

  return (
    <aside className="feed-sidebar" aria-label={copy.feed.sidebarTitle}>
      <FeedProfileCard posts={posts} groupCount={groupOptions.length} />

      <div className="feed-sidebar-card">
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
      </div>
    </aside>
  );
}
