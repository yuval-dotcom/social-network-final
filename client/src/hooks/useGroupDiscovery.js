import { useEffect, useState } from "react";
import { useAppContext } from "../contexts/AppContext.jsx";
import { getApiErrorMessage } from "../api/apiError.js";
import { api } from "../api/http.js";
import { useForm } from "./useForm.js";

const defaultFilters = { q: "", category: "", privacy: "" };

function isMember(group, userId) {
  return Boolean(userId && group.memberIds?.includes(userId));
}

function isPending(group, userId) {
  return Boolean(userId && group.pendingMemberIds?.includes(userId));
}

export function useGroupDiscovery() {
  const { copy, currentUser } = useAppContext();

  const filters = useForm(defaultFilters);

  const [groups, setGroups] = useState([]);
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedGroupId, setSelectedGroupId] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const userId = currentUser?.id || currentUser?.sub || "";

  const selectedGroup = groups.find((group) => group.id === selectedGroupId) || groups[0];
  const categories = Array.from(
    new Set(groups.map((group) => group.category).filter(Boolean))
  ).sort();
  const stats = {
    total: groups.length,
    publicCount: groups.filter((group) => group.privacy === "public").length,
    myGroups: groups.filter((group) => isMember(group, userId)).length
  };

  async function loadGroups() {
    setIsLoading(true);
    setMessage("");
    try {
      const [groupsResult, usersResult, postsResult] = await Promise.all([
        api.listGroups(),
        api.listUsers(),
        api.listPosts()
      ]);
      setGroups(groupsResult.groups || []);
      setUsers(usersResult.users || []);
      setPosts(postsResult.posts || []);
    } catch (error) {
      setMessage(getApiErrorMessage(error, copy.crud.failed));
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadGroups();
  }, []);

  async function searchGroups(event) {
    event.preventDefault();
    setIsLoading(true);
    setMessage("");
    try {
      const result = await api.searchGroups(filters.values);
      setGroups(result.groups || []);
    } catch (error) {
      setMessage(getApiErrorMessage(error, copy.crud.failed));
    } finally {
      setIsLoading(false);
    }
  }

  async function joinGroup(groupId) {
    setMessage("");
    try {
      const result = await api.joinGroup(groupId);
      setGroups((current) => current.map((group) => (group.id === groupId ? result.group : group)));
      setSelectedGroupId(groupId);
      setMessage(copy.groups.joinStatus[result.status] || copy.groups.joinStatus.joined);
    } catch (error) {
      setMessage(getApiErrorMessage(error, copy.crud.failed));
    }
  }

  async function approveMember(groupId, userIdToApprove) {
    setMessage("");
    try {
      const result = await api.approveGroupMember(groupId, userIdToApprove);
      setGroups((current) => current.map((group) => (group.id === groupId ? result.group : group)));
      setSelectedGroupId(groupId);
      setMessage(copy.groups.approvedRequest);
    } catch (error) {
      setMessage(getApiErrorMessage(error, copy.crud.failed));
    }
  }

  function groupStatus(group) {
    if (isMember(group, userId)) return copy.groups.memberBadge;
    if (isPending(group, userId)) return copy.groups.pendingBadge;
    return group.privacy === "private" ? copy.groups.privateBadge : copy.groups.openBadge;
  }

  function canJoin(group) {
    return !isMember(group, userId) && !isPending(group, userId);
  }

  return {
    filters,
    groups,
    posts,
    users,
    selectedGroup,
    categories,
    stats,
    message,
    isLoading,
    loadGroups,
    searchGroups,
    joinGroup,
    approveMember,
    groupStatus,
    canJoin,
    setSelectedGroupId
  };
}
