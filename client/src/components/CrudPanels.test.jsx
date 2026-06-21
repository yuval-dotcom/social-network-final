import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { api } from "../api/http.js";
import { languages } from "../i18n.js";
import { GroupsPanel } from "./GroupsPanel.jsx";
import { PostsPanel } from "./PostsPanel.jsx";
import { UsersPanel } from "./UsersPanel.jsx";

vi.mock("../api/http.js", () => ({
  api: {
    listUsers: vi.fn(),
    searchUsers: vi.fn(),
    updateUser: vi.fn(),
    deleteUser: vi.fn(),
    listGroups: vi.fn(),
    searchGroups: vi.fn(),
    createGroup: vi.fn(),
    updateGroup: vi.fn(),
    deleteGroup: vi.fn(),
    joinGroup: vi.fn(),
    approveGroupMember: vi.fn(),
    listPosts: vi.fn(),
    feed: vi.fn(),
    myPosts: vi.fn(),
    searchPosts: vi.fn(),
    createPost: vi.fn(),
    updatePost: vi.fn(),
    deletePost: vi.fn()
  }
}));

describe("CRUD panels", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("searches users with three parameters", async () => {
    api.searchUsers.mockResolvedValue({ users: [] });
    render(<UsersPanel copy={languages.he} />);

    fireEvent.change(screen.getByLabelText("מילת חיפוש"), { target: { value: "dana" } });
    fireEvent.change(screen.getByLabelText("מסלול לימודים"), { target: { value: "CS" } });
    fireEvent.change(screen.getByLabelText("תפקיד"), { target: { value: "student" } });
    fireEvent.click(screen.getByRole("button", { name: "חיפוש" }));

    await waitFor(() => expect(api.searchUsers).toHaveBeenCalledWith({ q: "dana", major: "CS", role: "student" }));
  });

  it("shows a friendly message when user API calls fail", async () => {
    api.listUsers.mockRejectedValue({ message: "network down" });
    render(<UsersPanel copy={languages.he} />);

    fireEvent.click(screen.getByRole("button", { name: "רשימה" }));

    await waitFor(() => expect(screen.getByText("network down")).toBeInTheDocument());
  });

  it("fills the user edit form from a selected result card", async () => {
    api.listUsers.mockResolvedValue({
      users: [{
        id: "user_dana",
        username: "dana",
        displayName: "Dana Levi",
        bio: "Likes algorithms",
        major: "Computer Science",
        role: "student",
        groupIds: ["group_algorithms"]
      }]
    });
    render(<UsersPanel copy={languages.he} />);

    fireEvent.click(screen.getByRole("button", { name: "רשימה" }));
    await screen.findByText("Dana Levi");
    fireEvent.click(screen.getByRole("button", { name: "בחר" }));

    expect(screen.getByLabelText("מזהה")).toHaveValue("user_dana");
    expect(screen.getByLabelText("שם מלא")).toHaveValue("Dana Levi");
    expect(screen.getByLabelText("ביוגרפיה")).toHaveValue("Likes algorithms");
    expect(screen.getByText("פריט נבחר: user_dana")).toBeInTheDocument();
    expect(screen.getByText("Dana Levi").closest(".result-card")).toHaveClass("is-selected");
  });

  it("removes deleted users from the visible list", async () => {
    api.listUsers.mockResolvedValue({
      users: [{
        id: "user_temp",
        username: "temp",
        displayName: "Temp User",
        bio: "",
        major: "Testing",
        role: "student",
        groupIds: []
      }]
    });
    api.deleteUser.mockResolvedValue({ success: true });
    render(<UsersPanel copy={languages.he} />);

    fireEvent.click(screen.getByRole("button", { name: "רשימה" }));
    await screen.findByText("Temp User");
    fireEvent.click(screen.getByRole("button", { name: "בחר" }));
    fireEvent.click(screen.getByRole("button", { name: "מחיקה" }));

    await waitFor(() => expect(screen.queryByText("Temp User")).not.toBeInTheDocument());
    expect(screen.getByText("בחר פריט מהרשימה או הזן מזהה ידנית")).toBeInTheDocument();
  });

  it("creates groups from the UI", async () => {
    api.createGroup.mockResolvedValue({ group: { id: "g1", name: "Math" } });
    render(<GroupsPanel copy={languages.he} />);

    fireEvent.change(screen.getByLabelText("שם"), { target: { value: "Math" } });
    fireEvent.change(screen.getAllByLabelText("קטגוריה")[0], { target: { value: "Math" } });
    fireEvent.click(screen.getByRole("button", { name: "יצירה" }));

    await waitFor(() => expect(api.createGroup).toHaveBeenCalled());
  });

  it("fills the group form from a selected result card", async () => {
    api.listGroups.mockResolvedValue({
      groups: [{
        id: "group_design",
        name: "Campus Design Circle",
        description: "Portfolio feedback",
        category: "Design",
        privacy: "private",
        ownerId: "user_maya",
        memberIds: ["user_maya"],
        pendingMemberIds: ["user_noam"]
      }]
    });
    render(<GroupsPanel copy={languages.he} />);

    fireEvent.click(screen.getByRole("button", { name: "רשימה" }));
    await screen.findByText("Campus Design Circle");
    fireEvent.click(screen.getByRole("button", { name: "בחר" }));

    expect(screen.getByLabelText("מזהה")).toHaveValue("group_design");
    expect(screen.getByLabelText("שם")).toHaveValue("Campus Design Circle");
    expect(screen.getAllByLabelText("קטגוריה")[0]).toHaveValue("Design");
    expect(screen.getByLabelText("מזהה משתמש")).toHaveValue("user_noam");
    expect(screen.getByText("פריט נבחר: group_design")).toBeInTheDocument();
    expect(screen.getByText("Campus Design Circle").closest(".result-card")).toHaveClass("is-selected");
  });

  it("updates group result cards after editing", async () => {
    api.listGroups.mockResolvedValue({
      groups: [{
        id: "group_temp",
        name: "Temp Group",
        description: "",
        category: "Testing",
        privacy: "public",
        ownerId: "user_dana",
        memberIds: ["user_dana"],
        pendingMemberIds: []
      }]
    });
    api.updateGroup.mockResolvedValue({
      group: {
        id: "group_temp",
        name: "Updated Group",
        description: "",
        category: "Testing",
        privacy: "public",
        ownerId: "user_dana",
        memberIds: ["user_dana"],
        pendingMemberIds: []
      }
    });
    render(<GroupsPanel copy={languages.he} />);

    fireEvent.click(screen.getByRole("button", { name: "רשימה" }));
    await screen.findByText("Temp Group");
    fireEvent.click(screen.getByRole("button", { name: "בחר" }));
    fireEvent.change(screen.getByLabelText("שם"), { target: { value: "Updated Group" } });
    fireEvent.click(screen.getByRole("button", { name: "עדכון" }));

    await screen.findByText("Updated Group");
    expect(screen.queryByText("Temp Group")).not.toBeInTheDocument();
  });

  it("creates posts from the UI", async () => {
    api.createPost.mockResolvedValue({ post: { id: "p1", content: "Exam tips" } });
    render(<PostsPanel copy={languages.he} />);

    fireEvent.change(screen.getAllByLabelText("מזהה קבוצה")[0], { target: { value: "g1" } });
    fireEvent.change(screen.getByLabelText("תוכן"), { target: { value: "Exam tips" } });
    fireEvent.click(screen.getByRole("button", { name: "יצירה" }));

    await waitFor(() => expect(api.createPost).toHaveBeenCalledWith(expect.objectContaining({ groupId: "g1", content: "Exam tips" })));
  });

  it("fills the post form from a selected result card", async () => {
    api.listPosts.mockResolvedValue({
      posts: [{
        id: "post_algorithms_1",
        groupId: "group_algorithms",
        authorId: "user_dana",
        content: "Graph summary",
        tags: ["exam", "graphs"],
        mediaUrl: "",
        mediaType: "",
        createdAt: "2026-06-01T09:00:00.000Z"
      }]
    });
    render(<PostsPanel copy={languages.he} />);

    fireEvent.click(screen.getByRole("button", { name: "רשימה" }));
    await screen.findByText("Graph summary");
    fireEvent.click(screen.getByRole("button", { name: "בחר" }));

    expect(screen.getByLabelText("מזהה")).toHaveValue("post_algorithms_1");
    expect(screen.getAllByLabelText("מזהה קבוצה")[0]).toHaveValue("group_algorithms");
    expect(screen.getByLabelText("תגיות")).toHaveValue("exam, graphs");
    expect(screen.getByLabelText("תוכן")).toHaveValue("Graph summary");
    expect(screen.getByText("פריט נבחר: post_algorithms_1")).toBeInTheDocument();
    const selectedPostCard = screen
      .getAllByText("Graph summary")
      .find((element) => element.closest(".result-card"))
      .closest(".result-card");
    expect(selectedPostCard).toHaveClass("is-selected");
  });

  it("removes deleted posts from the visible list", async () => {
    api.listPosts.mockResolvedValue({
      posts: [{
        id: "post_temp",
        groupId: "group_algorithms",
        authorId: "user_dana",
        content: "Temporary post",
        tags: ["qa"],
        mediaUrl: "",
        mediaType: "",
        createdAt: "2026-06-01T09:00:00.000Z"
      }]
    });
    api.deletePost.mockResolvedValue({ success: true });
    render(<PostsPanel copy={languages.he} />);

    fireEvent.click(screen.getByRole("button", { name: "רשימה" }));
    await screen.findByText("Temporary post");
    fireEvent.click(screen.getByRole("button", { name: "בחר" }));
    fireEvent.click(screen.getByRole("button", { name: "מחיקה" }));

    await waitFor(() => expect(screen.queryByText("Temporary post")).not.toBeInTheDocument());
    expect(screen.getByText("בחר פריט מהרשימה או הזן מזהה ידנית")).toBeInTheDocument();
  });
});
