export function ChatComposer({ copy, onSubmit, onTextChange, text }) {
  return (
    <form className="chat-composer" onSubmit={onSubmit}>
      <label>
        {copy.chat.message}
        <textarea
          value={text}
          onChange={onTextChange}
          placeholder={copy.chat.messagePlaceholder}
          required
        />
      </label>
      <button type="submit" className="primary-button">{copy.chat.send}</button>
    </form>
  );
}
