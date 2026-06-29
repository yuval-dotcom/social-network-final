import { useAppContext } from "../../contexts/AppContext.jsx";
export function AuthStory() {
  const { copy } = useAppContext();

  return (
    <div className="auth-story" aria-label={copy.authScreen.storyLabel}>
      <p className="eyebrow">{copy.tagline}</p>
      <h1>{copy.appName}</h1>
      <p className="auth-lead">{copy.authScreen.body}</p>
    </div>
  );
}
