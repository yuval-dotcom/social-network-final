import { fireEvent, render, screen, waitFor } from "../test-utils.jsx";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { api } from "../api/http.js";
import { languages } from "../i18n.js";
import { MyPostsPanel } from "./MyPostsPanel.jsx";

vi.mock("../api/http.js", () => ({
  api: {
    myPosts: vi.fn(),
    listGroups: vi.fn(),
    updatePost: vi.fn(),
    deletePost: vi.fn()
  }
}));

const post = {
  id: "post_algorithms_1",
  authorId: "user_dana",
  groupId: "group_algorithms",
  content: "I uploaded a short summary for graph algorithms.",
  tags: ["exam", "graphs"],
  createdAt: "2026-06-01T09:00:00.000Z"
};

describe("MyPostsPanel", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    api.myPosts.mockResolvedValue({ posts: [post] });
    api.listGroups.mockResolvedValue({
      groups: [
        {
          id: "group_algorithms",
          name: "Algorithms Study Lab"
        }
      ]
    });
  });

  it("loads the current user's posts", async () => {
    render(<MyPostsPanel copy={languages.he} />);

    expect(
      await screen.findByText("I uploaded a short summary for graph algorithms.")
    ).toBeInTheDocument();
    expect(screen.getByText("Algorithms Study Lab")).toBeInTheDocument();
    expect(screen.getByText("סיכום אישי")).toBeInTheDocument();
    expect(api.myPosts).toHaveBeenCalledTimes(1);
  });

  it("updates selected posts from the editor", async () => {
    api.updatePost.mockResolvedValue({
      post: {
        ...post,
        content: "Updated graph algorithms summary.",
        tags: ["updated", "graphs"]
      }
    });
    render(<MyPostsPanel copy={languages.he} />);

    await screen.findByText("I uploaded a short summary for graph algorithms.");
    fireEvent.click(screen.getByRole("button", { name: "עריכה" }));
    fireEvent.change(screen.getByLabelText("תוכן הפוסט"), {
      target: { value: "Updated graph algorithms summary." }
    });
    fireEvent.change(screen.getAllByLabelText("תגיות")[0], {
      target: { value: "updated, graphs" }
    });
    fireEvent.click(screen.getByRole("button", { name: "שמירת שינויים" }));

    await waitFor(() =>
      expect(api.updatePost).toHaveBeenCalledWith("post_algorithms_1", {
        content: "Updated graph algorithms summary.",
        tags: ["updated", "graphs"]
      })
    );
    expect(
      await screen.findByRole("heading", { name: "Updated graph algorithms summary." })
    ).toBeInTheDocument();
    expect(screen.getByText("הפוסט עודכן.")).toBeInTheDocument();
  });

  it("deletes posts from the personal posts screen", async () => {
    api.deletePost.mockResolvedValue({ success: true });
    render(<MyPostsPanel copy={languages.he} />);

    await screen.findByText("I uploaded a short summary for graph algorithms.");
    fireEvent.click(screen.getByRole("button", { name: "מחיקה" }));

    await waitFor(() => expect(api.deletePost).toHaveBeenCalledWith("post_algorithms_1"));
    expect(
      screen.queryByText("I uploaded a short summary for graph algorithms.")
    ).not.toBeInTheDocument();
    expect(screen.getByText("הפוסט נמחק.")).toBeInTheDocument();
  });
});
