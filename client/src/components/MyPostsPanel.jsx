import { useEffect, useState } from "react";
import { getApiErrorMessage } from "../api/apiError.js";
import { api } from "../api/http.js";
import { useForm } from "../hooks/useForm.js";
import { indexById, splitCommaList } from "../utils/dataHelpers.js";
import { CardSkeleton } from "./shared";
import { MyPostCard, MyPostEditor, MyPostsSummary } from "./my-posts";

const emptyEditor = { id: "", content: "", tags: "" };

export function MyPostsPanel({ copy }) {
  const editor = useForm(emptyEditor);
  
  const [posts, setPosts] = useState([]);
  const [groupsById, setGroupsById] = useState({});
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
    editor.setValues({
      id: post.id,
      content: post.content || "",
      tags: Array.isArray(post.tags) ? post.tags.join(", ") : ""
    });
  }

  async function savePost(event) {
    event.preventDefault();
    if (!editor.values.id) return;
    setMessage("");
    setIsSaving(true);

    try {
      const result = await api.updatePost(editor.values.id, {
        content: editor.values.content,
        tags: splitCommaList(editor.values.tags)
      });
      setPosts((current) => current.map((post) => (post.id === editor.values.id ? result.post : post)));
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
      if (editor.values.id === postId) editor.reset();
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
          {isLoading && <CardSkeleton count={3} />}
          {!isLoading && posts.length === 0 && <p className="feed-state">{copy.myPosts.empty}</p>}
          {posts.map((post) => (
            <MyPostCard
              copy={copy}
              post={post}
              groupName={groupName(post.groupId)}
              isSelected={editor.values.id === post.id}
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
            editor={editor.values}
            isSaving={isSaving}
            onChange={editor.onChange}
            onSubmit={savePost}
            onCancel={editor.reset}
          />
          {message && <p className="form-message">{message}</p>}
        </div>
      </div>
    </section>
  );
}
