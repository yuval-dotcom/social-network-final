import { useState } from "react";
import { api } from "../api/http.js";
import { saveToken } from "../api/tokenStorage.js";

const emptyForm = {
  username: "",
  password: "",
  displayName: "",
  major: ""
};

export function AuthPanel({ copy, onAuth }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState(emptyForm);
  const [message, setMessage] = useState("");

  function updateField(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  async function submit(event) {
    event.preventDefault();
    setMessage("");

    try {
      if (mode === "register") {
        await api.register(form);
        setMessage(copy.auth.registered);
        setMode("login");
        return;
      }

      const result = await api.login({ username: form.username, password: form.password });
      saveToken(result.token);
      onAuth(result.user);
      setMessage(copy.auth.loggedIn);
    } catch (error) {
      setMessage(error.responseJSON?.message || copy.auth.failed);
    }
  }

  return (
    <section className="panel" id="auth">
      <div className="panel-heading">
        <h2>{copy.auth.title}</h2>
        <div className="segmented-control" aria-label={copy.auth.modeLabel}>
          <button type="button" className={mode === "login" ? "active" : ""} onClick={() => setMode("login")}>
            {copy.actions.login}
          </button>
          <button type="button" className={mode === "register" ? "active" : ""} onClick={() => setMode("register")}>
            {copy.actions.register}
          </button>
        </div>
      </div>

      <form className="form-grid" onSubmit={submit}>
        <label>
          {copy.fields.username}
          <input name="username" value={form.username} onChange={updateField} required />
        </label>
        <label>
          {copy.fields.password}
          <input name="password" type="password" value={form.password} onChange={updateField} required minLength={6} />
        </label>
        {mode === "register" && (
          <>
            <label>
              {copy.fields.displayName}
              <input name="displayName" value={form.displayName} onChange={updateField} required />
            </label>
            <label>
              {copy.fields.major}
              <input name="major" value={form.major} onChange={updateField} />
            </label>
          </>
        )}
        <button type="submit" className="primary-button">
          {mode === "register" ? copy.actions.register : copy.actions.login}
        </button>
      </form>

      {message && <p className="form-message">{message}</p>}
    </section>
  );
}

