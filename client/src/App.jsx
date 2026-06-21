import { useEffect, useState } from "react";
import { AuthPanel } from "./components/AuthPanel.jsx";
import { languages } from "./i18n.js";
import "./styles.css";

const navKeys = ["feed", "groups", "posts", "users", "chat", "stats"];

export default function App() {
  const [language, setLanguage] = useState("he");
  const [currentUser, setCurrentUser] = useState(null);
  const copy = languages[language];
  const nextLanguage = language === "he" ? "en" : "he";

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = copy.dir;
  }, [copy.dir, language]);

  return (
    <main className="app-shell" dir={copy.dir}>
      <header className="topbar">
        <div>
          <p className="eyebrow">{copy.tagline}</p>
          <h1>{copy.appName}</h1>
        </div>
        <div className="topbar-actions">
          <button type="button" className="ghost-button" onClick={() => setLanguage(nextLanguage)}>
            {copy.actions.switchLanguage}
          </button>
          <button type="button" className="secondary-button">{copy.actions.login}</button>
          <button type="button" className="primary-button">{copy.actions.register}</button>
        </div>
      </header>

      <nav className="main-nav" aria-label="Primary">
        {navKeys.map((key) => (
          <a href={`#${key}`} key={key}>
            {copy.nav[key]}
          </a>
        ))}
      </nav>

      <section className="dashboard-intro" id="feed">
        <div>
          <h2>{copy.hero.title}</h2>
          <p>{copy.hero.body}</p>
        </div>
        <div className="status-panel" aria-label="Project status">
          <span>API</span>
          <strong>Node + Express</strong>
          <span>DB</span>
          <strong>MongoDB Atlas</strong>
          <span>Client</span>
          <strong>React + jQuery Ajax</strong>
        </div>
      </section>

      <AuthPanel copy={copy} onAuth={setCurrentUser} />
      {currentUser && <p className="session-banner">{currentUser.displayName || currentUser.username}</p>}
    </main>
  );
}
