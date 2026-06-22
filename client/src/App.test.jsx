import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { api } from "./api/http.js";
import App from "./App.jsx";

vi.mock("./api/http.js", () => ({
  api: {
    login: vi.fn(),
    register: vi.fn()
  }
}));

describe("React shell", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
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

  it("opens the dashboard after login", async () => {
    api.login.mockResolvedValue({
      token: "token",
      user: { username: "dana", displayName: "Dana Levi" }
    });
    render(<App />);

    fireEvent.change(screen.getByLabelText("שם משתמש"), { target: { value: "dana" } });
    fireEvent.change(screen.getByLabelText("סיסמה"), { target: { value: "demo123" } });
    fireEvent.click(screen.getByRole("button", { name: "כניסה ל-StudyCircle" }));

    expect(await screen.findByRole("navigation", { name: "Primary" })).toBeInTheDocument();
    expect(screen.getByText("Dana Levi")).toBeInTheDocument();
  });

  it("restores the dashboard from a stored user session", () => {
    localStorage.setItem("studycircle_user", JSON.stringify({ username: "dana", displayName: "Dana Levi" }));

    render(<App />);

    expect(screen.getByRole("navigation", { name: "Primary" })).toBeInTheDocument();
    expect(screen.getByText("Dana Levi")).toBeInTheDocument();
  });
});
