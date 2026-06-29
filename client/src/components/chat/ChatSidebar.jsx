import { Avatar } from "../shared";

export function ChatSidebar({ activeRoomId, copy, displayName }) {
  return (
    <aside className="chat-sidebar" aria-label={copy.chat.roomListLabel}>
      <div className="chat-user-card">
        <Avatar name={displayName} />
        <div>
          <span>{copy.chat.signedInAs}</span>
          <strong>{displayName}</strong>
        </div>
      </div>
      <div className="chat-room-card">
        <span>{copy.chat.activeRoom}</span>
        <strong>{activeRoomId}</strong>
        <p>{copy.chat.roomHint}</p>
      </div>
    </aside>
  );
}
