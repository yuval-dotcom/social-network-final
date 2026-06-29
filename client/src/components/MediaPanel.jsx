import { useAppContext } from "../contexts/AppContext.jsx";
import { useState } from "react";
import { CanvasBadge, VideoPreview } from "./media";

export function MediaPanel() {
  const { copy } = useAppContext();

  const [name, setName] = useState("StudyCircle Student");
  const [videoUrl, setVideoUrl] = useState(
    "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
  );
  const [drawCount, setDrawCount] = useState(0);

  return (
    <section className="panel" id="media">
      <div className="panel-heading">
        <h2>{copy.media.title}</h2>
        <button type="button" onClick={() => setDrawCount((current) => current + 1)}>
          {copy.media.draw}
        </button>
      </div>
      <div className="media-grid">
        <CanvasBadge
          drawCount={drawCount}
          name={name}
          onNameChange={(event) => setName(event.target.value)}
        />
        <VideoPreview
          onVideoUrlChange={(event) => setVideoUrl(event.target.value)}
          videoUrl={videoUrl}
        />
      </div>
    </section>
  );
}
