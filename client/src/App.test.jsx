import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { api } from "./api/http.js";
import App from "./App.jsx";

vi.mock("./api/http.js", () => ({
  api: {
    login: vi.fn(),
    register: vi.fn(),
    feed: vi.fn(),
    listGroups: vi.fn(),
    listUsers: vi.fn(),
    createPost: vi.fn(),
    searchGroups: vi.fn(),
    joinGroup: vi.fn()
  }
}));

describe("React shell", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    api.feed.mockResolvedValue({ posts: [] });
    api.listGroups.mockResolvedValue({ groups: [] });
    api.listUsers.mockResolvedValue({ users: [] });
  });

  it("renders a standalone auth screen before login", () => {
    render(<App />);

    expect(screen.getByRole("heading", { name: "ללמוד יחד מרגיש קל יותר" })).toBeInTheDocument();
    expect(screen.queryByRole("navigation", { name: "Primary" })).not.toBeInTheDocument();
    expect(document.documentElement.dir).toBe("rtl");
  });

  it("switches between Hebrew and English", () => {
    render(<App />);

    fireEvent.click(screen.getByRole("button", { name: "English" }));

    expect(screen.getByRole("heading", { name: "Studying together feels lighter" })).toBeInTheDocument();
    expect(document.documentElement.dir).toBe("ltr");
  });

  it("opens the social feed after login", async () => {
    api.login.mockResolvedValue({
      token: "token",
      user: { username: "dana", displayName: "Dana Levi" }
    });
    render(<App />);

    fireEvent.change(screen.getByLabelText("שם משתמש"), { target: { value: "dana" } });
    fireEvent.change(screen.getByLabelText("סיסמה"), { target: { value: "demo123" } });
    fireEvent.click(screen.getByRole("button", { name: "כניסה ל-StudyCircle" }));

    expect(await screen.findByRole("navigation", { name: "Primary" })).toBeInTheDocument();
    expect(await screen.findByRole("heading", { name: "הפיד שלך" })).toBeInTheDocument();
    expect(screen.getByText("Dana Levi")).toBeInTheDocument();
  });

  it("restores the feed from a stored user session", async () => {
    localStorage.setItem("studycircle_user", JSON.stringify({ username: "dana", displayName: "Dana Levi" }));

    render(<App />);

    expect(screen.getByRole("navigation", { name: "Primary" })).toBeInTheDocument();
    expect(await screen.findByRole("heading", { name: "הפיד שלך" })).toBeInTheDocument();
    expect(screen.getByText("Dana Levi")).toBeInTheDocument();
  });

  it("keeps CRUD panels inside the management screen", async () => {
    localStorage.setItem("studycircle_user", JSON.stringify({ username: "dana", displayName: "Dana Levi" }));

    render(<App />);

    expect(await screen.findByRole("heading", { name: "הפיד שלך" })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "ניהול משתמשים" })).not.toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "ניהול קבוצות" })).not.toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "ניהול פוסטים" })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "ניהול" }));

    expect(screen.getByRole("heading", { name: "ניהול המערכת" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "ניהול משתמשים" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "ניהול קבוצות" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "ניהול פוסטים" })).toBeInTheDocument();
  });

  it("opens a user-facing groups screen separate from CRUD", async () => {
    api.listGroups.mockResolvedValue({
      groups: [{
        id: "group_algorithms",
        name: "Algorithms Study Lab",
        description: "Exam prep",
        category: "Computer Science",
        privacy: "public",
        memberIds: [],
        pendingMemberIds: []
      }]
    });
    localStorage.setItem("studycircle_user", JSON.stringify({ id: "user_dana", username: "dana", displayName: "Dana Levi" }));

    render(<App />);

    fireEvent.click(screen.getByRole("button", { name: "קבוצות" }));

    expect(await screen.findByRole("heading", { name: "גילוי קבוצות" })).toBeInTheDocument();
    expect(await screen.findByRole("heading", { name: "Algorithms Study Lab" })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "ניהול קבוצות" })).not.toBeInTheDocument();
  });
});
