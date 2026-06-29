import { useEffect, useRef, useState } from "react";
import { createChatClient } from "../realtime/chatClient.js";
import { ChatComposer, ChatRoomControls, ChatSidebar, ChatTranscript } from "./chat";

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
        <ChatSidebar activeRoomId={activeRoomId} copy={copy} displayName={displayName} />

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

          <ChatRoomControls
            copy={copy}
            onRecipientChange={(event) => setRecipientId(event.target.value)}
            onRoomChange={(event) => setRoomId(event.target.value)}
            recipientId={recipientId}
            roomId={roomId}
          />

          <ChatTranscript copy={copy} displayName={displayName} messages={messages} senderId={senderId} />

          <ChatComposer
            copy={copy}
            onSubmit={sendMessage}
            onTextChange={(event) => setText(event.target.value)}
            text={text}
          />

          {status && <p className="form-message" role="status">{status}</p>}
        </div>
      </div>
    </section>
  );
}
