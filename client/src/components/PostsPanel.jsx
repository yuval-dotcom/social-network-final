import { useState } from "react";
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

  async function createPost(event) {
    event.preventDefault();
    const result = await api.createPost(payload());
    setPosts((current) => [result.post, ...current]);
    setMessage(copy.crud.created);
  }

  async function searchPosts(event) {
    event.preventDefault();
    const result = await api.searchPosts(search);
    setPosts(result.posts || []);
  }

  async function updatePost() {
    await api.updatePost(post.id, payload());
    setMessage(copy.crud.updated);
  }

  async function deletePost() {
    await api.deletePost(post.id);
    setMessage(copy.crud.deleted);
  }

  async function loadFeed() {
    setPosts((await api.feed()).posts || []);
  }

  async function loadMine() {
    setPosts((await api.myPosts()).posts || []);
  }

  return (
    <section className="panel" id="posts">
      <div className="panel-heading">
        <h2>{copy.crud.postsTitle}</h2>
        <div className="topbar-actions">
          <button type="button" onClick={async () => setPosts((await api.listPosts()).posts || [])}>{copy.crud.list}</button>
          <button type="button" onClick={loadFeed}>{copy.crud.feed}</button>
          <button type="button" onClick={loadMine}>{copy.crud.myPosts}</button>
        </div>
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
      <form className="form-grid" onSubmit={searchPosts}>
        <label>{copy.crud.keyword}<input name="q" value={search.q} onChange={updateSearchField} /></label>
        <label>{copy.crud.groupId}<input name="groupId" value={search.groupId} onChange={updateSearchField} /></label>
        <label>{copy.crud.authorId}<input name="authorId" value={search.authorId} onChange={updateSearchField} /></label>
        <label>{copy.crud.tag}<input name="tag" value={search.tag} onChange={updateSearchField} /></label>
        <label>{copy.crud.from}<input name="from" type="date" value={search.from} onChange={updateSearchField} /></label>
        <label>{copy.crud.to}<input name="to" type="date" value={search.to} onChange={updateSearchField} /></label>
        <button type="submit" className="secondary-button">{copy.crud.search}</button>
      </form>
      {message && <p className="form-message">{message}</p>}
      <ul className="result-list" aria-label={copy.crud.postsTitle}>
        {posts.map((item) => <li key={item.id}>{item.content}</li>)}
      </ul>
    </section>
  );
}

