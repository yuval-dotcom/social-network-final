import { useAppContext } from "../../contexts/AppContext.jsx";
export function ProfileGroups({ groups }) {
  const { copy } = useAppContext();

  return (
    <section className="profile-card" aria-labelledby="profile-groups-title">
      <h3 id="profile-groups-title">{copy.profile.studyGroups}</h3>
      {groups.length === 0 && <p className="profile-empty">{copy.profile.noGroups}</p>}
      <ul className="profile-list">
        {groups.map((group) => (
          <li className="profile-list-item" key={group.id}>
            <div>
              <strong>{group.name || group.id}</strong>
              <span>{group.category || copy.feed.groupFallback}</span>
            </div>
            <em>
              {group.privacy === "private" ? copy.profile.privateGroup : copy.profile.publicGroup}
            </em>
          </li>
        ))}
      </ul>
    </section>
  );
}
