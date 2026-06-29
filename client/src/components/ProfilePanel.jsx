import { useAppContext } from "../contexts/AppContext.jsx";
import { useEffect, useState } from "react";
import { api } from "../api/http.js";
import { getApiErrorMessage } from "../api/apiError.js";
import { CardSkeleton } from "./shared";
import {
  ProfileFriends,
  ProfileGroups,
  ProfileHeader,
  ProfileRecentPosts,
  ProfileStats
} from "./profile";

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

export function ProfilePanel() {
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

  return (
    <section className="profile-view" id="profile" aria-label={copy.profile.title}>
      <div className="feed-heading">
        <div>
          <p className="eyebrow">{copy.profile.eyebrow}</p>
          <h2>{copy.profile.title}</h2>
          <p>{copy.profile.body}</p>
        </div>
        <button
          type="button"
          className="secondary-button"
          onClick={loadProfile}
          disabled={isLoading}
        >
          {copy.profile.refresh}
        </button>
      </div>

      {message && <p className="form-message">{message}</p>}
      {isLoading && <CardSkeleton count={2} />}

      {!isLoading && (
        <div className="profile-layout">
          <div className="profile-side">
            <ProfileHeader profile={profile} />
            <ProfileStats
              friendsCount={friends.length}
              groupsCount={groups.length}
              postsCount={posts.length}
            />
          </div>

          <div className="profile-main">
            <ProfileFriends friends={friends} />
            <ProfileGroups groups={groups} />
            <ProfileRecentPosts groupName={groupName} posts={posts} />
          </div>
        </div>
      )}
    </section>
  );
}
