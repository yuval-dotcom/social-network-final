import $ from "jquery";
import { getToken } from "./tokenStorage.js";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api";

export function apiRequest(path, { method = "GET", data, token = getToken() } = {}) {
  return $.ajax({
    url: `${API_BASE_URL}${path}`,
    method,
    contentType: "application/json",
    data: data ? JSON.stringify(data) : undefined,
    headers: token ? { Authorization: `Bearer ${token}` } : {}
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
  listGroups() {
    return apiRequest("/groups");
  },
  searchGroups(params) {
    return apiRequest(`/groups/search?${new URLSearchParams(params)}`);
  },
  createGroup(data) {
    return apiRequest("/groups", { method: "POST", data });
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
  }
};

