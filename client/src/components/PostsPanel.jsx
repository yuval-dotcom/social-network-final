import { useState } from "react";
import { getApiErrorMessage } from "../api/apiError.js";
import { api } from "../api/http.js";
import { useForm } from "../hooks/useForm.js";
import { splitCommaList } from "../utils/dataHelpers.js";
import { PostManagementForm } from "./posts/PostManagementForm.jsx";
import { PostManagementResultCard } from "./posts/PostManagementResultCard.jsx";
import { PostManagementSearchForm } from "./posts/PostManagementSearchForm.jsx";

const emptyPost = { id: "", groupId: "", content: "", tags: "", mediaUrl: "", mediaType: "" };

export function PostsPanel({ copy }) {
  const { values: post, handleChange: updatePostField, setValues: setPost } = useForm(emptyPost);
  const { values: search, handleChange: updateSearchField } = useForm({
    q: "", groupId: "", authorId: "", tag: "", from: "", to: ""
  });
  const [posts, setPosts] = useState([]);
  const [message, setMessage] = useState("");

  function payload() {
    return { ...post, tags: splitCommaList(post.tags) };
  }

  function selectPost(item) {
    setPost({
      id: item.id || "",
      groupId: item.groupId || "",
      content: item.content || "",
      tags: Array.isArray(item.tags) ? item.tags.join(", ") : "",
      mediaUrl: item.mediaUrl || "",
      mediaType: item.mediaType || ""
    });
  }

  function clearPost() {
    setPost(emptyPost);
  }

  function formatDate(value) {
    if (!value) return "-";
    return new Date(value).toLocaleDateString();
  }

  async function listPosts() {
    try {
      setPosts((await api.listPosts()).posts || []);
    } catch (error) {
      setMessage(getApiErrorMessage(error, copy.crud.failed));
    }
  }

  async function createPost(event) {
    event.preventDefault();
    try {
      const { id, ...createPayload } = payload();
      const result = await api.createPost(createPayload);
      setPosts((current) => [result.post, ...current]);
      selectPost(result.post);
      setMessage(copy.crud.created);
    } catch (error) {
      setMessage(getApiErrorMessage(error, copy.crud.failed));
    }
  }

  async function searchPosts(event) {
    event.preventDefault();
    try {
      const result = await api.searchPosts(search);
      setPosts(result.posts || []);
    } catch (error) {
      setMessage(getApiErrorMessage(error, copy.crud.failed));
    }
  }

  async function updatePost() {
    try {
      const result = await api.updatePost(post.id, payload());
      setPosts((current) => current.map((item) => (item.id === post.id ? result.post : item)));
      setMessage(copy.crud.updated);
    } catch (error) {
      setMessage(getApiErrorMessage(error, copy.crud.failed));
    }
  }

  async function deletePost() {
    try {
      await api.deletePost(post.id);
      setPosts((current) => current.filter((item) => item.id !== post.id));
      clearPost();
      setMessage(copy.crud.deleted);
    } catch (error) {
      setMessage(getApiErrorMessage(error, copy.crud.failed));
    }
  }

  async function loadFeed() {
    try {
      setPosts((await api.feed()).posts || []);
    } catch (error) {
      setMessage(getApiErrorMessage(error, copy.crud.failed));
    }
  }

  async function loadMine() {
    try {
      setPosts((await api.myPosts()).posts || []);
    } catch (error) {
      setMessage(getApiErrorMessage(error, copy.crud.failed));
    }
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
          onChange={updatePostField}
          onCreate={createPost}
          onDelete={deletePost}
          onUpdate={updatePost}
          post={post}
        />
        <PostManagementSearchForm
          copy={copy}
          onChange={updateSearchField}
          onSubmit={searchPosts}
          search={search}
        />
      </div>
      {message && <p className="form-message">{message}</p>}
      <ul className="result-list" aria-label={copy.crud.postsTitle}>
        {posts.map((item) => (
          <PostManagementResultCard
            copy={copy}
            formatDate={formatDate}
            isSelected={post.id === item.id}
            key={item.id}
            onSelect={() => selectPost(item)}
            post={item}
          />
        ))}
      </ul>
    </section>
  );
}
