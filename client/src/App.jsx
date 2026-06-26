import { useEffect, useState } from "react";
import { AppTopbar } from "./components/app/AppTopbar.jsx";
import { MainNavigation } from "./components/app/MainNavigation.jsx";
import { AuthPanel } from "./components/AuthPanel.jsx";
import { ChatPanel } from "./components/ChatPanel.jsx";
import { FeedPanel } from "./components/FeedPanel.jsx";
import { GroupDiscoveryPanel } from "./components/GroupDiscoveryPanel.jsx";
import { MediaPanel } from "./components/MediaPanel.jsx";
import { ManagementView } from "./components/management/ManagementView.jsx";
import { MyPostsPanel } from "./components/MyPostsPanel.jsx";
import { ProfilePanel } from "./components/ProfilePanel.jsx";
import { StatsPanel } from "./components/StatsPanel.jsx";
import { clearToken, getStoredUser } from "./api/tokenStorage.js";
import { languages } from "./i18n.js";
import "./styles.css";

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
      <AppTopbar copy={copy} currentUser={currentUser} onLanguageChange={switchLanguage} onLogout={logout} />
      <MainNavigation activeView={activeView} copy={copy} onViewChange={setActiveView} />

      {activeView === "feed" && <FeedPanel copy={copy} currentUser={currentUser} />}
      {activeView === "profile" && <ProfilePanel copy={copy} currentUser={currentUser} />}
      {activeView === "myPosts" && <MyPostsPanel copy={copy} />}
      {activeView === "groups" && <GroupDiscoveryPanel copy={copy} currentUser={currentUser} />}

      {activeView === "manage" && <ManagementView copy={copy} />}

      {activeView === "chat" && <ChatPanel copy={copy} currentUser={currentUser} />}
      {activeView === "stats" && <StatsPanel copy={copy} />}
      {activeView === "media" && <MediaPanel copy={copy} />}
    </main>
  );
}
