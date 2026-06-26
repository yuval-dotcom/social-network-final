import { useEffect, useState } from "react";
import { getApiErrorMessage } from "../api/apiError.js";
import { api } from "../api/http.js";
import { MyPostCard } from "./my-posts/MyPostCard.jsx";
import { MyPostEditor } from "./my-posts/MyPostEditor.jsx";
import { MyPostsSummary } from "./my-posts/MyPostsSummary.jsx";

const emptyEditor = {
  id: "",
  content: "",
  tags: ""
};

function indexById(items) {
  return Object.fromEntries((items || []).map((item) => [item.id, item]));
}

function splitTags(value) {
  return value.split(",").map((tag) => tag.trim()).filter(Boolean);
}

export function MyPostsPanel({ copy }) {
  const [posts, setPosts] = useState([]);
  const [groupsById, setGroupsById] = useState({});
  const [editor, setEditor] = useState(emptyEditor);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const stats = {
    total: posts.length,
    tagged: posts.filter((post) => post.tags?.length > 0).length,
    groups: new Set(posts.map((post) => post.groupId).filter(Boolean)).size
  };

  async function loadMyPosts() {
    setIsLoading(true);
    setMessage("");
    const [postsResult, groupsResult] = await Promise.allSettled([
      api.myPosts(),
      api.listGroups()
    ]);

    if (postsResult.status === "rejected") {
      setMessage(getApiErrorMessage(postsResult.reason, copy.crud.failed));
      setIsLoading(false);
      return;
    }

    setPosts(postsResult.value.posts || []);
    if (groupsResult.status === "fulfilled") {
      setGroupsById(indexById(groupsResult.value.groups || []));
    }
    setIsLoading(false);
  }

  useEffect(() => {
    loadMyPosts();
  }, []);

  function groupName(groupId) {
    return groupsById[groupId]?.name || groupId || copy.feed.unknownGroup;
  }

  function startEdit(post) {
    setEditor({
      id: post.id,
      content: post.content || "",
      tags: Array.isArray(post.tags) ? post.tags.join(", ") : ""
    });
  }

  function updateEditor(event) {
    setEditor((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  async function savePost(event) {
    event.preventDefault();
    if (!editor.id) return;

    setIsSaving(true);
    setMessage("");
    try {
      const result = await api.updatePost(editor.id, {
        content: editor.content,
        tags: splitTags(editor.tags)
      });
      setPosts((current) => current.map((post) => (post.id === editor.id ? result.post : post)));
      startEdit(result.post);
      setMessage(copy.myPosts.updated);
    } catch (error) {
      setMessage(getApiErrorMessage(error, copy.crud.failed));
    } finally {
      setIsSaving(false);
    }
  }

  async function deletePost(postId) {
    setMessage("");
    try {
      await api.deletePost(postId);
      setPosts((current) => current.filter((post) => post.id !== postId));
      if (editor.id === postId) setEditor(emptyEditor);
      setMessage(copy.myPosts.deleted);
    } catch (error) {
      setMessage(getApiErrorMessage(error, copy.crud.failed));
    }
  }

  return (
    <section className="my-posts-view" id="my-posts" aria-label={copy.myPosts.title}>
      <div className="feed-heading">
        <div>
          <p className="eyebrow">{copy.myPosts.eyebrow}</p>
          <h2>{copy.myPosts.title}</h2>
          <p>{copy.myPosts.subtitle}</p>
        </div>
        <button type="button" className="secondary-button" onClick={loadMyPosts} disabled={isLoading}>
          {copy.myPosts.refresh}
        </button>
      </div>

      <div className="my-posts-layout">
        <div className="my-post-list">
          {isLoading && <p className="feed-state">{copy.myPosts.loading}</p>}
          {!isLoading && posts.length === 0 && <p className="feed-state">{copy.myPosts.empty}</p>}
          {posts.map((post) => (
            <MyPostCard
              copy={copy}
              post={post}
              groupName={groupName(post.groupId)}
              isSelected={editor.id === post.id}
              onEdit={() => startEdit(post)}
              onDelete={() => deletePost(post.id)}
              key={post.id}
            />
          ))}
        </div>

        <div className="my-posts-side">
          <MyPostsSummary copy={copy} stats={stats} />
          <MyPostEditor
            copy={copy}
            editor={editor}
            isSaving={isSaving}
            onChange={updateEditor}
            onSubmit={savePost}
            onCancel={() => setEditor(emptyEditor)}
          />
          {message && <p className="form-message">{message}</p>}
        </div>
      </div>
    </section>
  );
}
