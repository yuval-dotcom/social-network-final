import { useAppContext } from "../../contexts/AppContext.jsx";
export function ChatComposer({ onSubmit, onTextChange, text }) {
  const { copy } = useAppContext();

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
      <button type="submit" className="primary-button">
        {copy.chat.send}
      </button>
    </form>
  );
}
