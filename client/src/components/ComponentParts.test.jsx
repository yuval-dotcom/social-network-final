import { fireEvent, render, screen } from "../test-utils.jsx";
import { afterEach, describe, expect, it, vi } from "vitest";
import { languages } from "../i18n.js";
import { useForm } from "../hooks/useForm.js";
import { MainNavigation } from "./app";
import { AuthModeSwitch } from "./auth";
import { ChatTranscript } from "./chat";
import { FeedPostCard, FeedProfileCard } from "./feed";
import { GroupCard, GroupDetailPanel, GroupManagementResultCard, GroupSearchBar } from "./groups";
import { ModelMap } from "./management";
import { VideoPreview } from "./media";
import { PostManagementResultCard } from "./posts";
import { Avatar, CardSkeleton, ErrorBoundary, LoadingSkeleton, ThemeToggle } from "./shared";
import { D3BarChart } from "./stats";
import { UserResultCard } from "./users";

afterEach(() => {
  localStorage.clear();
  document.documentElement.dataset.theme = "light";
});

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

  it("toggles the theme with Hebrew labels", () => {
    render(<ThemeToggle copy={languages.he} />);

    const toggle = screen.getByRole("button", { name: "מצב כהה" });
    expect(document.documentElement.dataset.theme).toBe("light");

    fireEvent.click(toggle);

    expect(document.documentElement.dataset.theme).toBe("dark");
    expect(localStorage.getItem("studycircle_theme")).toBe("dark");
    expect(screen.getByRole("button", { name: "מצב בהיר" })).toBeInTheDocument();
  });

  it("renders loading placeholders as separate reusable parts", () => {
    const { container } = render(
      <>
        <LoadingSkeleton lines={4} />
        <CardSkeleton count={2} />
      </>
    );

    expect(screen.getByLabelText("Loading")).toHaveAttribute("aria-busy", "true");
    expect(container.querySelectorAll(".skeleton-card")).toHaveLength(2);
    expect(container.querySelectorAll(".skeleton-line").length).toBeGreaterThanOrEqual(4);
  });

  it("catches render errors with the shared error boundary", () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
    function BrokenPart() {
      throw new Error("Demo crash");
    }

    render(
      <ErrorBoundary title="שגיאה" message="נפילה נשלטת" retryLabel="נסה שוב">
        <BrokenPart />
      </ErrorBoundary>
    );

    expect(screen.getByRole("heading", { name: "שגיאה" })).toBeInTheDocument();
    expect(screen.getByText("נפילה נשלטת")).toBeInTheDocument();
    consoleError.mockRestore();
  });

  it("updates and resets form fields with the shared form hook", () => {
    function DemoForm() {
      const { values, onChange, reset } = useForm({ title: "" });
      return (
        <form>
          <label>
            Title
            <input name="title" value={values.title} onChange={onChange} />
          </label>
          <button type="button" onClick={reset}>
            Reset
          </button>
          <output>{values.title}</output>
        </form>
      );
    }

    render(<DemoForm />);

    fireEvent.change(screen.getByLabelText("Title"), { target: { value: "Algorithms" } });
    expect(screen.getByText("Algorithms")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Reset" }));
    expect(screen.queryByText("Algorithms")).not.toBeInTheDocument();
  });

  it("renders the main navigation as a separate app part", () => {
    const onViewChange = vi.fn();
    render(<MainNavigation activeView="feed" copy={languages.he} onViewChange={onViewChange} />);

    expect(screen.getByRole("button", { name: "פיד" })).toHaveAttribute("aria-current", "page");
    fireEvent.click(screen.getByRole("button", { name: "צ'אט" }));
    expect(onViewChange).toHaveBeenCalledWith("chat");
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
    expect(
      screen.getByText("Who wants to solve dynamic programming questions tonight?")
    ).toBeInTheDocument();
    expect(screen.getByText("practice")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "שמירה" }));
    expect(screen.getByRole("button", { name: "נשמר" })).toBeInTheDocument();
  });

  it("renders the profile card as a separate feed part", () => {
    render(
      <FeedProfileCard
        copy={languages.he}
        posts={[{ authorId: "user_dana" }, { authorId: "user_noam" }]}
        groupCount={2}
      />,
      { currentUser: { displayName: "Dana Levi", major: "Computer Science" } }
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
    render(
      <D3BarChart
        data={[{ month: "2026-06", count: 3 }]}
        labelKey="month"
        title="פוסטים לפי חודש"
      />
    );

    expect(screen.getByLabelText("פוסטים לפי חודש")).toBeInTheDocument();
    expect(document.querySelectorAll("rect").length).toBeGreaterThan(0);
  });

  it("renders video preview as a separate media part", () => {
    render(
      <VideoPreview
        copy={languages.he}
        onVideoUrlChange={() => {}}
        videoUrl="https://example.com/demo.mp4"
      />
    );

    expect(screen.getByLabelText("קישור וידאו")).toHaveValue("https://example.com/demo.mp4");
    expect(screen.getByLabelText("נגן וידאו")).toHaveAttribute(
      "src",
      "https://example.com/demo.mp4"
    );
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
        posts={[
          {
            id: "post_design_1",
            groupId: "group_design",
            content: "Please review this short portfolio video before class.",
            tags: ["portfolio"]
          }
        ]}
        stats={{ total: 2, publicCount: 1, myGroups: 1 }}
        users={[
          { id: "user_maya", username: "maya", displayName: "Maya Bar" },
          { id: "user_noam", username: "noam", displayName: "Noam Cohen" }
        ]}
      />,
      { currentUser: { id: "user_maya", role: "admin" } }
    );

    expect(screen.getByRole("heading", { name: "Campus Design Circle" })).toBeInTheDocument();
    expect(screen.getAllByText("Maya Bar").length).toBeGreaterThan(0);
    expect(screen.getByText("Noam Cohen")).toBeInTheDocument();
    expect(
      screen.getByText("Please review this short portfolio video before class.")
    ).toBeInTheDocument();
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
