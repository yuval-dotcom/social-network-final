import { Avatar } from "../shared/Avatar.jsx";

export function ProfileHeader({ copy, profile }) {
  const displayName = profile.displayName || profile.username || copy.feed.unknownUser;
  const major = profile.major || profile.role || copy.profile.defaultMajor;

  return (
    <section className="profile-hero" aria-label={copy.profile.title}>
      <div className="profile-identity">
        <Avatar name={displayName} />
        <div>
          <p className="eyebrow">{copy.profile.eyebrow}</p>
          <h2>{displayName}</h2>
          <span>@{profile.username || copy.profile.unknownUsername}</span>
        </div>
      </div>
      <p>{copy.profile.subtitle}</p>
      <strong>{major}</strong>
    </section>
  );
}
