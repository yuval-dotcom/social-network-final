const navKeys = ["feed", "profile", "myPosts", "groups", "manage", "chat", "stats", "media"];

export function MainNavigation({ activeView, copy, onViewChange }) {
  return (
    <nav className="main-nav" aria-label="Primary">
      {navKeys.map((key) => (
        <button
          type="button"
          className={activeView === key ? "active" : ""}
          aria-current={activeView === key ? "page" : undefined}
          key={key}
          onClick={() => onViewChange(key)}
        >
          {copy.nav[key]}
        </button>
      ))}
    </nav>
  );
}
