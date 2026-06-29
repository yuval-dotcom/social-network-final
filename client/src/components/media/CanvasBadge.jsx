import { useAppContext } from "../../contexts/AppContext.jsx";
import { useEffect, useRef } from "react";

function drawStudentBadge(canvas, name) {
  if (!canvas) return;

  const context = canvas.getContext("2d");
  if (!context) return;

  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = "#176b87";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = "#ffffff";
  context.font = "22px Arial";
  context.fillText("StudyCircle", 24, 48);
  context.font = "18px Arial";
  context.fillText(name, 24, 88);
  context.fillStyle = "#d7eef2";
  context.fillRect(24, 112, 180, 12);
}

export function CanvasBadge({ drawCount, name, onNameChange }) {
  const { copy } = useAppContext();

  const canvasRef = useRef(null);

  useEffect(() => {
    drawStudentBadge(canvasRef.current, name);
  }, [drawCount, name]);

  return (
    <div>
      <label>
        {copy.media.badgeName}
        <input value={name} onChange={onNameChange} />
      </label>
      <canvas ref={canvasRef} width="420" height="160" aria-label={copy.media.canvasLabel} />
    </div>
  );
}
