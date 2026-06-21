import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import App from "./App.jsx";

describe("React shell", () => {
  it("renders the StudyCircle dashboard shell", () => {
    render(<App />);

    expect(screen.getByRole("heading", { name: "StudyCircle" })).toBeInTheDocument();
    expect(screen.getByText("פיד")).toBeInTheDocument();
    expect(document.documentElement.dir).toBe("rtl");
  });

  it("switches between Hebrew and English", () => {
    render(<App />);

    fireEvent.click(screen.getByRole("button", { name: "English" }));

    expect(screen.getByText("Feed")).toBeInTheDocument();
    expect(document.documentElement.dir).toBe("ltr");
  });
});
