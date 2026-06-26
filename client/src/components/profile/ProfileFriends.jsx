import { Avatar } from "../shared/Avatar.jsx";

export function ProfileFriends({ copy, friends }) {
  return (
    <section className="profile-card" aria-labelledby="profile-friends-title">
      <h3 id="profile-friends-title">{copy.profile.friendList}</h3>
      {friends.length === 0 && <p className="profile-empty">{copy.profile.noFriends}</p>}
      <ul className="profile-list">
        {friends.map((friend) => (
          <li className="profile-list-item" key={friend.id || friend.username}>
            <Avatar name={friend.displayName || friend.username} />
            <div>
              <strong>{friend.displayName || friend.username}</strong>
              <span>{friend.major || friend.role || copy.profile.defaultMajor}</span>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
