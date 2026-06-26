export function VideoPreview({ copy, onVideoUrlChange, videoUrl }) {
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
