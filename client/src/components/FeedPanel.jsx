import { useEffect, useMemo, useState } from "react";
import { getApiErrorMessage } from "../api/apiError.js";
import { api } from "../api/http.js";

const defaultComposer = {
  groupId: "group_algorithms",
  content: "",
  tags: "study, exam"
};

function indexById(items) {
  return Object.fromEntries((items || []).map((item) => [item.id, item]));
}

function splitTags(value) {
  return value.split(",").map((tag) => tag.trim()).filter(Boolean);
}

function formatDate(value, locale) {
  if (!value) return "";
  return new Intl.DateTimeFormat(locale, { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

export function FeedPanel({ copy, currentUser }) {
  const [posts, setPosts] = useState([]);
  const [groups, setGroups] = useState([]);
  const [usersById, setUsersById] = useState({});
  const [composer, setComposer] = useState(defaultComposer);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isPosting, setIsPosting] = useState(false);
  const locale = copy.dir === "rtl" ? "he-IL" : "en-US";

  const groupsById = useMemo(() => indexById(groups), [groups]);
  const groupOptions = useMemo(() => {
    if (groups.some((group) => group.id === defaultComposer.groupId)) {
      return groups;
    }
    return [{ id: defaultComposer.groupId, name: "Algorithms Study Lab" }, ...groups];
  }, [groups]);

  async function loadFeed() {
    setIsLoading(true);
    setMessage("");
    const [feedResult, groupsResult, usersResult] = await Promise.allSettled([
      api.feed(),
      api.listGroups(),
      api.listUsers()
    ]);

    if (feedResult.status === "rejected") {
      setMessage(getApiErrorMessage(feedResult.reason, copy.crud.failed));
      setIsLoading(false);
      return;
    }

    setPosts(feedResult.value.posts || []);
    if (groupsResult.status === "fulfilled") {
      setGroups(groupsResult.value.groups || []);
    }
    if (usersResult.status === "fulfilled") {
      setUsersById(indexById(usersResult.value.users || []));
    }
    setIsLoading(false);
  }

  useEffect(() => {
    loadFeed();
  }, []);

  function updateComposer(event) {
    setComposer((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  async function publishPost(event) {
    event.preventDefault();
    setIsPosting(true);
    setMessage("");
    try {
      const result = await api.createPost({
        groupId: composer.groupId,
        content: composer.content,
        tags: splitTags(composer.tags),
        mediaUrl: "",
        mediaType: ""
      });
      setPosts((current) => [result.post, ...current]);
      setComposer((current) => ({ ...defaultComposer, groupId: current.groupId }));
      setMessage(copy.feed.posted);
    } catch (error) {
      setMessage(getApiErrorMessage(error, copy.feed.failed));
    } finally {
      setIsPosting(false);
    }
  }

  function userName(userId) {
    const user = usersById[userId];
    return user?.displayName || user?.username || userId || copy.feed.unknownUser;
  }

  function groupName(groupId) {
    const group = groupsById[groupId];
    return group?.name || groupId || copy.feed.unknownGroup;
  }

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
          <form className="feed-composer" onSubmit={publishPost}>
            <div className="feed-composer-header">
              <span className="avatar" aria-hidden="true">
                {(currentUser?.displayName || currentUser?.username || "S").slice(0, 1).toUpperCase()}
              </span>
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
                onChange={updateComposer}
                placeholder={copy.feed.placeholder}
                required
              />
            </label>
            <div className="feed-composer-controls">
              <label>
                {copy.feed.groupLabel}
                <select name="groupId" value={composer.groupId} onChange={updateComposer}>
                  {groupOptions.map((group) => (
                    <option key={group.id} value={group.id}>{group.name || group.id}</option>
                  ))}
                </select>
              </label>
              <label>
                {copy.feed.tagsLabel}
                <input name="tags" value={composer.tags} onChange={updateComposer} />
              </label>
              <button type="submit" className="primary-button" disabled={isPosting}>
                {isPosting ? copy.feed.posting : copy.feed.publish}
              </button>
            </div>
          </form>

          {message && <p className="form-message">{message}</p>}
          {isLoading && <p className="feed-state">{copy.feed.loading}</p>}
          {!isLoading && posts.length === 0 && <p className="feed-state">{copy.feed.empty}</p>}

          <div className="feed-list">
            {posts.map((post) => {
              const authorName = userName(post.authorId);
              return (
                <article className="feed-post-card" key={post.id}>
                  <div className="feed-post-header">
                    <span className="avatar" aria-hidden="true">{authorName.slice(0, 1).toUpperCase()}</span>
                    <div>
                      <strong>{authorName}</strong>
                      <span>{groupName(post.groupId)} · {formatDate(post.createdAt, locale)}</span>
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
                        <span className="tag-chip" key={tag}>{tag}</span>
                      ))}
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </div>

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
      </div>
    </section>
  );
}
