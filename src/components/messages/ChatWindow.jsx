import { useState } from "react";
import Card from "../ui/Card.jsx";
import MessageBubble from "./MessageBubble.jsx";

export default function ChatWindow({ thread, onSendMessage }) {
  const [draft, setDraft] = useState("");

  function handleSend() {
    if (!draft.trim()) {
      return;
    }

    onSendMessage?.(draft);
    setDraft("");
  }

  return (
    <Card className="chat-window">
      {thread ? (
        <>
          <div className="chat-window__header">
            <div>
              <span className="card-kicker">{thread.role}</span>
              <h2 className="card-title">{thread.name}</h2>
            </div>
            <span className="status-pill">{thread.status}</span>
          </div>

          <div className="message-stack">
            {thread.messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
          </div>

          <div className="chat-compose">
            <textarea
              className="textarea chat-compose__input"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="Write a reply..."
            />
            <div className="chat-compose__actions">
              <button className="button button--ghost" type="button" onClick={() => setDraft("")}>
                Clear
              </button>
              <button className="button button--primary" type="button" onClick={handleSend}>
                Send
              </button>
            </div>
          </div>
        </>
      ) : (
        <>
          <h2 className="card-title">No conversation selected.</h2>
          <p className="card-copy">Choose a thread from the left to open the chat window.</p>
        </>
      )}
    </Card>
  );
}
