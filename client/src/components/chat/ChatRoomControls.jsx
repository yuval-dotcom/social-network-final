import { useAppContext } from "../../contexts/AppContext.jsx";
export function ChatRoomControls({ onRecipientChange, onRoomChange, recipientId, roomId }) {
  const { copy } = useAppContext();

  return (
    <div className="chat-room-controls">
      <label>
        {copy.chat.room}
        <input value={roomId} onChange={onRoomChange} required />
      </label>
      <label>
        {copy.chat.recipient}
        <input
          value={recipientId}
          onChange={onRecipientChange}
          placeholder={copy.chat.recipientPlaceholder}
        />
      </label>
    </div>
  );
}
