import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { api } from "../api/http.js";
import { languages } from "../i18n.js";
import { GroupDiscoveryPanel } from "./GroupDiscoveryPanel.jsx";

vi.mock("../api/http.js", () => ({
  api: {
    listGroups: vi.fn(),
    listPosts: vi.fn(),
    listUsers: vi.fn(),
    approveGroupMember: vi.fn(),
    searchGroups: vi.fn(),
    joinGroup: vi.fn()
  }
}));

const currentUser = { id: "user_dana", username: "dana", displayName: "Dana Levi" };

const groups = [
  {
    id: "group_algorithms",
    name: "Algorithms Study Lab",
    description: "Exam preparation, summaries, and problem solving sessions.",
    category: "Computer Science",
    privacy: "public",
    ownerId: "user_dana",
    managerIds: ["user_dana"],
    memberIds: ["user_dana", "user_noam"],
    pendingMemberIds: []
  },
  {
    id: "group_design",
    name: "Campus Design Circle",
    description: "Portfolio feedback.",
    category: "Design",
    privacy: "private",
    ownerId: "user_maya",
    managerIds: ["user_maya"],
    memberIds: ["user_maya"],
    pendingMemberIds: ["user_noam"]
  }
];

const users = [
  { id: "user_dana", username: "dana", displayName: "Dana Levi" },
  { id: "user_noam", username: "noam", displayName: "Noam Cohen" },
  { id: "user_maya", username: "maya", displayName: "Maya Bar", role: "admin" }
];

const posts = [
  {
    id: "post_algorithms_1",
    authorId: "user_dana",
    groupId: "group_algorithms",
    content: "I uploaded a short summary for graph algorithms.",
    tags: ["exam", "graphs"]
  },
  {
    id: "post_design_1",
    authorId: "user_maya",
    groupId: "group_design",
    content: "Please review this short portfolio video before class.",
    tags: ["portfolio", "video"]
  }
];

describe("GroupDiscoveryPanel", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    api.listGroups.mockResolvedValue({ groups });
    api.listUsers.mockResolvedValue({ users });
    api.listPosts.mockResolvedValue({ posts });
  });

  it("renders groups as discoverable cards", async () => {
    render(<GroupDiscoveryPanel copy={languages.he} currentUser={currentUser} />);

    expect((await screen.findAllByRole("heading", { name: "Algorithms Study Lab" })).length).toBeGreaterThan(0);
    expect(screen.getByText("Campus Design Circle")).toBeInTheDocument();
    expect(screen.getByText("Computer Science")).toBeInTheDocument();
    expect(screen.getByText("דורשת אישור")).toBeInTheDocument();
    expect(screen.getAllByText("Dana Levi").length).toBeGreaterThan(0);
    expect(screen.getByText("I uploaded a short summary for graph algorithms.")).toBeInTheDocument();
  });

  it("searches groups with three visible filters", async () => {
    api.searchGroups.mockResolvedValue({ groups: [groups[0]] });
    render(<GroupDiscoveryPanel copy={languages.he} currentUser={currentUser} />);

    await screen.findAllByRole("heading", { name: "Algorithms Study Lab" });
    fireEvent.change(screen.getByLabelText("מילת חיפוש"), { target: { value: "algo" } });
    fireEvent.change(screen.getByLabelText("קטגוריה"), { target: { value: "Computer Science" } });
    fireEvent.change(screen.getByLabelText("פרטיות"), { target: { value: "public" } });
    fireEvent.click(screen.getByRole("button", { name: "חיפוש קבוצות" }));

    await waitFor(() => expect(api.searchGroups).toHaveBeenCalledWith({
      q: "algo",
      category: "Computer Science",
      privacy: "public"
    }));
  });

  it("joins public groups from the discovery screen", async () => {
    api.joinGroup.mockResolvedValue({
      status: "joined",
      group: {
        ...groups[0],
        memberIds: ["user_noam", "user_dana", "user_maya"]
      }
    });
    render(
      <GroupDiscoveryPanel
        copy={languages.he}
        currentUser={{ id: "user_maya", username: "maya", displayName: "Maya Bar" }}
      />
    );

    await screen.findAllByRole("heading", { name: "Algorithms Study Lab" });
    fireEvent.click(screen.getAllByRole("button", { name: "הצטרפות" })[0]);

    await waitFor(() => expect(api.joinGroup).toHaveBeenCalledWith("group_algorithms"));
    expect(await screen.findByText("הצטרפת לקבוצה.")).toBeInTheDocument();
    expect(screen.getAllByText("חבר בקבוצה").length).toBeGreaterThan(0);
  });

  it("lets group managers approve pending join requests from the group details", async () => {
    api.approveGroupMember.mockResolvedValue({
      group: {
        ...groups[1],
        memberIds: ["user_maya", "user_noam"],
        pendingMemberIds: []
      }
    });

    render(
      <GroupDiscoveryPanel
        copy={languages.he}
        currentUser={{ id: "user_maya", username: "maya", displayName: "Maya Bar", role: "admin" }}
      />
    );

    await screen.findAllByRole("heading", { name: "Algorithms Study Lab" });
    fireEvent.click(screen.getAllByRole("button", { name: "פרטים" })[1]);

    expect(screen.getAllByRole("heading", { name: "Campus Design Circle" }).length).toBeGreaterThan(0);
    expect(screen.getByText("Noam Cohen")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "אישור בקשה" }));

    await waitFor(() => expect(api.approveGroupMember).toHaveBeenCalledWith("group_design", "user_noam"));
    expect(await screen.findByText("המשתמש אושר ונוסף לחברי הקבוצה.")).toBeInTheDocument();
  });
});
