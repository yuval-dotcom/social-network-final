import { useEffect, useState } from "react";
import { useAppContext } from "../contexts/AppContext.jsx";
import { api } from "../api/http.js";
import { getApiErrorMessage } from "../api/apiError.js";

function userId(user) {
  return user?.id || user?._id || user?.sub || "";
}

function findProfile(users, currentUser) {
  const currentId = userId(currentUser);
  return (
    users.find((user) => userId(user) === currentId || user.username === currentUser?.username) ||
    currentUser
  );
}

function findFriends(users, profile) {
  const friendIds = profile?.friendIds || [];
  return users.filter((user) => friendIds.includes(userId(user)));
}

function findGroups(groups, profile) {
  const profileId = userId(profile);
  const groupIds = profile?.groupIds || [];
  return groups.filter(
    (group) => groupIds.includes(group.id) || group.memberIds?.includes(profileId)
  );
}

export function useProfile() {
  const { copy, currentUser } = useAppContext();

  const [profile, setProfile] = useState(currentUser || {});
  const [friends, setFriends] = useState([]);
  const [groups, setGroups] = useState([]);
  const [posts, setPosts] = useState([]);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  async function loadProfile() {
    setIsLoading(true);
    setMessage("");
    try {
      const [usersResult, groupsResult, postsResult] = await Promise.all([
        api.listUsers(),
        api.listGroups(),
        api.myPosts()
      ]);
      const users = usersResult.users || [];
      const loadedGroups = groupsResult.groups || [];
      const loadedPosts = postsResult.posts || [];
      const loadedProfile = findProfile(users, currentUser || {});

      setProfile(loadedProfile || {});
      setFriends(findFriends(users, loadedProfile));
      setGroups(findGroups(loadedGroups, loadedProfile));
      setPosts(loadedPosts);
    } catch (error) {
      setMessage(getApiErrorMessage(error, copy.profile.failed));
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadProfile();
  }, []);

  function groupName(groupId) {
    const group = groups.find((item) => item.id === groupId);
    return group?.name || groupId || copy.profile.unknownGroup;
  }

  return {
    profile,
    friends,
    groups,
    posts,
    message,
    isLoading,
    loadProfile,
    groupName
  };
}
