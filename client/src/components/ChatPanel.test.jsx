import { act, fireEvent, render, screen } from "../test-utils.jsx";
import { describe, expect, it, vi } from "vitest";
import { languages } from "../i18n.js";
import { ChatPanel } from "./ChatPanel.jsx";

describe("ChatPanel", () => {
  it("loads history and sends messages as the signed-in user", () => {
    let messageHandler;
    const fakeClient = {
      join: vi.fn(),
      loadHistory: vi.fn((roomId, callback) =>
        callback([{ id: "m1", senderId: "u1", text: "hello" }])
      ),
      send: vi.fn((payload, callback) => callback({ success: true })),
      onMessage: vi.fn((callback) => {
        messageHandler = callback;
      }),
      disconnect: vi.fn()
    };

    render(<ChatPanel clientFactory={() => fakeClient} />, {
      currentUser: { id: "user_dana", username: "dana", displayName: "Dana Levi" }
    });

    expect(fakeClient.join).toHaveBeenCalledWith("general");
    expect(fakeClient.loadHistory).toHaveBeenCalledWith("general", expect.any(Function));
    expect(screen.getByText("Dana Levi")).toBeInTheDocument();
    expect(screen.getByText("hello")).toBeInTheDocument();

    act(() => {
      messageHandler({ id: "m2", senderId: "user_dana", text: "I can join tonight." });
    });
    expect(screen.getByText("I can join tonight.")).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("הודעה"), { target: { value: "hello" } });
    fireEvent.click(screen.getByRole("button", { name: "שליחה" }));

    expect(fakeClient.send).toHaveBeenCalledWith(
      expect.objectContaining({ roomId: "general", senderId: "user_dana", text: "hello" }),
      expect.any(Function)
    );
    expect(screen.getByText("ההודעה נשלחה.")).toBeInTheDocument();
  });
});
