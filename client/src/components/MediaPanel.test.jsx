import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { languages } from "../i18n.js";
import { MediaPanel } from "./MediaPanel.jsx";

describe("MediaPanel", () => {
  beforeEach(() => {
    HTMLCanvasElement.prototype.getContext = vi.fn(() => ({
      clearRect: vi.fn(),
      fillRect: vi.fn(),
      fillText: vi.fn(),
      set fillStyle(value) {},
      set font(value) {}
    }));
  });

  it("renders video and canvas controls", () => {
    render(<MediaPanel copy={languages.he} />);

    expect(screen.getByLabelText("כרטיס Canvas")).toBeInTheDocument();
    expect(screen.getByLabelText("נגן וידאו")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "ציור כרטיס" }));

    expect(HTMLCanvasElement.prototype.getContext).toHaveBeenCalledWith("2d");
  });
});
