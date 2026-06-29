import { useAppContext } from "../../contexts/AppContext.jsx";
export function AuthModeSwitch({ isRegisterMode, mode, onModeChange }) {
  const { copy } = useAppContext();

  return (
    <div className="segmented-control" aria-label={copy.auth.modeLabel}>
      <button
        type="button"
        className={mode === "login" ? "active" : ""}
        onClick={() => onModeChange("login")}
      >
        {copy.actions.login}
      </button>
      <button
        type="button"
        className={isRegisterMode ? "active" : ""}
        onClick={() => onModeChange("register")}
      >
        {copy.actions.register}
      </button>
    </div>
  );
}
