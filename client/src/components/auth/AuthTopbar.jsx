import { useAppContext } from "../../contexts/AppContext.jsx";
export function AuthTopbar({ languageActionLabel, onLanguageChange, children }) {
  const { copy } = useAppContext();

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
