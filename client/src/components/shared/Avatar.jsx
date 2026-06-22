export function Avatar({ name = "S" }) {
  return (
    <span className="avatar" aria-hidden="true">
      {name.slice(0, 1).toUpperCase()}
    </span>
  );
}
