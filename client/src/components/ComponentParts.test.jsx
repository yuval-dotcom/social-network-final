import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { languages } from "../i18n.js";
import { AuthModeSwitch } from "./auth/AuthModeSwitch.jsx";
import { ChatTranscript } from "./chat/ChatTranscript.jsx";
import { FeedPostCard } from "./feed/FeedPostCard.jsx";
import { FeedProfileCard } from "./feed/FeedProfileCard.jsx";
import { GroupCard } from "./groups/GroupCard.jsx";
import { GroupDetailPanel } from "./groups/GroupDetailPanel.jsx";
import { GroupManagementResultCard } from "./groups/GroupManagementResultCard.jsx";
import { GroupSearchBar } from "./groups/GroupSearchBar.jsx";
import { ModelMap } from "./management/ModelMap.jsx";
import { PostManagementResultCard } from "./posts/PostManagementResultCard.jsx";
import { Avatar } from "./shared/Avatar.jsx";
import { D3BarChart } from "./stats/D3BarChart.jsx";
import { UserResultCard } from "./users/UserResultCard.jsx";

describe("small UI components", () => {
  it("renders a reusable avatar initial", () => {
    render(<Avatar name="Dana Levi" />);

    expect(screen.getByText("D")).toBeInTheDocument();
  });

  it("renders the auth mode switch as a small login part", () => {
    const onModeChange = vi.fn();
    render(
      <AuthModeSwitch
        copy={languages.he}
        isRegisterMode={false}
        mode="login"
        onModeChange={onModeChange}
      />
    );

    expect(screen.getByRole("button", { name: "התחברות" })).toHaveClass("active");
    fireEvent.click(screen.getByRole("button", { name: "הרשמה" }));
    expect(onModeChange).toHaveBeenCalledWith("register");
  });

  it("renders feed post cards independently", () => {
    render(
      <FeedPostCard
        copy={languages.he}
        authorName="Noam Cohen"
        groupName="Algorithms Study Lab"
        locale="he-IL"
        post={{
          id: "post_algorithms_2",
          content: "Who wants to solve dynamic programming questions tonight?",
          tags: ["practice", "dp"],
          createdAt: "2026-06-12T17:30:00.000Z"
        }}
      />
    );

    expect(screen.getByText("Noam Cohen")).toBeInTheDocument();
    expect(screen.getByText(/Algorithms Study Lab/)).toBeInTheDocument();
    expect(screen.getByText("Who wants to solve dynamic programming questions tonight?")).toBeInTheDocument();
    expect(screen.getByText("practice")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "שמירה" }));
    expect(screen.getByRole("button", { name: "נשמר" })).toBeInTheDocument();
  });

  it("renders the profile card as a separate feed part", () => {
    render(
      <FeedProfileCard
        copy={languages.he}
        currentUser={{ displayName: "Dana Levi", major: "Computer Science" }}
        posts={[{ authorId: "user_dana" }, { authorId: "user_noam" }]}
        groupCount={2}
      />
    );

    expect(screen.getByText("הפרופיל שלך")).toBeInTheDocument();
    expect(screen.getByText("Dana Levi")).toBeInTheDocument();
    expect(screen.getByText("Computer Science")).toBeInTheDocument();
    expect(screen.getByText("פוסטים בפיד")).toBeInTheDocument();
    expect(screen.getByText("כותבים")).toBeInTheDocument();
  });

  it("renders the model map for defense explanation", () => {
    render(<ModelMap copy={languages.he} />);

    expect(screen.getByRole("heading", { name: "שלושת המודלים באפליקציה" })).toBeInTheDocument();
    expect(screen.getByText("User")).toBeInTheDocument();
    expect(screen.getByText("Group")).toBeInTheDocument();
    expect(screen.getByText("Post")).toBeInTheDocument();
  });

  it("renders chat messages as a separate transcript part", () => {
    render(
      <ChatTranscript
        copy={languages.he}
        displayName="Dana Levi"
        messages={[
          { id: "m1", senderId: "user_noam", text: "Can we study at 18:00?" },
          { id: "m2", senderId: "user_dana", text: "Yes, I will join." }
        ]}
        senderId="user_dana"
      />
    );

    expect(screen.getByText("user_noam")).toBeInTheDocument();
    expect(screen.getByText("Can we study at 18:00?")).toBeInTheDocument();
    expect(screen.getByText("Dana Levi")).toBeInTheDocument();
    expect(screen.getByText("Yes, I will join.").closest(".chat-message")).toHaveClass("is-mine");
  });

  it("renders a D3 chart as a reusable SVG component", () => {
    render(<D3BarChart data={[{ month: "2026-06", count: 3 }]} labelKey="month" title="פוסטים לפי חודש" />);

    expect(screen.getByLabelText("פוסטים לפי חודש")).toBeInTheDocument();
    expect(document.querySelectorAll("rect").length).toBeGreaterThan(0);
  });

  it("renders user result cards as separate management parts", () => {
    const onSelect = vi.fn();
    render(
      <UserResultCard
        copy={languages.he}
        isSelected
        onSelect={onSelect}
        user={{
          id: "user_dana",
          username: "dana",
          displayName: "Dana Levi",
          major: "Computer Science",
          role: "student",
          groupIds: ["group_algorithms"]
        }}
      />
    );

    expect(screen.getByText("Dana Levi")).toBeInTheDocument();
    expect(screen.getByText("@dana")).toBeInTheDocument();
    expect(screen.getByText("Computer Science")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "בחר" }));
    expect(onSelect).toHaveBeenCalledTimes(1);
  });

  it("renders group cards with separate select and join actions", () => {
    const onSelect = vi.fn();
    const onJoin = vi.fn();
    render(
      <GroupCard
        copy={languages.he}
        group={{
          id: "group_algorithms",
          name: "Algorithms Study Lab",
          description: "Exam preparation",
          category: "Computer Science",
          privacy: "public",
          memberIds: ["user_noam"],
          pendingMemberIds: []
        }}
        statusLabel="פתוחה"
        canJoin
        onSelect={onSelect}
        onJoin={onJoin}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "פרטים" }));
    fireEvent.click(screen.getByRole("button", { name: "הצטרפות" }));

    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(onJoin).toHaveBeenCalledTimes(1);
  });

  it("renders group management result cards independently", () => {
    const onSelect = vi.fn();
    render(
      <GroupManagementResultCard
        copy={languages.he}
        group={{
          id: "group_algorithms",
          name: "Algorithms Study Lab",
          description: "Exam preparation",
          category: "Computer Science",
          privacy: "public",
          ownerId: "user_dana",
          memberIds: ["user_dana", "user_noam"],
          pendingMemberIds: ["user_maya"]
        }}
        isSelected
        onSelect={onSelect}
      />
    );

    expect(screen.getByText("Algorithms Study Lab")).toBeInTheDocument();
    expect(screen.getByText("Exam preparation")).toBeInTheDocument();
    expect(screen.getByText("Computer Science")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "בחר" }));
    expect(onSelect).toHaveBeenCalledTimes(1);
  });

  it("renders post management result cards independently", () => {
    const onSelect = vi.fn();
    render(
      <PostManagementResultCard
        copy={languages.he}
        formatDate={() => "1.6.2026"}
        isSelected
        onSelect={onSelect}
        post={{
          id: "post_algorithms_1",
          groupId: "group_algorithms",
          authorId: "user_dana",
          content: "Graph summary",
          tags: ["exam", "graphs"],
          mediaType: "video",
          createdAt: "2026-06-01T09:00:00.000Z"
        }}
      />
    );

    expect(screen.getByText("Graph summary")).toBeInTheDocument();
    expect(screen.getByText("exam, graphs")).toBeInTheDocument();
    expect(screen.getByText("group_algorithms")).toBeInTheDocument();
    expect(screen.getByText("1.6.2026")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "בחר" }));
    expect(onSelect).toHaveBeenCalledTimes(1);
  });

  it("renders group details as a separate social component", () => {
    const onApproveMember = vi.fn();
    render(
      <GroupDetailPanel
        copy={languages.he}
        currentUser={{ id: "user_maya", role: "admin" }}
        group={{
          id: "group_design",
          name: "Campus Design Circle",
          description: "Portfolio feedback.",
          category: "Design",
          privacy: "private",
          managerIds: ["user_maya"],
          memberIds: ["user_maya"],
          pendingMemberIds: ["user_noam"]
        }}
        message=""
        onApproveMember={onApproveMember}
        posts={[{
          id: "post_design_1",
          groupId: "group_design",
          content: "Please review this short portfolio video before class.",
          tags: ["portfolio"]
        }]}
        stats={{ total: 2, publicCount: 1, myGroups: 1 }}
        users={[
          { id: "user_maya", username: "maya", displayName: "Maya Bar" },
          { id: "user_noam", username: "noam", displayName: "Noam Cohen" }
        ]}
      />
    );

    expect(screen.getByRole("heading", { name: "Campus Design Circle" })).toBeInTheDocument();
    expect(screen.getAllByText("Maya Bar").length).toBeGreaterThan(0);
    expect(screen.getByText("Noam Cohen")).toBeInTheDocument();
    expect(screen.getByText("Please review this short portfolio video before class.")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "אישור בקשה" }));
    expect(onApproveMember).toHaveBeenCalledWith("group_design", "user_noam");
  });

  it("keeps group search as an independent form component", () => {
    const onSubmit = vi.fn((event) => event.preventDefault());
    render(
      <GroupSearchBar
        copy={languages.he}
        filters={{ q: "", category: "", privacy: "" }}
        categories={["Computer Science"]}
        onChange={() => {}}
        onSubmit={onSubmit}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "חיפוש קבוצות" }));

    expect(screen.getByLabelText("מילת חיפוש")).toBeInTheDocument();
    expect(screen.getByLabelText("קטגוריה")).toBeInTheDocument();
    expect(screen.getByLabelText("פרטיות")).toBeInTheDocument();
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });
});
