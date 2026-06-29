import { useAppContext } from "../../contexts/AppContext.jsx";
export function VideoPreview({ onVideoUrlChange, videoUrl }) {
  const { copy } = useAppContext();

  return (
    <div>
      <label>
        {copy.media.videoUrl}
        <input value={videoUrl} onChange={onVideoUrlChange} />
      </label>
      <video controls src={videoUrl} aria-label={copy.media.videoLabel} />
    </div>
  );
}
