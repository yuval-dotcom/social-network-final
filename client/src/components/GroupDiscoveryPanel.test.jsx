import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { api } from "../api/http.js";
import { languages } from "../i18n.js";
import { GroupDiscoveryPanel } from "./GroupDiscoveryPanel.jsx";

vi.mock("../api/http.js", () => ({
  api: {
    listGroups: vi.fn(),
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
    memberIds: ["user_noam"],
    pendingMemberIds: []
  },
  {
    id: "group_design",
    name: "Campus Design Circle",
    description: "Portfolio feedback.",
    category: "Design",
    privacy: "private",
    memberIds: ["user_maya"],
    pendingMemberIds: []
  }
];

describe("GroupDiscoveryPanel", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    api.listGroups.mockResolvedValue({ groups });
  });

  it("renders groups as discoverable cards", async () => {
    render(<GroupDiscoveryPanel copy={languages.he} currentUser={currentUser} />);

    expect(await screen.findByRole("heading", { name: "Algorithms Study Lab" })).toBeInTheDocument();
    expect(screen.getByText("Campus Design Circle")).toBeInTheDocument();
    expect(screen.getByText("Computer Science")).toBeInTheDocument();
    expect(screen.getByText("דורשת אישור")).toBeInTheDocument();
  });

  it("searches groups with three visible filters", async () => {
    api.searchGroups.mockResolvedValue({ groups: [groups[0]] });
    render(<GroupDiscoveryPanel copy={languages.he} currentUser={currentUser} />);

    await screen.findByRole("heading", { name: "Algorithms Study Lab" });
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
        memberIds: ["user_noam", "user_dana"]
      }
    });
    render(<GroupDiscoveryPanel copy={languages.he} currentUser={currentUser} />);

    await screen.findByRole("heading", { name: "Algorithms Study Lab" });
    fireEvent.click(screen.getAllByRole("button", { name: "הצטרפות" })[0]);

    await waitFor(() => expect(api.joinGroup).toHaveBeenCalledWith("group_algorithms"));
    expect(await screen.findByText("הצטרפת לקבוצה.")).toBeInTheDocument();
    expect(screen.getByText("חבר בקבוצה")).toBeInTheDocument();
  });
});
