import { useState } from "react";
import { CanvasBadge, VideoPreview } from "./media";

export function MediaPanel({ copy }) {
  const [name, setName] = useState("StudyCircle Student");
  const [videoUrl, setVideoUrl] = useState("https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4");
  const [drawCount, setDrawCount] = useState(0);

  return (
    <section className="panel" id="media">
      <div className="panel-heading">
        <h2>{copy.media.title}</h2>
        <button type="button" onClick={() => setDrawCount((current) => current + 1)}>{copy.media.draw}</button>
      </div>
      <div className="media-grid">
        <CanvasBadge
          copy={copy}
          drawCount={drawCount}
          name={name}
          onNameChange={(event) => setName(event.target.value)}
        />
        <VideoPreview
          copy={copy}
          onVideoUrlChange={(event) => setVideoUrl(event.target.value)}
          videoUrl={videoUrl}
        />
      </div>
    </section>
  );
}
