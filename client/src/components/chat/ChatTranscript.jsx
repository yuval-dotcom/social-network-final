import { useAppContext } from "../../contexts/AppContext.jsx";
function messageKey(message) {
  return message.id || `${message.senderId}-${message.createdAt}-${message.text}`;
}

export function ChatTranscript({ displayName, messages, senderId }) {
  const { copy } = useAppContext();

  return (
    <div className="chat-transcript" aria-label={copy.chat.historyLabel}>
      {messages.length === 0 && <p className="chat-empty">{copy.chat.empty}</p>}
      {messages.map((message) => {
        const isMine = message.senderId === senderId;
        return (
          <article
            className={isMine ? "chat-message is-mine" : "chat-message"}
            key={messageKey(message)}
          >
            <span>{isMine ? displayName : message.senderId}</span>
            <p>{message.text}</p>
          </article>
        );
      })}
    </div>
  );
}
