export function AuthTopbar({ copy, languageActionLabel, onLanguageChange, children }) {
  return (
    <header className="auth-topbar">
      <strong className="auth-brand">{copy.appName}</strong>
      <div className="topbar-actions">
        {children}
        {onLanguageChange && (
          <button type="button" className="ghost-button" onClick={onLanguageChange}>
            {languageActionLabel}
          </button>
        )}
      </div>
    </header>
  );
}
