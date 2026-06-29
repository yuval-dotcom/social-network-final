import { useState } from "react";
import { api } from "../api/http.js";
import { saveSession } from "../api/tokenStorage.js";
import { useForm } from "../hooks/useForm.js";
import { AuthForm, AuthModeSwitch, AuthStory, AuthTopbar } from "./auth";
import { ThemeToggle } from "./shared";

const initialForm = {
  username: "",
  password: "",
  displayName: "",
  major: ""
};

export function AuthPanel({ copy, onAuth, onLanguageChange, languageActionLabel }) {
  const form = useForm(initialForm);
  const [mode, setMode] = useState("login");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isRegisterMode = mode === "register";

  async function submit(event) {
    event.preventDefault();
    setMessage("");
    setIsSubmitting(true);

    try {
      if (isRegisterMode) {
        await api.register(form.values);
        setMessage(copy.auth.registered);
        setMode("login");
        form.reset();
        return;
      }

      const result = await api.login({ username: form.values.username, password: form.values.password });
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
    <section className="auth-page" dir={copy.dir} id="auth">
      <AuthTopbar copy={copy} languageActionLabel={languageActionLabel} onLanguageChange={onLanguageChange}>
        <ThemeToggle copy={copy} />
      </AuthTopbar>

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
            form={form.values}
            isRegisterMode={isRegisterMode}
            isSubmitting={isSubmitting}
            onChange={form.onChange}
            onSubmit={submit}
          />

          {message && <p className="form-message" role="status">{message}</p>}
        </div>
      </div>
    </section>
  );
}
