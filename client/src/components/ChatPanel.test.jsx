import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { languages } from "../i18n.js";
import { ChatPanel } from "./ChatPanel.jsx";

describe("ChatPanel", () => {
  it("joins rooms and sends socket messages", () => {
    const fakeClient = {
      join: vi.fn(),
      loadHistory: vi.fn((roomId, callback) => callback([{ id: "m1", senderId: "u1", text: "hello" }])),
      send: vi.fn((payload, callback) => callback({ success: true })),
      onMessage: vi.fn(),
      disconnect: vi.fn()
    };

    render(<ChatPanel copy={languages.he} clientFactory={() => fakeClient} />);

    fireEvent.click(screen.getByRole("button", { name: "כניסה לחדר" }));
    fireEvent.change(screen.getByLabelText("מזהה כותב"), { target: { value: "u1" } });
    fireEvent.change(screen.getByLabelText("הודעה"), { target: { value: "hello" } });
    fireEvent.click(screen.getByRole("button", { name: "שליחה" }));

    expect(fakeClient.join).toHaveBeenCalledWith("general");
    expect(fakeClient.send).toHaveBeenCalledWith(
      expect.objectContaining({ roomId: "general", senderId: "u1", text: "hello" }),
      expect.any(Function)
    );
  });
});
