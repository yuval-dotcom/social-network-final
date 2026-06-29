import { useAppContext } from "../../contexts/AppContext.jsx";
import { useState } from "react";

export function FeedPostActions() {
  const { copy } = useAppContext();

  const [isSaved, setIsSaved] = useState(false);

  return (
    <div className="feed-post-actions" aria-label={copy.feed.postActionsLabel}>
      <button
        type="button"
        className={isSaved ? "feed-action-button is-active" : "feed-action-button"}
        aria-pressed={isSaved}
        onClick={() => setIsSaved((current) => !current)}
      >
        {isSaved ? copy.feed.savedPost : copy.feed.savePost}
      </button>
    </div>
  );
}
