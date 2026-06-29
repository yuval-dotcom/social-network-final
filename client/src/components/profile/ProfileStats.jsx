import { useAppContext } from "../../contexts/AppContext.jsx";
export function ProfileStats({ friendsCount, groupsCount, postsCount }) {
  const { copy } = useAppContext();

  const stats = [
    { label: copy.profile.friends, value: friendsCount },
    { label: copy.profile.groups, value: groupsCount },
    { label: copy.profile.posts, value: postsCount }
  ];

  return (
    <dl className="profile-stats">
      {stats.map((stat) => (
        <div key={stat.label}>
          <dt>{stat.label}</dt>
          <dd>{stat.value}</dd>
        </div>
      ))}
    </dl>
  );
}
