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
    joinGroup: vi.fn(),
    myPosts: vi.fn(),
    updatePost: vi.fn(),
    deletePost: vi.fn()
  }
}));

describe("React shell", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    api.feed.mockResolvedValue({ posts: [] });
    api.listGroups.mockResolvedValue({ groups: [] });
    api.listUsers.mockResolvedValue({ users: [] });
    api.myPosts.mockResolvedValue({ posts: [] });
  });

  it("renders a standalone auth screen before login", () => {
    render(<App />);

    expect(screen.getByRole("heading", { name: "StudyCircle" })).toBeInTheDocument();
    expect(screen.getByText("הזן שם משתמש וסיסמה כדי להמשיך לפיד האישי שלך.")).toBeInTheDocument();
    expect(screen.queryByText("מודלים", { exact: false })).not.toBeInTheDocument();
    expect(screen.queryByText("חיפושים מתקדמים", { exact: false })).not.toBeInTheDocument();
    expect(screen.queryByRole("navigation", { name: "Primary" })).not.toBeInTheDocument();
    expect(document.documentElement.dir).toBe("rtl");
  });

  it("switches between Hebrew and English", () => {
    render(<App />);

    fireEvent.click(screen.getByRole("button", { name: "English" }));

    expect(screen.getByText("Enter your username and password to continue to your personal feed.")).toBeInTheDocument();
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
    expect(screen.getAllByText("Dana Levi").length).toBeGreaterThan(0);
  });

  it("restores the feed from a stored user session", async () => {
    localStorage.setItem("studycircle_user", JSON.stringify({ username: "dana", displayName: "Dana Levi" }));

    render(<App />);

    expect(screen.getByRole("navigation", { name: "Primary" })).toBeInTheDocument();
    expect(await screen.findByRole("heading", { name: "הפיד שלך" })).toBeInTheDocument();
    expect(screen.getAllByText("Dana Levi").length).toBeGreaterThan(0);
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
    expect(screen.getByRole("heading", { name: "שלושת המודלים באפליקציה" })).toBeInTheDocument();
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

  it("opens a personal posts screen separate from CRUD", async () => {
    api.myPosts.mockResolvedValue({
      posts: [{
        id: "post_algorithms_1",
        groupId: "group_algorithms",
        content: "I uploaded a short summary for graph algorithms.",
        tags: ["exam"],
        createdAt: "2026-06-01T09:00:00.000Z"
      }]
    });
    api.listGroups.mockResolvedValue({
      groups: [{ id: "group_algorithms", name: "Algorithms Study Lab" }]
    });
    localStorage.setItem("studycircle_user", JSON.stringify({ id: "user_dana", username: "dana", displayName: "Dana Levi" }));

    render(<App />);

    fireEvent.click(screen.getByRole("button", { name: "הפוסטים שלי" }));

    expect(await screen.findByRole("heading", { name: "הפוסטים שלי" })).toBeInTheDocument();
    expect(await screen.findByText("I uploaded a short summary for graph algorithms.")).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "ניהול פוסטים" })).not.toBeInTheDocument();
  });
});
