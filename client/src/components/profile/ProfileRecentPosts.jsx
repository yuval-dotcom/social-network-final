import { TagChip } from "../shared";

export function ProfileRecentPosts({ copy, groupName, posts }) {
  return (
    <section className="profile-card profile-posts-card" aria-labelledby="profile-posts-title">
      <h3 id="profile-posts-title">{copy.profile.recentPosts}</h3>
      {posts.length === 0 && <p className="profile-empty">{copy.profile.noPosts}</p>}
      <div className="profile-post-list">
        {posts.slice(0, 3).map((post) => (
          <article className="profile-post" key={post.id}>
            <span>{groupName(post.groupId)}</span>
            <p>{post.content}</p>
            <div className="profile-post-tags">
              {(post.tags || []).map((tag) => (
                <TagChip key={tag}>{tag}</TagChip>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
