import { useAppContext } from "../../contexts/AppContext.jsx";
import { Avatar } from "../shared";

export function FeedComposer({ composer, groupOptions, isPosting, onChange, onSubmit }) {
  const { copy, currentUser } = useAppContext();

  const displayName = currentUser?.displayName || currentUser?.username || "S";

  return (
    <form className="feed-composer" onSubmit={onSubmit}>
      <div className="feed-composer-header">
        <Avatar name={displayName} />
        <div>
          <strong>{copy.feed.composerTitle}</strong>
          <span>{copy.feed.demoHint}</span>
        </div>
      </div>
      <label className="wide-feed-field">
        {copy.feed.contentLabel}
        <textarea
          name="content"
          value={composer.content}
          onChange={onChange}
          placeholder={copy.feed.placeholder}
          required
        />
      </label>
      <label className="feed-composer-attachment">
        {copy.feed.videoUrlLabel}
        <input
          name="mediaUrl"
          value={composer.mediaUrl}
          onChange={onChange}
          placeholder={copy.feed.videoUrlPlaceholder}
        />
      </label>
      <div className="feed-composer-controls">
        <label>
          {copy.feed.groupLabel}
          <select name="groupId" value={composer.groupId} onChange={onChange}>
            {groupOptions.map((group) => (
              <option key={group.id} value={group.id}>
                {group.name || group.id}
              </option>
            ))}
          </select>
        </label>
        <label>
          {copy.feed.tagsLabel}
          <input name="tags" value={composer.tags} onChange={onChange} />
        </label>
        <button type="submit" className="primary-button" disabled={isPosting}>
          {isPosting ? copy.feed.posting : copy.feed.publish}
        </button>
      </div>
    </form>
  );
}
