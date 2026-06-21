import { useState } from "react";
import { getApiErrorMessage } from "../api/apiError.js";
import { api } from "../api/http.js";

export function PostsPanel({ copy }) {
  const [post, setPost] = useState({ id: "", groupId: "", content: "", tags: "", mediaUrl: "", mediaType: "" });
  const [search, setSearch] = useState({ q: "", groupId: "", authorId: "", tag: "", from: "", to: "" });
  const [posts, setPosts] = useState([]);
  const [message, setMessage] = useState("");

  function updatePostField(event) {
    setPost((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  function updateSearchField(event) {
    setSearch((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  function payload() {
    return { ...post, tags: post.tags.split(",").map((tag) => tag.trim()).filter(Boolean) };
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

  function formatDate(value) {
    if (!value) return "-";
    return new Date(value).toLocaleDateString();
  }

  async function createPost(event) {
    event.preventDefault();
    try {
      const result = await api.createPost(payload());
      setPosts((current) => [result.post, ...current]);
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
      await api.updatePost(post.id, payload());
      setMessage(copy.crud.updated);
    } catch (error) {
      setMessage(getApiErrorMessage(error, copy.crud.failed));
    }
  }

  async function deletePost() {
    try {
      await api.deletePost(post.id);
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
          <button type="button" onClick={async () => {
            try {
              setPosts((await api.listPosts()).posts || []);
            } catch (error) {
              setMessage(getApiErrorMessage(error, copy.crud.failed));
            }
          }}>{copy.crud.list}</button>
          <button type="button" onClick={loadFeed}>{copy.crud.feed}</button>
          <button type="button" onClick={loadMine}>{copy.crud.myPosts}</button>
        </div>
      </div>
      <div className="form-layout">
        <div className="form-section">
          <div className="form-section-heading">
            <h3>{copy.crud.createEditSection}</h3>
            <span className={post.id ? "selection-pill" : "selection-pill muted"}>
              {post.id ? `${copy.crud.selectedItem}: ${post.id}` : copy.crud.noSelection}
            </span>
          </div>
          <form className="form-grid" onSubmit={createPost}>
            <label>{copy.crud.id}<input name="id" value={post.id} onChange={updatePostField} /></label>
            <label>{copy.crud.groupId}<input name="groupId" value={post.groupId} onChange={updatePostField} required /></label>
            <label>{copy.crud.tags}<input name="tags" value={post.tags} onChange={updatePostField} /></label>
            <label>{copy.crud.mediaUrl}<input name="mediaUrl" value={post.mediaUrl} onChange={updatePostField} /></label>
            <label>{copy.crud.mediaType}<input name="mediaType" value={post.mediaType} onChange={updatePostField} /></label>
            <label className="wide-field">{copy.crud.content}<textarea name="content" value={post.content} onChange={updatePostField} required /></label>
            <button type="submit" className="primary-button">{copy.crud.create}</button>
            <button type="button" onClick={updatePost}>{copy.crud.update}</button>
            <button type="button" onClick={deletePost}>{copy.crud.delete}</button>
          </form>
        </div>
        <div className="form-section">
          <h3>{copy.crud.searchSection}</h3>
          <form className="form-grid" onSubmit={searchPosts}>
            <label>{copy.crud.keyword}<input name="q" value={search.q} onChange={updateSearchField} /></label>
            <label>{copy.crud.groupId}<input name="groupId" value={search.groupId} onChange={updateSearchField} /></label>
            <label>{copy.crud.authorId}<input name="authorId" value={search.authorId} onChange={updateSearchField} /></label>
            <label>{copy.crud.tag}<input name="tag" value={search.tag} onChange={updateSearchField} /></label>
            <label>{copy.crud.from}<input name="from" type="date" value={search.from} onChange={updateSearchField} /></label>
            <label>{copy.crud.to}<input name="to" type="date" value={search.to} onChange={updateSearchField} /></label>
            <button type="submit" className="secondary-button">{copy.crud.search}</button>
          </form>
        </div>
      </div>
      {message && <p className="form-message">{message}</p>}
      <ul className="result-list" aria-label={copy.crud.postsTitle}>
        {posts.map((item) => (
          <li className="result-card" key={item.id}>
            <div className="result-card-header">
              <div>
                <strong className="result-title">{item.content}</strong>
                <span className="result-subtitle">{item.tags?.join(", ") || copy.crud.postsTitle}</span>
              </div>
              <button type="button" className="compact-button" onClick={() => selectPost(item)}>
                {copy.crud.select}
              </button>
            </div>
            <dl className="result-meta">
              <div>
                <dt>{copy.crud.id}</dt>
                <dd className="result-id">{item.id}</dd>
              </div>
              <div>
                <dt>{copy.crud.groupId}</dt>
                <dd className="result-id">{item.groupId || "-"}</dd>
              </div>
              <div>
                <dt>{copy.crud.authorId}</dt>
                <dd className="result-id">{item.authorId || "-"}</dd>
              </div>
              <div>
                <dt>{copy.crud.mediaType}</dt>
                <dd>{item.mediaType || "-"}</dd>
              </div>
              <div>
                <dt>{copy.crud.createdAt}</dt>
                <dd>{formatDate(item.createdAt)}</dd>
              </div>
            </dl>
          </li>
        ))}
      </ul>
    </section>
  );
}
