import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { api } from "../api/http.js";
import { languages } from "../i18n.js";
import { ProfilePanel } from "./ProfilePanel.jsx";

vi.mock("../api/http.js", () => ({
  api: {
    listUsers: vi.fn(),
    listGroups: vi.fn(),
    myPosts: vi.fn()
  }
}));

const currentUser = { id: "user_dana", username: "dana", displayName: "Dana Levi" };

describe("ProfilePanel", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    api.listUsers.mockResolvedValue({
      users: [
        {
          id: "user_dana",
          username: "dana",
          displayName: "Dana Levi",
          major: "Computer Science",
          friendIds: ["user_noam"],
          groupIds: ["group_algorithms"]
        },
        {
          id: "user_noam",
          username: "noam",
          displayName: "Noam Cohen",
          major: "Information Systems"
        }
      ]
    });
    api.listGroups.mockResolvedValue({
      groups: [{
        id: "group_algorithms",
        name: "Algorithms Study Lab",
        category: "Computer Science",
        privacy: "public",
        memberIds: ["user_dana", "user_noam"]
      }]
    });
    api.myPosts.mockResolvedValue({
      posts: [{
        id: "post_algorithms_1",
        groupId: "group_algorithms",
        content: "I uploaded a short summary for graph algorithms.",
        tags: ["exam", "graphs"]
      }]
    });
  });

  it("shows the current user with friends, groups, and recent posts", async () => {
    render(<ProfilePanel copy={languages.he} currentUser={currentUser} />);

    expect(await screen.findByRole("heading", { name: "הפרופיל שלי" })).toBeInTheDocument();
    expect(screen.getAllByText("Dana Levi").length).toBeGreaterThan(0);
    expect(screen.getByText("Noam Cohen")).toBeInTheDocument();
    expect(screen.getAllByText("Algorithms Study Lab").length).toBeGreaterThan(0);
    expect(screen.getByText("I uploaded a short summary for graph algorithms.")).toBeInTheDocument();
    expect(screen.getByText("exam")).toBeInTheDocument();
    expect(api.listUsers).toHaveBeenCalledTimes(1);
    expect(api.listGroups).toHaveBeenCalledTimes(1);
    expect(api.myPosts).toHaveBeenCalledTimes(1);
  });
});
