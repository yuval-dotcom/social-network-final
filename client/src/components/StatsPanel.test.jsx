import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { api } from "../api/http.js";
import { languages } from "../i18n.js";
import { StatsPanel } from "./StatsPanel.jsx";

vi.mock("../api/http.js", () => ({
  api: {
    postsByMonth: vi.fn(),
    postsByGroup: vi.fn()
  }
}));

describe("StatsPanel", () => {
  it("loads dynamic chart data through the API", async () => {
    api.postsByMonth.mockResolvedValue({ data: [{ month: "2026-06", count: 3 }] });
    api.postsByGroup.mockResolvedValue({ data: [{ groupName: "Algorithms", count: 2 }] });

    render(<StatsPanel copy={languages.he} />);
    fireEvent.click(screen.getByRole("button", { name: "טעינת גרפים" }));

    await waitFor(() => expect(api.postsByMonth).toHaveBeenCalled());
    expect(screen.getByText("הגרפים נטענו.")).toBeInTheDocument();
    await waitFor(() => expect(document.querySelectorAll("rect").length).toBeGreaterThan(0));
  });
});
