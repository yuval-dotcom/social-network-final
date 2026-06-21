import { useEffect, useRef, useState } from "react";
import { createChatClient } from "../realtime/chatClient.js";

export function ChatPanel({ copy, clientFactory = createChatClient }) {
  const clientRef = useRef(null);
  const [roomId, setRoomId] = useState("general");
  const [senderId, setSenderId] = useState("");
  const [recipientId, setRecipientId] = useState("");
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    clientRef.current = clientFactory();
    clientRef.current.onMessage((message) => {
      setMessages((current) => [...current, message]);
    });

    return () => clientRef.current?.disconnect();
  }, [clientFactory]);

  function joinRoom() {
    clientRef.current.join(roomId);
    clientRef.current.loadHistory(roomId, (history) => setMessages(history || []));
  }

  function sendMessage(event) {
    event.preventDefault();
    clientRef.current.send({ roomId, senderId, recipientId, text }, (result) => {
      if (result?.success) setText("");
    });
  }

  return (
    <section className="panel" id="chat">
      <div className="panel-heading">
        <h2>{copy.chat.title}</h2>
        <button type="button" onClick={joinRoom}>{copy.chat.join}</button>
      </div>
      <form className="form-grid" onSubmit={sendMessage}>
        <label>{copy.chat.room}<input value={roomId} onChange={(event) => setRoomId(event.target.value)} required /></label>
        <label>{copy.crud.authorId}<input value={senderId} onChange={(event) => setSenderId(event.target.value)} required /></label>
        <label>{copy.chat.recipient}<input value={recipientId} onChange={(event) => setRecipientId(event.target.value)} /></label>
        <label className="wide-field">{copy.chat.message}<textarea value={text} onChange={(event) => setText(event.target.value)} required /></label>
        <button type="submit" className="primary-button">{copy.chat.send}</button>
      </form>
      <ul className="result-list" aria-label={copy.chat.title}>
        {messages.map((message) => (
          <li key={message.id || `${message.senderId}-${message.createdAt}-${message.text}`}>
            <strong>{message.senderId}</strong>: {message.text}
          </li>
        ))}
      </ul>
    </section>
  );
}

