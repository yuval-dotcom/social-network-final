import { useState } from "react";
import { api } from "../api/http.js";
import { saveSession } from "../api/tokenStorage.js";

const emptyForm = {
  username: "",
  password: "",
  displayName: "",
  major: ""
};

export function AuthPanel({ copy, onAuth, onLanguageChange, languageActionLabel }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState(emptyForm);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isRegisterMode = mode === "register";

  function updateField(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  async function submit(event) {
    event.preventDefault();
    setMessage("");
    setIsSubmitting(true);

    try {
      if (isRegisterMode) {
        await api.register(form);
        setMessage(copy.auth.registered);
        setMode("login");
        return;
      }

      const result = await api.login({ username: form.username, password: form.password });
      saveSession(result.token, result.user);
      onAuth(result.user);
      setMessage(copy.auth.loggedIn);
    } catch (error) {
      setMessage(error.responseJSON?.message || copy.auth.failed);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="auth-page" id="auth">
      <header className="auth-topbar">
        <strong className="auth-brand">{copy.appName}</strong>
        {onLanguageChange && (
          <button type="button" className="ghost-button" onClick={onLanguageChange}>
            {languageActionLabel}
          </button>
        )}
      </header>

      <div className="auth-shell">
        <div className="auth-story" aria-label={copy.authScreen.previewLabel}>
          <p className="eyebrow">{copy.tagline}</p>
          <h1>{copy.authScreen.headline}</h1>
          <p className="auth-lead">{copy.authScreen.body}</p>

          <div className="auth-preview">
            <div className="feed-preview-card featured">
              <span>{copy.authScreen.featuredGroup}</span>
              <strong>{copy.authScreen.featuredPost}</strong>
              <p>{copy.authScreen.featuredMeta}</p>
            </div>
            <div className="auth-metrics" aria-label={copy.authScreen.metricsLabel}>
              {copy.authScreen.metrics.map((metric) => (
                <div key={metric.label}>
                  <strong>{metric.value}</strong>
                  <span>{metric.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="auth-card">
          <div className="auth-card-heading">
            <p className="eyebrow">{isRegisterMode ? copy.actions.register : copy.actions.login}</p>
            <h2>{isRegisterMode ? copy.authScreen.registerTitle : copy.auth.title}</h2>
            <p>{isRegisterMode ? copy.authScreen.registerBody : copy.authScreen.loginBody}</p>
          </div>

          <div className="segmented-control" aria-label={copy.auth.modeLabel}>
            <button type="button" className={mode === "login" ? "active" : ""} onClick={() => setMode("login")}>
              {copy.actions.login}
            </button>
            <button type="button" className={isRegisterMode ? "active" : ""} onClick={() => setMode("register")}>
              {copy.actions.register}
            </button>
          </div>

          <form className="auth-form" onSubmit={submit}>
            <label>
              {copy.fields.username}
              <input name="username" value={form.username} onChange={updateField} autoComplete="username" required />
            </label>
            <label>
              {copy.fields.password}
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={updateField}
                autoComplete={isRegisterMode ? "new-password" : "current-password"}
                required
                minLength={6}
              />
            </label>
            {isRegisterMode && (
              <>
                <label>
                  {copy.fields.displayName}
                  <input name="displayName" value={form.displayName} onChange={updateField} autoComplete="name" required />
                </label>
                <label>
                  {copy.fields.major}
                  <input name="major" value={form.major} onChange={updateField} autoComplete="organization-title" />
                </label>
              </>
            )}
            <button type="submit" className="primary-button auth-submit" disabled={isSubmitting}>
              {isSubmitting ? copy.auth.working : isRegisterMode ? copy.auth.registerSubmit : copy.auth.loginSubmit}
            </button>
          </form>

          <p className="auth-demo">{copy.authScreen.demoAccount}</p>
          {message && <p className="form-message" role="status">{message}</p>}
        </div>
      </div>
    </section>
  );
}
