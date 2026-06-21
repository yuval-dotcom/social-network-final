import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
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

  it("creates groups from the UI", async () => {
    api.createGroup.mockResolvedValue({ group: { id: "g1", name: "Math" } });
    render(<GroupsPanel copy={languages.he} />);

    fireEvent.change(screen.getByLabelText("שם"), { target: { value: "Math" } });
    fireEvent.change(screen.getAllByLabelText("קטגוריה")[0], { target: { value: "Math" } });
    fireEvent.click(screen.getByRole("button", { name: "יצירה" }));

    await waitFor(() => expect(api.createGroup).toHaveBeenCalled());
  });

  it("creates posts from the UI", async () => {
    api.createPost.mockResolvedValue({ post: { id: "p1", content: "Exam tips" } });
    render(<PostsPanel copy={languages.he} />);

    fireEvent.change(screen.getAllByLabelText("מזהה קבוצה")[0], { target: { value: "g1" } });
    fireEvent.change(screen.getByLabelText("תוכן"), { target: { value: "Exam tips" } });
    fireEvent.click(screen.getByRole("button", { name: "יצירה" }));

    await waitFor(() => expect(api.createPost).toHaveBeenCalledWith(expect.objectContaining({ groupId: "g1", content: "Exam tips" })));
  });
});
