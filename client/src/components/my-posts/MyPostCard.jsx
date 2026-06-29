import { TagChip } from "../shared";

export function MyPostCard({ copy, post, groupName, isSelected, onEdit, onDelete }) {
  return (
    <article className={`my-post-card ${isSelected ? "is-selected" : ""}`}>
      <div className="my-post-card-header">
        <div>
          <span>{groupName}</span>
          <h3>{post.content}</h3>
        </div>
        <div className="my-post-card-actions">
          <button type="button" className="secondary-button" onClick={onEdit}>
            {copy.myPosts.edit}
          </button>
          <button type="button" className="compact-button" onClick={onDelete}>
            {copy.myPosts.delete}
          </button>
        </div>
      </div>
      {post.tags?.length > 0 && (
        <div className="feed-tags" aria-label={copy.feed.tagsLabel}>
          {post.tags.map((tag) => <TagChip key={tag}>{tag}</TagChip>)}
        </div>
      )}
    </article>
  );
}
