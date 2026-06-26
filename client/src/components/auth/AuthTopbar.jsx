export function AuthTopbar({ copy, languageActionLabel, onLanguageChange }) {
  return (
    <header className="auth-topbar">
      <strong className="auth-brand">{copy.appName}</strong>
      {onLanguageChange && (
        <button type="button" className="ghost-button" onClick={onLanguageChange}>
          {languageActionLabel}
        </button>
      )}
    </header>
  );
}
