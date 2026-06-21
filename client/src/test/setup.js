import "@testing-library/jest-dom/vitest";

HTMLCanvasElement.prototype.getContext = () => ({
  clearRect() {},
  fillRect() {},
  fillText() {},
  set fillStyle(value) {},
  set font(value) {}
});
