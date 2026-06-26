import { useEffect, useState } from "react";

const STORAGE_KEY = "studycircle_theme";

function getInitialTheme() {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "dark" || stored === "light") return stored;
    return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  } catch {
    return "light";
  }
}

export function ThemeToggle({ copy }) {
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try {
      window.localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      return;
    }
  }, [theme]);

  function toggle() {
    setTheme((current) => (current === "dark" ? "light" : "dark"));
  }

  const label = theme === "dark"
    ? copy?.actions.lightTheme || "Light"
    : copy?.actions.darkTheme || "Dark";

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggle}
      aria-label={label}
      aria-pressed={theme === "dark"}
      title={label}
    >
      <span>{label}</span>
    </button>
  );
}
