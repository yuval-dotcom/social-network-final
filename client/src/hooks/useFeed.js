import { useEffect, useState } from "react";
import { useAppContext } from "../contexts/AppContext.jsx";
import { getApiErrorMessage } from "../api/apiError.js";
import { api } from "../api/http.js";
import { useForm } from "./useForm.js";
import { indexById, splitCommaList } from "../utils/dataHelpers.js";

const defaultComposer = {
  groupId: "group_algorithms",
  content: "",
  tags: "study, exam",
  mediaUrl: ""
};

export function useFeed() {
  const { copy } = useAppContext();

  const composer = useForm(defaultComposer);

  const [posts, setPosts] = useState([]);
  const [groups, setGroups] = useState([]);
  const [usersById, setUsersById] = useState({});
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
        groupId: composer.values.groupId,
        content: composer.values.content,
        tags: splitCommaList(composer.values.tags),
        mediaUrl: composer.values.mediaUrl.trim(),
        mediaType: composer.values.mediaUrl.trim() ? "video" : ""
      });
      setPosts((current) => [result.post, ...current]);
      composer.setValues((current) => ({ ...defaultComposer, groupId: current.groupId }));
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

  return {
    composer,
    posts,
    message,
    isLoading,
    isPosting,
    locale,
    groupOptions,
    loadFeed,
    publishPost,
    userName,
    groupName
  };
}
