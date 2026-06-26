import { useState } from "react";
import { api } from "../api/http.js";
import { saveSession } from "../api/tokenStorage.js";
import { AuthForm } from "./auth/AuthForm.jsx";
import { AuthModeSwitch } from "./auth/AuthModeSwitch.jsx";
import { AuthStory } from "./auth/AuthStory.jsx";
import { AuthTopbar } from "./auth/AuthTopbar.jsx";

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
      <AuthTopbar copy={copy} languageActionLabel={languageActionLabel} onLanguageChange={onLanguageChange} />

      <div className="auth-shell">
        <AuthStory copy={copy} />

        <div className="auth-card">
          <div className="auth-card-heading">
            <p className="eyebrow">{isRegisterMode ? copy.actions.register : copy.actions.login}</p>
            <h2>{isRegisterMode ? copy.authScreen.registerTitle : copy.auth.title}</h2>
            <p>{isRegisterMode ? copy.authScreen.registerBody : copy.authScreen.loginBody}</p>
          </div>

          <AuthModeSwitch copy={copy} isRegisterMode={isRegisterMode} mode={mode} onModeChange={setMode} />

          <AuthForm
            copy={copy}
            form={form}
            isRegisterMode={isRegisterMode}
            isSubmitting={isSubmitting}
            onChange={updateField}
            onSubmit={submit}
          />

          {message && <p className="form-message" role="status">{message}</p>}
        </div>
      </div>
    </section>
  );
}
