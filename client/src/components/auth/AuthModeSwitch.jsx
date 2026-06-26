export function AuthModeSwitch({ copy, isRegisterMode, mode, onModeChange }) {
  return (
    <div className="segmented-control" aria-label={copy.auth.modeLabel}>
      <button type="button" className={mode === "login" ? "active" : ""} onClick={() => onModeChange("login")}>
        {copy.actions.login}
      </button>
      <button type="button" className={isRegisterMode ? "active" : ""} onClick={() => onModeChange("register")}>
        {copy.actions.register}
      </button>
    </div>
  );
}
