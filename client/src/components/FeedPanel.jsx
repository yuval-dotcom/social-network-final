import { useAppContext } from "../contexts/AppContext.jsx";
import { CardSkeleton } from "./shared";
import { FeedComposer, FeedPostCard, FeedSidebar } from "./feed";
import { useFeed } from "../hooks/useFeed.js";

export function FeedPanel() {
  const { copy } = useAppContext();
  const {
    composer,
    posts,
    message,
    isLoading,
    isPosting,
    locale,
    groupOptions,
    loadFeed,
    publishPost,
    userName,
    groupName
  } = useFeed();

  return (
    <section className="feed-home" id="feed" aria-label={copy.feed.title}>
      <div className="feed-heading">
        <div>
          <p className="eyebrow">{copy.feed.eyebrow}</p>
          <h2>{copy.feed.title}</h2>
          <p>{copy.feed.subtitle}</p>
        </div>
        <button type="button" className="secondary-button" onClick={loadFeed} disabled={isLoading}>
          {copy.feed.refresh}
        </button>
      </div>

      <div className="feed-layout">
        <div className="feed-main">
          <FeedComposer
            composer={composer.values}
            groupOptions={groupOptions}
            isPosting={isPosting}
            onChange={composer.onChange}
            onSubmit={publishPost}
          />

          {message && <p className="form-message">{message}</p>}
          {isLoading && <CardSkeleton count={3} />}
          {!isLoading && posts.length === 0 && <p className="feed-state">{copy.feed.empty}</p>}

          <div className="feed-list">
            {posts.map((post) => (
              <FeedPostCard
                post={post}
                authorName={userName(post.authorId)}
                groupName={groupName(post.groupId)}
                locale={locale}
                key={post.id}
              />
            ))}
          </div>
        </div>

        <FeedSidebar groupOptions={groupOptions} posts={posts} />
      </div>
    </section>
  );
}
