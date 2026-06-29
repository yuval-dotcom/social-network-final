import $ from "jquery";
import { getToken } from "./tokenStorage.js";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api";

export function apiRequest(path, { method = "GET", data, token = getToken() } = {}) {
  const headers = {};
  if (token) headers.Authorization = `Bearer ${token}`;

  return $.ajax({
    url: `${API_BASE_URL}${path}`,
    method,
    headers,
    contentType: "application/json",
    dataType: "json",
    data: data ? JSON.stringify(data) : undefined
  });
}

export const api = {
  register(data) {
    return apiRequest("/auth/register", { method: "POST", data, token: "" });
  },
  login(data) {
    return apiRequest("/auth/login", { method: "POST", data, token: "" });
  },
  listUsers() {
    return apiRequest("/users");
  },
  searchUsers(params) {
    return apiRequest(`/users/search?${new URLSearchParams(params)}`);
  },
  updateUser(id, data) {
    return apiRequest(`/users/${id}`, { method: "PATCH", data });
  },
  deleteUser(id) {
    return apiRequest(`/users/${id}`, { method: "DELETE" });
  },
  listGroups() {
    return apiRequest("/groups");
  },
  searchGroups(params) {
    return apiRequest(`/groups/search?${new URLSearchParams(params)}`);
  },
  createGroup(data) {
    return apiRequest("/groups", { method: "POST", data });
  },
  updateGroup(id, data) {
    return apiRequest(`/groups/${id}`, { method: "PATCH", data });
  },
  deleteGroup(id) {
    return apiRequest(`/groups/${id}`, { method: "DELETE" });
  },
  joinGroup(id) {
    return apiRequest(`/groups/${id}/join`, { method: "POST" });
  },
  approveGroupMember(id, userId) {
    return apiRequest(`/groups/${id}/approve`, { method: "POST", data: { userId } });
  },
  listPosts() {
    return apiRequest("/posts");
  },
  feed() {
    return apiRequest("/posts/feed");
  },
  myPosts() {
    return apiRequest("/posts/mine");
  },
  searchPosts(params) {
    return apiRequest(`/posts/search?${new URLSearchParams(params)}`);
  },
  createPost(data) {
    return apiRequest("/posts", { method: "POST", data });
  },
  updatePost(id, data) {
    return apiRequest(`/posts/${id}`, { method: "PATCH", data });
  },
  deletePost(id) {
    return apiRequest(`/posts/${id}`, { method: "DELETE" });
  },
  postsByMonth() {
    return apiRequest("/stats/posts-by-month");
  },
  postsByGroup() {
    return apiRequest("/stats/posts-by-group");
  }
};
