import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { api } from "../api/http.js";
import { languages } from "../i18n.js";
import { FeedPanel } from "./FeedPanel.jsx";

vi.mock("../api/http.js", () => ({
  api: {
    feed: vi.fn(),
    listGroups: vi.fn(),
    listUsers: vi.fn(),
    createPost: vi.fn()
  }
}));

const currentUser = { id: "user_dana", username: "dana", displayName: "Dana Levi" };

describe("FeedPanel", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    api.listGroups.mockResolvedValue({
      groups: [{
        id: "group_algorithms",
        name: "Algorithms Study Lab",
        category: "Computer Science"
      }]
    });
    api.listUsers.mockResolvedValue({
      users: [
        { id: "user_dana", username: "dana", displayName: "Dana Levi" },
        { id: "user_noam", username: "noam", displayName: "Noam Cohen" }
      ]
    });
  });

  it("renders published posts as the main social feed", async () => {
    api.feed.mockResolvedValue({
      posts: [{
        id: "post_algorithms_2",
        authorId: "user_noam",
        groupId: "group_algorithms",
        content: "Who wants to solve dynamic programming questions tonight?",
        tags: ["practice", "dp"],
        createdAt: "2026-06-12T17:30:00.000Z"
      }]
    });

    render(<FeedPanel copy={languages.he} currentUser={currentUser} />);

    expect(await screen.findByText("Who wants to solve dynamic programming questions tonight?")).toBeInTheDocument();
    expect(screen.getByText("Noam Cohen")).toBeInTheDocument();
    expect(screen.getAllByText(/Algorithms Study Lab/).length).toBeGreaterThan(0);
    expect(screen.getByText("practice")).toBeInTheDocument();
  });

  it("publishes a new post from the feed composer", async () => {
    api.feed.mockResolvedValue({ posts: [] });
    api.createPost.mockResolvedValue({
      post: {
        id: "post_new",
        authorId: "user_dana",
        groupId: "group_algorithms",
        content: "Uploaded a focused exam summary.",
        tags: ["exam", "summary"],
        mediaUrl: "",
        mediaType: "",
        createdAt: "2026-06-22T08:00:00.000Z"
      }
    });

    render(<FeedPanel copy={languages.he} currentUser={currentUser} />);

    await screen.findByText("אין עדיין פוסטים להצגה.");
    fireEvent.change(screen.getByLabelText("תוכן הפוסט"), {
      target: { value: "Uploaded a focused exam summary." }
    });
    fireEvent.change(screen.getByLabelText("תגיות"), {
      target: { value: "exam, summary" }
    });
    fireEvent.click(screen.getByRole("button", { name: "פרסום פוסט" }));

    await waitFor(() => expect(api.createPost).toHaveBeenCalledWith({
      groupId: "group_algorithms",
      content: "Uploaded a focused exam summary.",
      tags: ["exam", "summary"],
      mediaUrl: "",
      mediaType: ""
    }));
    expect(await screen.findByText("Uploaded a focused exam summary.")).toBeInTheDocument();
    expect(screen.getByText("הפוסט פורסם בפיד.")).toBeInTheDocument();
  });
});
