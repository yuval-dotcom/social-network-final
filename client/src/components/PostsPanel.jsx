import { useState } from "react";
import { getApiErrorMessage } from "../api/apiError.js";
import { api } from "../api/http.js";
import { useForm } from "../hooks/useForm.js";
import { splitCommaList } from "../utils/dataHelpers.js";
import { PostManagementForm, PostManagementResultCard, PostManagementSearchForm } from "./posts";

const emptyPost = { id: "", groupId: "", content: "", tags: "", mediaUrl: "", mediaType: "" };

export function PostsPanel({ copy }) {
  const post = useForm(emptyPost);
  const search = useForm({ q: "", groupId: "", authorId: "", tag: "", from: "", to: "" });
  
  const [posts, setPosts] = useState([]);
  const [message, setMessage] = useState("");

  function payload() {
    return { ...post.values, tags: splitCommaList(post.values.tags) };
  }

  function selectPost(item) {
    post.setValues({
      id: item.id || "",
      groupId: item.groupId || "",
      content: item.content || "",
      tags: Array.isArray(item.tags) ? item.tags.join(", ") : "",
      mediaUrl: item.mediaUrl || "",
      mediaType: item.mediaType || ""
    });
  }

  function formatDate(value) {
    if (!value) return "-";
    return new Date(value).toLocaleDateString();
  }

  async function handleApiCall(apiAction, successMessage) {
    setMessage("");
    try {
      await apiAction();
      if (successMessage) setMessage(successMessage);
    } catch (error) {
      setMessage(getApiErrorMessage(error, copy.crud.failed));
    }
  }

  function listPosts() {
    handleApiCall(async () => {
      const result = await api.listPosts();
      setPosts(result.posts || []);
    });
  }

  function createPost(event) {
    event.preventDefault();
    handleApiCall(async () => {
      const { id, ...createPayload } = payload();
      const result = await api.createPost(createPayload);
      setPosts((current) => [result.post, ...current]);
      selectPost(result.post);
    }, copy.crud.created);
  }

  function searchPosts(event) {
    event.preventDefault();
    handleApiCall(async () => {
      const result = await api.searchPosts(search.values);
      setPosts(result.posts || []);
    });
  }

  function updatePost() {
    handleApiCall(async () => {
      const result = await api.updatePost(post.values.id, payload());
      setPosts((current) => current.map((item) => (item.id === post.values.id ? result.post : item)));
    }, copy.crud.updated);
  }

  function deletePost() {
    handleApiCall(async () => {
      await api.deletePost(post.values.id);
      setPosts((current) => current.filter((item) => item.id !== post.values.id));
      post.reset();
    }, copy.crud.deleted);
  }

  function loadFeed() {
    handleApiCall(async () => {
      const result = await api.feed();
      setPosts(result.posts || []);
    });
  }

  function loadMine() {
    handleApiCall(async () => {
      const result = await api.myPosts();
      setPosts(result.posts || []);
    });
  }

  return (
    <section className="panel" id="posts">
      <div className="panel-heading">
        <h2>{copy.crud.postsTitle}</h2>
        <div className="topbar-actions">
          <button type="button" onClick={listPosts}>{copy.crud.list}</button>
          <button type="button" onClick={loadFeed}>{copy.crud.feed}</button>
          <button type="button" onClick={loadMine}>{copy.crud.myPosts}</button>
        </div>
      </div>
      <div className="form-layout">
        <PostManagementForm
          copy={copy}
          onChange={post.onChange}
          onCreate={createPost}
          onDelete={deletePost}
          onUpdate={updatePost}
          post={post.values}
        />
        <PostManagementSearchForm
          copy={copy}
          onChange={search.onChange}
          onSubmit={searchPosts}
          search={search.values}
        />
      </div>
      {message && <p className="form-message">{message}</p>}
      <ul className="result-list" aria-label={copy.crud.postsTitle}>
        {posts.map((item) => (
          <PostManagementResultCard
            copy={copy}
            formatDate={formatDate}
            isSelected={post.values.id === item.id}
            key={item.id}
            onSelect={() => selectPost(item)}
            post={item}
          />
        ))}
      </ul>
    </section>
  );
}
