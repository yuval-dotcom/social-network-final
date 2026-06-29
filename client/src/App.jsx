import { useEffect, useState } from "react";
import { AuthPanel } from "./components/AuthPanel.jsx";
import { ChatPanel } from "./components/ChatPanel.jsx";
import { FeedPanel } from "./components/FeedPanel.jsx";
import { GroupDiscoveryPanel } from "./components/GroupDiscoveryPanel.jsx";
import { MediaPanel } from "./components/MediaPanel.jsx";
import { MyPostsPanel } from "./components/MyPostsPanel.jsx";
import { ProfilePanel } from "./components/ProfilePanel.jsx";
import { StatsPanel } from "./components/StatsPanel.jsx";
import { AppTopbar, MainNavigation } from "./components/app";
import { ManagementView } from "./components/management";
import { ErrorBoundary } from "./components/shared";
import { clearToken, getStoredUser } from "./api/tokenStorage.js";
import { languages } from "./i18n.js";
import "./styles.css";

import { AppProvider } from "./contexts/AppContext.jsx";

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
      <ErrorBoundary
        message={copy.errorBoundary.message}
        retryLabel={copy.errorBoundary.retry}
        title={copy.errorBoundary.title}
      >
        <AppProvider copy={copy} currentUser={null}>
          <AuthPanel
            onAuth={setCurrentUser}
            onLanguageChange={switchLanguage}
            languageActionLabel={copy.actions.switchLanguage}
          />
        </AppProvider>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary
      message={copy.errorBoundary.message}
      retryLabel={copy.errorBoundary.retry}
      title={copy.errorBoundary.title}
    >
      <AppProvider copy={copy} currentUser={currentUser}>
        <main className="app-shell" dir={copy.dir}>
          <AppTopbar onLanguageChange={switchLanguage} onLogout={logout} />
          <MainNavigation activeView={activeView} onViewChange={setActiveView} />

          {activeView === "feed" && <FeedPanel />}
          {activeView === "profile" && <ProfilePanel />}
          {activeView === "myPosts" && <MyPostsPanel />}
          {activeView === "groups" && <GroupDiscoveryPanel />}

          {activeView === "manage" && <ManagementView />}

          {activeView === "chat" && <ChatPanel />}
          {activeView === "stats" && <StatsPanel />}
          {activeView === "media" && <MediaPanel />}
        </main>
      </AppProvider>
    </ErrorBoundary>
  );
}
