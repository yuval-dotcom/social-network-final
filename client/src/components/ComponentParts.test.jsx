import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { languages } from "../i18n.js";
import { FeedPostCard } from "./feed/FeedPostCard.jsx";
import { FeedProfileCard } from "./feed/FeedProfileCard.jsx";
import { GroupCard } from "./groups/GroupCard.jsx";
import { GroupSearchBar } from "./groups/GroupSearchBar.jsx";
import { ModelMap } from "./management/ModelMap.jsx";
import { Avatar } from "./shared/Avatar.jsx";

describe("small UI components", () => {
  it("renders a reusable avatar initial", () => {
    render(<Avatar name="Dana Levi" />);

    expect(screen.getByText("D")).toBeInTheDocument();
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
