import { useEffect, useState } from "react";
import { getApiErrorMessage } from "../api/apiError.js";
import { api } from "../api/http.js";
import { useForm } from "../hooks/useForm.js";
import { indexById, splitCommaList } from "../utils/dataHelpers.js";
import { CardSkeleton } from "./shared/LoadingSkeleton.jsx";
import { FeedComposer } from "./feed/FeedComposer.jsx";
import { FeedPostCard } from "./feed/FeedPostCard.jsx";
import { FeedSidebar } from "./feed/FeedSidebar.jsx";

const defaultComposer = {
  groupId: "group_algorithms",
  content: "",
  tags: "study, exam",
  mediaUrl: ""
};

export function FeedPanel({ copy, currentUser }) {
  const [posts, setPosts] = useState([]);
  const [groups, setGroups] = useState([]);
  const [usersById, setUsersById] = useState({});
  const { values: composer, handleChange: updateComposer, setValues: setComposer } = useForm(defaultComposer);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isPosting, setIsPosting] = useState(false);

  const locale = copy.dir === "rtl" ? "he-IL" : "en-US";
  const groupsById = indexById(groups);
  const groupOptions = groups.some((group) => group.id === defaultComposer.groupId)
    ? groups
    : [{ id: defaultComposer.groupId, name: "Algorithms Study Lab" }, ...groups];

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

  async function publishPost(event) {
    event.preventDefault();
    setMessage("");
    setIsPosting(true);
    try {
      const result = await api.createPost({
        groupId: composer.groupId,
        content: composer.content,
        tags: splitCommaList(composer.tags),
        mediaUrl: composer.mediaUrl.trim(),
        mediaType: composer.mediaUrl.trim() ? "video" : ""
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
          <FeedComposer
            copy={copy}
            currentUser={currentUser}
            composer={composer}
            groupOptions={groupOptions}
            isPosting={isPosting}
            onChange={updateComposer}
            onSubmit={publishPost}
          />

          {message && <p className="form-message">{message}</p>}
          {isLoading && <CardSkeleton count={3} />}
          {!isLoading && posts.length === 0 && <p className="feed-state">{copy.feed.empty}</p>}

          <div className="feed-list">
            {posts.map((post) => (
              <FeedPostCard
                copy={copy}
                post={post}
                authorName={userName(post.authorId)}
                groupName={groupName(post.groupId)}
                locale={locale}
                key={post.id}
              />
            ))}
          </div>
        </div>

        <FeedSidebar
          copy={copy}
          currentUser={currentUser}
          groupOptions={groupOptions}
          posts={posts}
        />
      </div>
    </section>
  );
}
