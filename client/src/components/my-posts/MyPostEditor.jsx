import { useAppContext } from "../../contexts/AppContext.jsx";
export function MyPostEditor({ editor, isSaving, onChange, onSubmit, onCancel }) {
  const { copy } = useAppContext();

  if (!editor.id) {
    return (
      <div className="my-post-editor empty">
        <h3>{copy.myPosts.editorTitle}</h3>
        <p>{copy.myPosts.noSelection}</p>
      </div>
    );
  }

  return (
    <form className="my-post-editor" onSubmit={onSubmit}>
      <h3>{copy.myPosts.editorTitle}</h3>
      <label>
        {copy.feed.contentLabel}
        <textarea name="content" value={editor.content} onChange={onChange} required />
      </label>
      <label>
        {copy.feed.tagsLabel}
        <input name="tags" value={editor.tags} onChange={onChange} />
      </label>
      <div className="my-post-editor-actions">
        <button type="submit" className="primary-button" disabled={isSaving}>
          {isSaving ? copy.myPosts.saving : copy.myPosts.save}
        </button>
        <button type="button" className="secondary-button" onClick={onCancel}>
          {copy.myPosts.cancel}
        </button>
      </div>
    </form>
  );
}
