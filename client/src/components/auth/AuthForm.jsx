export function AuthForm({ copy, form, isRegisterMode, isSubmitting, onChange, onSubmit }) {
  const submitLabel = isRegisterMode ? copy.auth.registerSubmit : copy.auth.loginSubmit;

  return (
    <form className="auth-form" onSubmit={onSubmit}>
      <label>
        {copy.fields.username}
        <input name="username" value={form.username} onChange={onChange} autoComplete="username" required />
      </label>
      <label>
        {copy.fields.password}
        <input
          name="password"
          type="password"
          value={form.password}
          onChange={onChange}
          autoComplete={isRegisterMode ? "new-password" : "current-password"}
          required
          minLength={6}
        />
      </label>
      {isRegisterMode && (
        <>
          <label>
            {copy.fields.displayName}
            <input name="displayName" value={form.displayName} onChange={onChange} autoComplete="name" required />
          </label>
          <label>
            {copy.fields.major}
            <input name="major" value={form.major} onChange={onChange} autoComplete="organization-title" />
          </label>
        </>
      )}
      <button type="submit" className="primary-button auth-submit" disabled={isSubmitting}>
        {isSubmitting ? copy.auth.working : submitLabel}
      </button>
    </form>
  );
}
