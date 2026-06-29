import { useAppContext } from "../contexts/AppContext.jsx";
import { CardSkeleton } from "./shared";
import {
  ProfileFriends,
  ProfileGroups,
  ProfileHeader,
  ProfileRecentPosts,
  ProfileStats
} from "./profile";
import { useProfile } from "../hooks/useProfile.js";

export function ProfilePanel() {
  const { copy } = useAppContext();
  const {
    profile,
    friends,
    groups,
    posts,
    message,
    isLoading,
    loadProfile,
    groupName
  } = useProfile();

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
