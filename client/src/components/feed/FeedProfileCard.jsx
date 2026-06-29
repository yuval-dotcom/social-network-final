import { useAppContext } from "../../contexts/AppContext.jsx";
import { Avatar } from "../shared";

function uniqueAuthorCount(posts) {
  return new Set((posts || []).map((post) => post.authorId).filter(Boolean)).size;
}

export function FeedProfileCard({ posts, groupCount }) {
  const { copy, currentUser } = useAppContext();

  const displayName = currentUser?.displayName || currentUser?.username || copy.feed.unknownUser;
  const major = currentUser?.major || currentUser?.role || copy.feed.profileDefaultMajor;
  const stats = [
    { label: copy.feed.profilePosts, value: posts.length },
    { label: copy.feed.profileGroups, value: groupCount },
    { label: copy.feed.profileAuthors, value: uniqueAuthorCount(posts) }
  ];

  return (
    <section className="feed-profile-card" aria-label={copy.feed.profileTitle}>
      <div className="feed-profile-header">
        <Avatar name={displayName} />
        <div>
          <span>{copy.feed.profileTitle}</span>
          <strong>{displayName}</strong>
          <p>{major}</p>
        </div>
      </div>
      <p>{copy.feed.profileSubtitle}</p>
      <dl className="feed-profile-stats">
        {stats.map((stat) => (
          <div key={stat.label}>
            <dt>{stat.label}</dt>
            <dd>{stat.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
