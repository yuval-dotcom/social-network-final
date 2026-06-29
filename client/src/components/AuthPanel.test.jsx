import { fireEvent, render, screen, waitFor } from "../test-utils.jsx";
import { describe, expect, it, vi } from "vitest";
import { api } from "../api/http.js";
import { languages } from "../i18n.js";
import { AuthPanel } from "./AuthPanel.jsx";

vi.mock("../api/http.js", () => ({
  api: {
    login: vi.fn(),
    register: vi.fn()
  }
}));

describe("AuthPanel", () => {
  it("keeps the public auth page focused on login and register", () => {
    render(<AuthPanel copy={languages.he} onAuth={() => {}} />);

    expect(screen.getByRole("heading", { name: "StudyCircle" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "התחברות" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "הרשמה" })).toBeInTheDocument();
    expect(screen.queryByText("מודלים", { exact: false })).not.toBeInTheDocument();
    expect(screen.queryByText("חיפושים מתקדמים", { exact: false })).not.toBeInTheDocument();
    expect(screen.queryByText("דמו להגנה", { exact: false })).not.toBeInTheDocument();
  });

  it("submits login through the Ajax API layer", async () => {
    api.login.mockResolvedValue({ token: "token", user: { username: "dana" } });
    const onAuth = vi.fn();

    render(<AuthPanel copy={languages.he} onAuth={onAuth} />);

    fireEvent.change(screen.getByLabelText("שם משתמש"), { target: { value: "dana" } });
    fireEvent.change(screen.getByLabelText("סיסמה"), { target: { value: "secret123" } });
    fireEvent.click(screen.getByRole("button", { name: "כניסה ל-StudyCircle" }));

    await waitFor(() =>
      expect(api.login).toHaveBeenCalledWith({ username: "dana", password: "secret123" })
    );
    expect(onAuth).toHaveBeenCalledWith({ username: "dana" });
  });

  it("switches to register mode", () => {
    render(<AuthPanel copy={languages.he} onAuth={() => {}} />);

    fireEvent.click(screen.getByRole("button", { name: "הרשמה" }));

    expect(screen.getByLabelText("שם מלא")).toBeInTheDocument();
  });
});
