import { useState } from "react";
import { getSessionUser, saveStartupSuggestion } from "../../services/storage.js";

export default function CommentSection({ comments = [], startup }) {
  const [draft, setDraft] = useState("");
  const [localComments, setLocalComments] = useState(comments);

  function handleAddComment() {
    if (!draft.trim()) {
      return;
    }
    const currentUser = getSessionUser();
    const trimmedDraft = draft.trim();

    setLocalComments((current) => [
      ...current,
      {
        id: `local-${Date.now()}`,
        author: currentUser?.name?.trim() || "You",
        text: trimmedDraft,
        time: "Just now",
      },
    ]);
    saveStartupSuggestion({
      startup,
      user: currentUser,
      text: trimmedDraft,
    });
    setDraft("");
  }

  return (
    <div className="comment-section">
      <div className="comment-list">
        {localComments.map((item) => (
          <div key={item.id} className="comment-item">
            <strong>{item.author}</strong>
            <p>{item.text}</p>
            <span>{item.time}</span>
          </div>
        ))}
      </div>

      <div className="comment-compose">
        <textarea
          className="textarea textarea--compact"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Add a thoughtful comment"
        />
        <button className="button button--ghost comment-compose__button" type="button" onClick={handleAddComment}>
          Comment
        </button>
      </div>
    </div>
  );
}
