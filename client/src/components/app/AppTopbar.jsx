import { ThemeToggle } from "../shared";

export function AppTopbar({ copy, currentUser, onLanguageChange, onLogout }) {
  return (
    <header className="topbar">
      <div>
        <p className="eyebrow">{copy.tagline}</p>
        <h1>{copy.appName}</h1>
      </div>
      <div className="topbar-actions">
        <ThemeToggle copy={copy} />
        <button type="button" className="ghost-button" onClick={onLanguageChange}>
          {copy.actions.switchLanguage}
        </button>
        <span className="session-banner">{currentUser.displayName || currentUser.username}</span>
        <button type="button" className="secondary-button" onClick={onLogout}>{copy.actions.logout}</button>
      </div>
    </header>
  );
}
