import { useAppContext } from "../../contexts/AppContext.jsx";
import { Avatar, TagChip } from "../shared";
import { FeedPostActions } from "./FeedPostActions.jsx";

function formatDate(value, locale) {
  if (!value) return "";
  return new Intl.DateTimeFormat(locale, { dateStyle: "medium", timeStyle: "short" }).format(
    new Date(value)
  );
}

export function FeedPostCard({ post, authorName, groupName, locale }) {
  const { copy } = useAppContext();

  return (
    <article className="feed-post-card">
      <div className="feed-post-header">
        <Avatar name={authorName} />
        <div>
          <strong>{authorName}</strong>
          <span>
            {groupName} · {formatDate(post.createdAt, locale)}
          </span>
        </div>
      </div>
      <p>{post.content}</p>
      {post.mediaType === "video" && post.mediaUrl && (
        <video className="feed-video" controls src={post.mediaUrl}>
          {copy.media.videoLabel}
        </video>
      )}
      {post.tags?.length > 0 && (
        <div className="feed-tags" aria-label={copy.feed.tagsLabel}>
          {post.tags.map((tag) => (
            <TagChip key={tag}>{tag}</TagChip>
          ))}
        </div>
      )}
      <FeedPostActions />
    </article>
  );
}
