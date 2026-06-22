export function MyPostsSummary({ copy, stats }) {
  return (
    <aside className="my-posts-summary" aria-label={copy.myPosts.summaryTitle}>
      <div>
        <h3>{copy.myPosts.summaryTitle}</h3>
        <p>{copy.myPosts.summaryBody}</p>
      </div>
      <div className="group-stats">
        <span><strong>{stats.total}</strong>{copy.myPosts.total}</span>
        <span><strong>{stats.tagged}</strong>{copy.myPosts.tagged}</span>
        <span><strong>{stats.groups}</strong>{copy.myPosts.groups}</span>
      </div>
    </aside>
  );
}
