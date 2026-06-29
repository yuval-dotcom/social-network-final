import { fireEvent, render, screen, waitFor } from "../test-utils.jsx";
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
      groups: [
        {
          id: "group_algorithms",
          name: "Algorithms Study Lab",
          category: "Computer Science"
        }
      ]
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
      posts: [
        {
          id: "post_algorithms_2",
          authorId: "user_noam",
          groupId: "group_algorithms",
          content: "Who wants to solve dynamic programming questions tonight?",
          tags: ["practice", "dp"],
          createdAt: "2026-06-12T17:30:00.000Z"
        }
      ]
    });

    render(<FeedPanel copy={languages.he} />, { currentUser: currentUser });

    expect(
      await screen.findByText("Who wants to solve dynamic programming questions tonight?")
    ).toBeInTheDocument();
    expect(screen.getByText("Noam Cohen")).toBeInTheDocument();
    expect(screen.getAllByText(/Algorithms Study Lab/).length).toBeGreaterThan(0);
    expect(screen.getByText("practice")).toBeInTheDocument();
    expect(screen.getByText("הפרופיל שלך")).toBeInTheDocument();
    expect(screen.getByText("פוסטים בפיד")).toBeInTheDocument();
    expect(screen.getByText("כותבים")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "שמירה" })).toBeInTheDocument();
  });

  it("supports a local save action on a feed post card", async () => {
    api.feed.mockResolvedValue({
      posts: [
        {
          id: "post_algorithms_2",
          authorId: "user_noam",
          groupId: "group_algorithms",
          content: "Who wants to solve dynamic programming questions tonight?",
          tags: ["practice"],
          createdAt: "2026-06-12T17:30:00.000Z"
        }
      ]
    });

    render(<FeedPanel copy={languages.he} />, { currentUser: currentUser });

    const saveButton = await screen.findByRole("button", { name: "שמירה" });
    fireEvent.click(saveButton);

    expect(screen.getByRole("button", { name: "נשמר" })).toHaveAttribute("aria-pressed", "true");
  });

  it("publishes a new post from the feed composer", async () => {
    api.feed.mockResolvedValue({ posts: [] });
    const videoUrl = "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4";
    api.createPost.mockResolvedValue({
      post: {
        id: "post_new",
        authorId: "user_dana",
        groupId: "group_algorithms",
        content: "Uploaded a focused exam summary.",
        tags: ["exam", "summary"],
        mediaUrl: videoUrl,
        mediaType: "video",
        createdAt: "2026-06-22T08:00:00.000Z"
      }
    });

    render(<FeedPanel copy={languages.he} />, { currentUser: currentUser });

    await screen.findByText("אין עדיין פוסטים להצגה.");
    fireEvent.change(screen.getByLabelText("תוכן הפוסט"), {
      target: { value: "Uploaded a focused exam summary." }
    });
    fireEvent.change(screen.getByLabelText("תגיות"), {
      target: { value: "exam, summary" }
    });
    fireEvent.change(screen.getByLabelText("וידאו אופציונלי"), {
      target: { value: videoUrl }
    });
    fireEvent.click(screen.getByRole("button", { name: "פרסום פוסט" }));

    await waitFor(() =>
      expect(api.createPost).toHaveBeenCalledWith({
        groupId: "group_algorithms",
        content: "Uploaded a focused exam summary.",
        tags: ["exam", "summary"],
        mediaUrl: videoUrl,
        mediaType: "video"
      })
    );
    expect(await screen.findByText("Uploaded a focused exam summary.")).toBeInTheDocument();
    expect(document.querySelector(".feed-video")).toHaveAttribute("src", videoUrl);
    expect(screen.getByText("הפוסט פורסם בפיד.")).toBeInTheDocument();
  });
});
