import { useEffect, useRef, useState } from "react";
import { createChatClient } from "../realtime/chatClient.js";
import { Avatar } from "./shared/Avatar.jsx";

function messageKey(message) {
  return message.id || `${message.senderId}-${message.createdAt}-${message.text}`;
}

export function ChatPanel({ copy, currentUser, clientFactory = createChatClient }) {
  const clientRef = useRef(null);
  const [roomId, setRoomId] = useState("general");
  const [activeRoomId, setActiveRoomId] = useState("general");
  const [recipientId, setRecipientId] = useState("");
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);
  const [status, setStatus] = useState("");
  const senderId = currentUser?.id || currentUser?.username || "";
  const displayName = currentUser?.displayName || currentUser?.username || copy.chat.currentUserFallback;

  useEffect(() => {
    clientRef.current = clientFactory();
    clientRef.current.onMessage((message) => {
      setMessages((current) => [...current, message]);
    });

    return () => clientRef.current?.disconnect();
  }, [clientFactory]);

  useEffect(() => {
    loadRoom(activeRoomId);
  }, [activeRoomId]);

  function loadRoom(targetRoomId) {
    if (!clientRef.current) return;

    setStatus(copy.chat.loadingHistory);
    clientRef.current.join(targetRoomId);
    clientRef.current.loadHistory(targetRoomId, (history) => {
      setMessages(history || []);
      setStatus(copy.chat.connected);
    });
  }

  function joinRoom() {
    if (roomId === activeRoomId) {
      loadRoom(roomId);
      return;
    }

    setActiveRoomId(roomId);
  }

  function sendMessage(event) {
    event.preventDefault();
    if (!text.trim()) return;

    setStatus(copy.chat.sending);
    clientRef.current.send({ roomId: activeRoomId, senderId, recipientId, text: text.trim() }, (result) => {
      if (result?.success) {
        setText("");
        setStatus(copy.chat.sent);
        return;
      }

      setStatus(result?.message || copy.chat.failed);
    });
  }

  return (
    <section className="chat-view" id="chat" aria-label={copy.chat.title}>
      <div className="chat-shell">
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

        <div className="chat-main">
          <div className="chat-header">
            <div>
              <p className="eyebrow">{copy.chat.eyebrow}</p>
              <h2>{copy.chat.title}</h2>
              <p>{copy.chat.body}</p>
            </div>
            <button type="button" className="secondary-button" onClick={joinRoom}>
              {copy.chat.join}
            </button>
          </div>

          <div className="chat-room-controls">
            <label>
              {copy.chat.room}
              <input value={roomId} onChange={(event) => setRoomId(event.target.value)} required />
            </label>
            <label>
              {copy.chat.recipient}
              <input
                value={recipientId}
                onChange={(event) => setRecipientId(event.target.value)}
                placeholder={copy.chat.recipientPlaceholder}
              />
            </label>
          </div>

          <div className="chat-transcript" aria-label={copy.chat.historyLabel}>
            {messages.length === 0 && <p className="chat-empty">{copy.chat.empty}</p>}
            {messages.map((message) => {
              const isMine = message.senderId === senderId;
              return (
                <article className={isMine ? "chat-message is-mine" : "chat-message"} key={messageKey(message)}>
                  <span>{isMine ? displayName : message.senderId}</span>
                  <p>{message.text}</p>
                </article>
              );
            })}
          </div>

          <form className="chat-composer" onSubmit={sendMessage}>
            <label>
              {copy.chat.message}
              <textarea
                value={text}
                onChange={(event) => setText(event.target.value)}
                placeholder={copy.chat.messagePlaceholder}
                required
              />
            </label>
            <button type="submit" className="primary-button">{copy.chat.send}</button>
          </form>

          {status && <p className="form-message" role="status">{status}</p>}
        </div>
      </div>
    </section>
  );
}
