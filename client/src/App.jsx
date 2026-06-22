import { useEffect, useState } from "react";
import { AuthPanel } from "./components/AuthPanel.jsx";
import { ChatPanel } from "./components/ChatPanel.jsx";
import { FeedPanel } from "./components/FeedPanel.jsx";
import { GroupDiscoveryPanel } from "./components/GroupDiscoveryPanel.jsx";
import { GroupsPanel } from "./components/GroupsPanel.jsx";
import { MediaPanel } from "./components/MediaPanel.jsx";
import { MyPostsPanel } from "./components/MyPostsPanel.jsx";
import { PostsPanel } from "./components/PostsPanel.jsx";
import { StatsPanel } from "./components/StatsPanel.jsx";
import { UsersPanel } from "./components/UsersPanel.jsx";
import { clearToken, getStoredUser } from "./api/tokenStorage.js";
import { languages } from "./i18n.js";
import "./styles.css";

const navKeys = ["feed", "myPosts", "groups", "manage", "chat", "stats", "media"];

export default function App() {
  const [language, setLanguage] = useState("he");
  const [currentUser, setCurrentUser] = useState(() => getStoredUser());
  const [activeView, setActiveView] = useState("feed");
  const copy = languages[language];
  const nextLanguage = language === "he" ? "en" : "he";

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = copy.dir;
  }, [copy.dir, language]);

  function switchLanguage() {
    setLanguage(nextLanguage);
  }

  function logout() {
    clearToken();
    setCurrentUser(null);
  }

  if (!currentUser) {
    return (
      <AuthPanel
        copy={copy}
        languageActionLabel={copy.actions.switchLanguage}
        onAuth={setCurrentUser}
        onLanguageChange={switchLanguage}
      />
    );
  }

  return (
    <main className="app-shell" dir={copy.dir}>
      <header className="topbar">
        <div>
          <p className="eyebrow">{copy.tagline}</p>
          <h1>{copy.appName}</h1>
        </div>
        <div className="topbar-actions">
          <button type="button" className="ghost-button" onClick={switchLanguage}>
            {copy.actions.switchLanguage}
          </button>
          <span className="session-banner">{currentUser.displayName || currentUser.username}</span>
          <button type="button" className="secondary-button" onClick={logout}>{copy.actions.logout}</button>
        </div>
      </header>

      <nav className="main-nav" aria-label="Primary">
        {navKeys.map((key) => (
          <button
            type="button"
            className={activeView === key ? "active" : ""}
            aria-current={activeView === key ? "page" : undefined}
            key={key}
            onClick={() => setActiveView(key)}
          >
            {copy.nav[key]}
          </button>
        ))}
      </nav>

      {activeView === "feed" && <FeedPanel copy={copy} currentUser={currentUser} />}
      {activeView === "myPosts" && <MyPostsPanel copy={copy} />}
      {activeView === "groups" && <GroupDiscoveryPanel copy={copy} currentUser={currentUser} />}

      {activeView === "manage" && (
        <section className="management-view" id="manage">
          <div className="management-intro">
            <div>
              <p className="eyebrow">{copy.management.eyebrow}</p>
              <h2>{copy.management.title}</h2>
              <p>{copy.management.body}</p>
            </div>
            <div className="status-panel" aria-label="Project status">
              <span>API</span>
              <strong>Node + Express</strong>
              <span>DB</span>
              <strong>MongoDB Atlas</strong>
              <span>Client</span>
              <strong>React + jQuery Ajax</strong>
            </div>
          </div>
          <UsersPanel copy={copy} />
          <GroupsPanel copy={copy} />
          <PostsPanel copy={copy} />
        </section>
      )}

      {activeView === "chat" && <ChatPanel copy={copy} />}
      {activeView === "stats" && <StatsPanel copy={copy} />}
      {activeView === "media" && <MediaPanel copy={copy} />}
    </main>
  );
}
