import { useEffect, useRef, useState } from "react";

export function MediaPanel({ copy }) {
  const canvasRef = useRef(null);
  const [name, setName] = useState("StudyCircle Student");
  const [videoUrl, setVideoUrl] = useState("https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4");

  function drawBadge() {
    const canvas = canvasRef.current;
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

  useEffect(() => {
    drawBadge();
  }, []);

  return (
    <section className="panel" id="media">
      <div className="panel-heading">
        <h2>{copy.media.title}</h2>
        <button type="button" onClick={drawBadge}>{copy.media.draw}</button>
      </div>
      <div className="media-grid">
        <div>
          <label>
            {copy.media.badgeName}
            <input value={name} onChange={(event) => setName(event.target.value)} />
          </label>
          <canvas ref={canvasRef} width="420" height="160" aria-label={copy.media.canvasLabel} />
        </div>
        <div>
          <label>
            {copy.media.videoUrl}
            <input value={videoUrl} onChange={(event) => setVideoUrl(event.target.value)} />
          </label>
          <video controls src={videoUrl} aria-label={copy.media.videoLabel} />
        </div>
      </div>
    </section>
  );
}

